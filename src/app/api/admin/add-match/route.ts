import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export const dynamic = 'force-dynamic';
const sheets = google.sheets('v4');

export async function POST(req: NextRequest) {
  try {
    // Security: Check admin secret
    const authHeader = req.headers.get('authorization');
    if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { match_id, date_time, home_team, away_team, status } = await req.json();

    // Validate required fields
    if (!match_id || !date_time || !home_team || !away_team) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: match_id, date_time, home_team, away_team' },
        { status: 400 }
      );
    }

    // Check environment variables
    const missingVars = [];
    if (!process.env.GOOGLE_PROJECT_ID) missingVars.push('GOOGLE_PROJECT_ID');
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) missingVars.push('GOOGLE_SERVICE_ACCOUNT_EMAIL');
    if (!process.env.GOOGLE_PRIVATE_KEY) missingVars.push('GOOGLE_PRIVATE_KEY');
    if (!process.env.GOOGLE_SHEET_ID) missingVars.push('GOOGLE_SHEET_ID');

    if (missingVars.length > 0) {
      console.error(`[/api/admin/add-match] Missing environment variables: ${missingVars.join(', ')}`);
      return NextResponse.json({ success: false, error: 'Google Sheets not configured' }, { status: 500 });
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
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    // Append new match to Speles sheet
    await sheets.spreadsheets.values.append({
      auth,
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Speles!A:G',
      valueInputOption: 'RAW',
      requestBody: {
        values: [[match_id, date_time, home_team, away_team, '', '', status || 'upcoming']],
      } as any,
    });

    console.log(`[/api/admin/add-match] Added match: ${home_team} vs ${away_team}`);
    return NextResponse.json({ success: true, message: 'Match added successfully' }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[/api/admin/add-match] Error adding match:', errorMessage);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
