import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

const sheets = google.sheets('v4');

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const today = new Date().toISOString().split('T')[0];

    const response = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Speles!A2:G1000',
    });

    const games = (response.data.values || [])
      .map((row: any[], idx: number) => ({
        row_index: idx + 2,
        match_id: row[0],
        date_time: row[1],
        home_score: row[4],
        away_score: row[5],
        status: row[6],
      }))
      .filter((g: any) => {
        const gameDate = g.date_time?.split('T')[0];
        return gameDate === today && g.status === 'upcoming';
      });

    for (const game of games) {
      await sheets.spreadsheets.values.update({
        auth,
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: `Speles!G${game.row_index}`,
        valueInputOption: 'RAW',
        requestBody: { values: [['finished']] },
      });
    }

    return NextResponse.json({ success: true, updated: games.length });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
