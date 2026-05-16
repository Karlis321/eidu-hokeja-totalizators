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
      range: 'Kopvertejums!A2:E1000',
    });

    const leaderboard = (response.data.values || []).map((row: any[]) => ({
      player_name: row[0],
      points_3: parseInt(row[1]) || 0,
      points_2: parseInt(row[2]) || 0,
      points_1: parseInt(row[3]) || 0,
      total_points: parseInt(row[4]) || 0,
    }));

    return NextResponse.json(leaderboard.sort((a, b) => b.total_points - a.total_points));
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
