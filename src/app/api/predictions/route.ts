import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
export const dynamic = 'force-dynamic';

const sheets = google.sheets('v4');

export async function POST(req: NextRequest) {
  try {
    const { player_name, match_id, predicted_home, predicted_away } = await req.json();

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
      } as any,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const response = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Prognozes!A:A',
    });

    const prediction_id = (response.data.values?.length || 0) + 1;
    const timestamp = new Date().toISOString();

    await sheets.spreadsheets.values.append({
      auth,
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Prognozes!A:F',
      valueInputOption: 'RAW',
      requestBody: {
        values: [[prediction_id, player_name, match_id, predicted_home, predicted_away, timestamp]],
      } as any,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
