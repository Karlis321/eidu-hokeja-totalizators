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
      console.error(`[/api/leaderboard] Missing environment variables: ${missingVars.join(', ')}`);
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
      range: 'Kopvertejums!A2:E1000',
    });

    const leaderboard = (response.data.values || []).map((row: any[]) => ({
      player_name: row[0],
      points_3: parseInt(row[1]) || 0,
      points_2: parseInt(row[2]) || 0,
      points_1: parseInt(row[3]) || 0,
      total_points: parseInt(row[4]) || 0,
    }));

    return NextResponse.json(leaderboard.sort((a, b) => b.total_points - a.total_points), { status: 200 });
  } catch (error) {
    console.error('[/api/leaderboard] Error fetching leaderboard:', error instanceof Error ? error.message : String(error));
    // Return empty array instead of error - frontend will handle gracefully
    return NextResponse.json([], { status: 200 });
  }
}
