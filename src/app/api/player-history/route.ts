import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

const sheets = google.sheets('v4');

export async function GET(req: NextRequest) {
  try {
    const playerName = req.nextUrl.searchParams.get('player');

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

    const prognozesRes = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Prognozes!A2:F1000',
    });

    const spelesRes = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Speles!A2:G1000',
    });

    const predictions = prognozesRes.data.values || [];
    const matches = spelesRes.data.values || [];

    const matchMap: any = {};
    matches.forEach((row: any[]) => {
      matchMap[row[0]] = {
        home_team: row[2],
        away_team: row[3],
        home_score: row[4],
        away_score: row[5],
      };
    });

    const playerPredictions = predictions
      .filter((row: any[]) => row[1] === playerName)
      .map((row: any[]) => {
        const match = matchMap[row[2]];
        const points = calculatePoints(
          parseInt(row[3]),
          parseInt(row[4]),
          parseInt(match?.home_score || 0),
          parseInt(match?.away_score || 0)
        );

        return {
          match_id: row[2],
          home_team: match?.home_team || '?',
          away_team: match?.away_team || '?',
          predicted_home: parseInt(row[3]),
          predicted_away: parseInt(row[4]),
          home_score: match?.home_score || '?',
          away_score: match?.away_score || '?',
          points,
        };
      });

    return NextResponse.json(playerPredictions);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

function calculatePoints(predHome: number, predAway: number, actHome: number, actAway: number): number {
  if (predHome === actHome && predAway === actAway) return 3;

  const predWinner = predHome > predAway ? 1 : predAway > predHome ? 2 : 0;
  const actWinner = actHome > actAway ? 1 : actAway > actHome ? 2 : 0;

  const homeCorrect = predHome === actHome;
  const awayCorrect = predAway === actAway;
  const winnerCorrect = predWinner === actWinner;

  if (winnerCorrect && (homeCorrect || awayCorrect)) return 2;
  if (winnerCorrect || homeCorrect || awayCorrect) return 1;
  return 0;
}
