import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const playerName = searchParams.get('player');

    if (!playerName) {
      return NextResponse.json(
        { message: 'Nepieciešams spēlētāja vārds', history: [] },
        { status: 400 }
      );
    }

    const sheets = await getSheets();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      return NextResponse.json(
        { message: 'Konfigurācijas kļūda', history: [] },
        { status: 500 }
      );
    }

    // Iegūst prognozes
    const prognozuResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Prognozes!A:F',
    });

    // Iegūst spēles
    const speleResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Speles!A:G',
    });

    const prognozuRows = prognozuResponse.data.values || [];
    const speleRows = speleResponse.data.values || [];

    // Parsē spēles
    const matchesMap: Record<string, any> = {};
    speleRows.slice(1).forEach((row) => {
      matchesMap[row[0]] = {
        home_team: row[2],
        away_team: row[3],
        home_score: row[4] ? parseInt(row[4], 10) : undefined,
        away_score: row[5] ? parseInt(row[5], 10) : undefined,
      };
    });

    // Filtrē prognožu un pievieno spēļu info
    const playerHistory = prognozuRows
      .slice(1)
      .filter((row) => row[1] === playerName)
      .map((row) => {
        const matchId = row[2];
        const match = matchesMap[matchId];
        return {
          prediction_id: row[0],
          player_name: row[1],
          match_id: matchId,
          match_display: match ? `${match.home_team} — ${match.away_team}` : matchId,
          predicted_home: parseInt(row[3], 10),
          predicted_away: parseInt(row[4], 10),
          actual: match?.home_score !== undefined && match?.away_score !== undefined
            ? { home: match.home_score, away: match.away_score }
            : undefined,
          timestamp: row[5],
        };
      });

    return NextResponse.json({ history: playerHistory }, { status: 200 });
  } catch (error) {
    console.error('Kļūda:', error);
    return NextResponse.json(
      {
        message: `Kļūda: ${error instanceof Error ? error.message : 'Nezināma kļūda'}`,
        history: [],
      },
      { status: 500 }
    );
  }
}
