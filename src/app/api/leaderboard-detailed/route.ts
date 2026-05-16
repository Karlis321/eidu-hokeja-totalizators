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
      console.error(`[/api/leaderboard-detailed] Missing environment variables: ${missingVars.join(', ')}`);
      return NextResponse.json([], { status: 200 });
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: 'service_account',
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
      } as any,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    // Get Kopvertejums data
    const kopvertejumsRes = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Kopvertejums!A1:Q1000',
    });

    const data = kopvertejumsRes.data.values || [];

    // Parse header row
    const headers = data[0] || [];

    // Parse player rows
    const leaderboard = data.slice(1)
      .filter((row: any[]) => row[0]) // Filter out empty rows
      .map((row: any[]) => {
        const playerName = row[0];
        const matchPoints: number[] = [];

        // Extract match points (columns B-M = indices 1-12)
        for (let i = 1; i <= 12; i++) {
          matchPoints.push(parseInt(row[i]) || 0);
        }

        const totalPoints = parseInt(row[13]) || 0;
        const points3 = parseInt(row[14]) || 0;
        const points2 = parseInt(row[15]) || 0;
        const points1 = parseInt(row[16]) || 0;

        return {
          player_name: playerName,
          match_points: matchPoints, // [0, 3, 2, 1, 0, 2, ...]
          total_points: totalPoints,
          points_3: points3,
          points_2: points2,
          points_1: points1,
        };
      })
      .sort((a, b) => b.total_points - a.total_points);

    return NextResponse.json(leaderboard, { status: 200 });
  } catch (error) {
    console.error('[/api/leaderboard-detailed] Error:', error instanceof Error ? error.message : String(error));
    return NextResponse.json([], { status: 200 });
  }
}
