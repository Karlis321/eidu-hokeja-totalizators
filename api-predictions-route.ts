import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

/**
 * POST /api/predictions
 * Saglabā spēlētāja prognozes Google Sheets
 */

const getSheets = async () => {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      type: process.env.GOOGLE_TYPE,
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
      auth_uri: process.env.GOOGLE_AUTH_URI,
      token_uri: process.env.GOOGLE_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
      client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { player_name, predictions } = body;

    if (!player_name || !predictions || !Array.isArray(predictions)) {
      return NextResponse.json(
        { message: 'Nepilni dati' },
        { status: 400 }
      );
    }

    const sheets = await getSheets();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      return NextResponse.json(
        { message: 'Konfigurācijas kļūda: GOOGLE_SHEET_ID nav nosūtīts' },
        { status: 500 }
      );
    }

    // Iegūst esošo prognozes lapas rindas
    const existingResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Prognozes!A:F',
    });

    const existingRows = existingResponse.data.values || [];
    let nextRowId = 1;

    // Aprēķina nākamo prediction_id
    if (existingRows.length > 1) {
      const lastRow = existingRows[existingRows.length - 1];
      const lastId = parseInt(lastRow[0] || '0', 10);
      nextRowId = lastId + 1;
    }

    // Sagatavojas jauni dati ievietošanai
    const newRows = predictions.map((pred, index) => [
      nextRowId + index,
      player_name,
      pred.match_id,
      pred.predicted_home,
      pred.predicted_away,
      new Date().toISOString(),
    ]);

    // Ievieš rindas
    const appendResponse = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Prognozes!A:F',
      valueInputOption: 'RAW',
      requestBody: {
        values: newRows,
      },
    });

    // Aprēķina un atjaunina leaderboard
    await updateLeaderboard(sheets, spreadsheetId);

    return NextResponse.json(
      {
        message: 'Prognozes veiksmīgi saglabātas',
        appendedRows: appendResponse.data.updates?.updatedRows,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('API kļūda:', error);
    return NextResponse.json(
      {
        message: `Kļūda: ${error instanceof Error ? error.message : 'Nezināma kļūda'}`,
      },
      { status: 500 }
    );
  }
}

/**
 * Atjaunina Kopvertejums lapu, pamatojoties uz spēlēm un prognozēm
 */
async function updateLeaderboard(sheets: any, spreadsheetId: string) {
  try {
    // Iegūst visas spēles
    const speles = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Speles!A:G',
    });

    // Iegūst visas prognozes
    const prognozes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Prognozes!A:F',
    });

    const speleRows = speles.data.values || [];
    const prognozuRows = prognozes.data.values || [];

    // Parsē datus
    const matchesMap: Record<string, any> = {};
    speleRows.slice(1).forEach((row) => {
      matchesMap[row[0]] = {
        home_score: parseInt(row[4] || '0', 10),
        away_score: parseInt(row[5] || '0', 10),
        status: row[6],
      };
    });

    // Aprēķina punktus per spēlētāju
    const playerScores: Record<string, { points_3: number; points_2: number; points_1: number }> = {};

    prognozuRows.slice(1).forEach((row) => {
      const playerName = row[1];
      const matchId = row[2];
      const predictedHome = parseInt(row[3], 10);
      const predictedAway = parseInt(row[4], 10);

      if (!matchesMap[matchId] || matchesMap[matchId].status !== 'finished') {
        return; // Tikai pabeigtas spēles
      }

      const actualHome = matchesMap[matchId].home_score;
      const actualAway = matchesMap[matchId].away_score;

      const points = calculatePointsForMatch(
        predictedHome,
        predictedAway,
        actualHome,
        actualAway
      );

      if (!playerScores[playerName]) {
        playerScores[playerName] = { points_3: 0, points_2: 0, points_1: 0 };
      }

      if (points === 3) playerScores[playerName].points_3++;
      else if (points === 2) playerScores[playerName].points_2++;
      else if (points === 1) playerScores[playerName].points_1++;
    });

    // Atjaunina Kopvertejums lapu
    const leaderboardData = Object.entries(playerScores).map(([name, scores]) => [
      name,
      scores.points_3,
      scores.points_2,
      scores.points_1,
      scores.points_3 * 3 + scores.points_2 * 2 + scores.points_1 * 1,
    ]);

    // Notīra iepriekšējās rindas (atstāj tikai virsrakstu)
    const headerRow = [['player_name', 'points_3', 'points_2', 'points_1', 'total_points']];

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Kopvertejums!A:E',
      valueInputOption: 'RAW',
      requestBody: {
        values: [...headerRow, ...leaderboardData],
      },
    });
  } catch (error) {
    console.error('Leaderboard atjaunināšanas kļūda:', error);
  }
}

/**
 * Aprēķina punktus par vienu spēli
 */
function calculatePointsForMatch(
  predictedHome: number,
  predictedAway: number,
  actualHome: number,
  actualAway: number
): number {
  const predictedWinner = getWinner(predictedHome, predictedAway);
  const actualWinner = getWinner(actualHome, actualAway);

  if (predictedHome === actualHome && predictedAway === actualAway) {
    return 3;
  }

  const homeGoalsCorrect = predictedHome === actualHome;
  const awayGoalsCorrect = predictedAway === actualAway;
  const winnerCorrect = predictedWinner === actualWinner;

  if (winnerCorrect && (homeGoalsCorrect || awayGoalsCorrect)) {
    return 2;
  }

  if (winnerCorrect || homeGoalsCorrect || awayGoalsCorrect) {
    return 1;
  }

  return 0;
}

function getWinner(home: number, away: number): 0 | 1 | 2 {
  if (home > away) return 1;
  if (away > home) return 2;
  return 0;
}
