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
    const sheets = await getSheets();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      return NextResponse.json(
        { message: 'Konfigurācijas kļūda', matches: [] },
        { status: 500 }
      );
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Speles!A:G',
    });

    const rows = response.data.values || [];
    const matches = rows.slice(1).map((row) => ({
      match_id: row[0],
      date_time: row[1],
      home_team: row[2],
      away_team: row[3],
      home_score: row[4] ? parseInt(row[4], 10) : undefined,
      away_score: row[5] ? parseInt(row[5], 10) : undefined,
      status: row[6] || 'upcoming',
    }));

    return NextResponse.json({ matches }, { status: 200 });
  } catch (error) {
    console.error('Kļūda:', error);
    return NextResponse.json(
      {
        message: `Kļūda: ${error instanceof Error ? error.message : 'Nezināma kļūda'}`,
        matches: [],
      },
      { status: 500 }
    );
  }
}
