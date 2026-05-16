import { NextResponse } from 'next/server';
import { google } from 'googleapis';
export const dynamic = 'force-dynamic';

const sheets = google.sheets('v4');

export async function GET() {
  try {
    // Check if environment variables are set
    const missingVars = [];
    if (!process.env.GOOGLE_PROJECT_ID) missingVars.push('GOOGLE_PROJECT_ID');
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) missingVars.push('GOOGLE_SERVICE_ACCOUNT_EMAIL');
    if (!process.env.GOOGLE_PRIVATE_KEY) missingVars.push('GOOGLE_PRIVATE_KEY');
    if (!process.env.GOOGLE_SHEET_ID) missingVars.push('GOOGLE_SHEET_ID');

    if (missingVars.length > 0) {
      console.error(`[/api/matches] Missing environment variables: ${missingVars.join(', ')}`);
      return NextResponse.json([], { status: 200 });
    }

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

    return NextResponse.json(matches, { status: 200 });
  } catch (error) {
    console.error('[/api/matches] Error fetching matches:', error instanceof Error ? error.message : String(error));
    // Return empty array instead of error - frontend will handle gracefully
    return NextResponse.json([], { status: 200 });
  }
}
