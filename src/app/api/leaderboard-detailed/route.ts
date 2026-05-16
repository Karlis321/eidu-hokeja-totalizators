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

    // Get match headers (columns with game matchups like GBR-AUT, HUN-FIN, etc.)
    const headers = data[0] || [];
    const matchNames = headers.slice(1, headers.length - 4); // All columns except Player, Kopā, 3p, 2p, 1p

    const leaderboard = data.slice(1)
      .filter((row: any[]) => row[0]) // Filter out empty rows
      .map((row: any[]) => {
        const playerName = row[0];
        const matchPoints: { name: string; points: number }[] = [];

        // Extract match points with names
        for (let i = 0; i < matchNames.length; i++) {
          matchPoints.push({
            name: matchNames[i] || `Match ${i + 1}`,
            points: parseInt(row[i + 1]) || 0,
          });
        }

        const totalPoints = parseInt(row[matchNames.length + 1]) || 0;
        const points3 = parseInt(row[matchNames.length + 2]) || 0;
        const points2 = parseInt(row[matchNames.length + 3]) || 0;
        const points1 = parseInt(row[matchNames.length + 4]) || 0;

        return {
          player_name: playerName,
          match_points: matchPoints, // [{name: "GBR-AUT", points: 3}, ...]
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
