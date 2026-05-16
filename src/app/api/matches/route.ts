import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const sheets = google.sheets('v4');

export async function GET() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: 'service_account',
        projectId: process.env.GOOGLE_PROJECT_ID,
        privateKeyId: process.env.GOOGLE_PRIVATE_KEY_ID,
        privateKey: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        clientId: process.env.GOOGLE_CLIENT_ID,
        authUri: 'https://accounts.google.com/o/oauth2/auth',
        tokenUri: 'https://oauth2.googleapis.com/token',
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const response = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Speles!A2:G1000',
    });

    const matches = (response.data.values || []).map((row: any[]) => ({
      match_id: row[0],
      date_time: row[1],
      home_team: row[2],
      away_team: row[3],
      home_score: row[4] || '',
      away_score: row[5] || '',
      status: row[6] || 'upcoming',
    }));

    return NextResponse.json(matches);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
