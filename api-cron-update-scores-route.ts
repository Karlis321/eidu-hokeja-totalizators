import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

/**
 * GET /api/cron/update-scores
 * Aģents, kas pārbauda pabeigtas spēles un atjaunina punktus
 * Paredzēts Vercel Cron ar autentifikāciju: Authorization: Bearer <CRON_SECRET>
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

// Ļoti vienkārši tas ir fake hokeja rezultātu iegūšanas funkcija
// Reālā aplikācijā tu integrētos ar API.HOCKEY.app vai līdzīgu
async function fetchRealScores(matchId: string): Promise<{ home: number; away: number } | null> {
  try {
    // Piemērs: `matchId` ir "match_1", "match_2", utt.
    // Real world: Integrējies ar sporta API (ESPN, Hockey-Reference, utt.)
    // Pagaidām atgriežam null, ko nozīmē "dati nav pieejami"
    return null;
  } catch (error) {
    console.error(`Kļūda iegūstot rezultātus ${matchId}:`, error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  // Pārbaudi autentifikāciju
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || `Bearer ${cronSecret}` !== authHeader) {
    return NextResponse.json(
      { message: 'Neautorizēts' },
      { status: 401 }
    );
  }

  try {
    const sheets = await getSheets();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      return NextResponse.json(
        { message: 'Konfigurācijas kļūda: GOOGLE_SHEET_ID nav nosūtīts' },
        { status: 500 }
      );
    }

    // Iegūst spēles
    const speleResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Speles!A:G',
    });

    const speleRows = speleResponse.data.values || [];
    const updatedRows: Array<{ rowIndex: number; scores: { home: number; away: number } }> = [];

    // Pārbaudi katru spēli
    for (let i = 1; i < speleRows.length; i++) {
      const row = speleRows[i];
      const matchId = row[0];
      const status = row[6];

      if (status === 'finished') {
        continue; // Jau pabeigta
      }

      // Mēģina iegūt reālos rezultātus
      const scores = await fetchRealScores(matchId);

      if (scores) {
        updatedRows.push({
          rowIndex: i + 1, // Google Sheets ir 1-indexed
          scores,
        });
      }
    }

    // Atjaunina rindas, kam ir jauni rezultāti
    const updates = updatedRows.map((update) => ({
      range: `Speles!E${update.rowIndex}:F${update.rowIndex}`,
      values: [[update.scores.home, update.scores.away]],
    }));

    if (updates.length > 0) {
      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId,
        requestBody: {
          data: updates.map((u) => ({
            range: u.range,
            values: u.values,
            majorDimension: 'ROWS',
          })),
          valueInputOption: 'RAW',
        },
      });
    }

    // Atjaunina leaderboard
    await updateLeaderboard(sheets, spreadsheetId);

    return NextResponse.json(
      {
        message: 'Punkti atjaunināti',
        updatedMatches: updatedRows.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Cron kļūda:', error);
    return NextResponse.json(
      {
        message: `Kļūda: ${error instanceof Error ? error.message : 'Nezināma kļūda'}`,
      },
      { status: 500 }
    );
  }
}

async function updateLeaderboard(sheets: any, spreadsheetId: string) {
  try {
    // Iegūst spēles
    const speleResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Speles!A:G',
    });

    // Iegūst prognozes
    const prognozuResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Prognozes!A:F',
    });

    const speleRows = speleResponse.data.values || [];
    const prognozuRows = prognozuResponse.data.values || [];

    // Parsē spēles
    const matchesMap: Record<
      string,
      { home_score: number; away_score: number; status: string }
    > = {};

    speleRows.slice(1).forEach((row) => {
      matchesMap[row[0]] = {
        home_score: parseInt(row[4] || '0', 10),
        away_score: parseInt(row[5] || '0', 10),
        status: row[6] || 'upcoming',
      };
    });

    // Aprēķina punktus per spēlētāju
    const playerScores: Record<
      string,
      { points_3: number; points_2: number; points_1: number }
    > = {};

    prognozuRows.slice(1).forEach((row) => {
      const playerName = row[1];
      const matchId = row[2];
      const predictedHome = parseInt(row[3], 10);
      const predictedAway = parseInt(row[4], 10);

      const match = matchesMap[matchId];
      if (!match || match.status !== 'finished') {
        return;
      }

      const points = calculatePointsForMatch(
        predictedHome,
        predictedAway,
        match.home_score,
        match.away_score
      );

      if (!playerScores[playerName]) {
        playerScores[playerName] = { points_3: 0, points_2: 0, points_1: 0 };
      }

      if (points === 3) playerScores[playerName].points_3++;
      else if (points === 2) playerScores[playerName].points_2++;
      else if (points === 1) playerScores[playerName].points_1++;
    });

    // Atjaunina Kopvertejums
    const leaderboardRows = Object.entries(playerScores).map(([name, scores]) => [
      name,
      scores.points_3,
      scores.points_2,
      scores.points_1,
      scores.points_3 * 3 + scores.points_2 * 2 + scores.points_1 * 1,
    ]);

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Kopvertejums!A:E',
      valueInputOption: 'RAW',
      requestBody: {
        values: [
          ['player_name', 'points_3', 'points_2', 'points_1', 'total_points'],
          ...leaderboardRows,
        ],
      },
    });
  } catch (error) {
    console.error('Leaderboard atjaunināšanas kļūda:', error);
  }
}

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
