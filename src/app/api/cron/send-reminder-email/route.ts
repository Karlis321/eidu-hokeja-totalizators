import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
export const dynamic = 'force-dynamic';

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
      } as any,
      scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/gmail.send'],
    });

    const tomorrow = new Date();
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    const tomorrowDateStr = tomorrow.toISOString().split('T')[0];

    // Fetch games from Flashscore API
    const flashscoreGames = await fetchTomorrowsGamesFromFlashscore(tomorrowDateStr);

    // Add fetched games to Google Sheets
    if (flashscoreGames.length > 0) {
      await addGamesToSheet(auth, flashscoreGames);
    }

    // Get all games for tomorrow from sheet (including newly added)
    const response = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Speles!A2:G1000',
    });

    const games = (response.data.values || [])
      .filter((row: any[]) => {
        const gameDate = row[1]?.split('T')[0];
        return gameDate === tomorrowDateStr;
      })
      .map((row: any[]) => ({
        home_team: row[2],
        away_team: row[3],
        date_time: row[1],
      }));

    if (games.length === 0) {
      return NextResponse.json({ success: true, message: 'No games tomorrow' });
    }

    const gamesText = formatGamesForEmail(games);
    await sendEmailReminder(auth, gamesText);

    return NextResponse.json({ success: true, games_count: games.length, fetched: flashscoreGames.length });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

async function fetchTomorrowsGamesFromFlashscore(dateStr: string): Promise<any[]> {
  try {
    // Flashscore doesn't have a free public API, so we'll use a workaround
    // Fetch from a sports data source that aggregates IIHF data
    const response = await fetch(`https://www.flashscore.com/hockey/world/world-championship/`);

    // For now, return empty array - actual scraping requires headless browser
    // Manual script (add_matches_direct.py) can be used as fallback
    console.log('[7PM Cron] Flashscore fetch attempted for', dateStr);
    return [];
  } catch (error) {
    console.error('[7PM Cron] Error fetching from Flashscore:', error);
    return [];
  }
}

async function addGamesToSheet(auth: any, games: any[]): Promise<void> {
  if (games.length === 0) return;

  const values = games.map(g => [g.match_id, g.date_time, g.home_team, g.away_team, '', '', 'upcoming']);

  await sheets.spreadsheets.values.append({
    auth,
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: 'Speles!A:G',
    valueInputOption: 'RAW',
    requestBody: { values },
  });

  console.log(`[7PM Cron] Added ${games.length} games to Google Sheets`);
}

function formatGamesForEmail(games: any[]): string {
  const countryData: { [key: string]: { flag: string; name: string } } = {
    AUT: { flag: '🇦🇹', name: 'Austrija' },
    CAN: { flag: '🇨🇦', name: 'Kanāda' },
    CZE: { flag: '🇨🇿', name: 'Čehija' },
    FIN: { flag: '🇫🇮', name: 'Somija' },
    GBR: { flag: '🇬🇧', name: 'Lielbritānija' },
    HUN: { flag: '🇭🇺', name: 'Ungārija' },
    ITA: { flag: '🇮🇹', name: 'Itālija' },
    LAT: { flag: '🇱🇻', name: 'Latvija' },
    NOR: { flag: '🇳🇴', name: 'Norvēģija' },
    SVK: { flag: '🇸🇰', name: 'Slovākija' },
    SLO: { flag: '🇸🇮', name: 'Slovēnija' },
    SUI: { flag: '🇨🇭', name: 'Šveice' },
  };

  let text = 'Hokeja spēles uz rīt:\n\n';
  games.forEach((game: any, i: number) => {
    const home = countryData[game.home_team] || { flag: '🏒', name: game.home_team };
    const away = countryData[game.away_team] || { flag: '🏒', name: game.away_team };
    const time = game.date_time.split('T')[1].substring(0, 5);
    text += `${i + 1}. ${home.flag} ${home.name} — ${away.flag} ${away.name} (${time})\n`;
  });

  return text;
}

async function sendEmailReminder(auth: any, gamesText: string) {
  const emailContent = `
Sveiks Kārlis! 👋

Neaizmirsti paziņot saviem ģimenes locekļiem par rīt gaidāmajām hokeja spēlēm! 🏒

${gamesText}

Piefiksē prognozes applikācijā: https://eidu-hokeja-totalizators.vercel.app

Vēlu veiksmīgu prognozēšanu! 🏆
  `;

  const gmail = google.gmail({ version: 'v1', auth });

  const message = [
    `From: ${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}`,
    `To: ${process.env.USER_EMAIL}`,
    'Subject: Hokeja spēles rīt - Neaizmirsti paziņot ģimeņu! 🏒',
    'Content-Type: text/plain; charset="UTF-8"',
    '',
    emailContent,
  ].join('\n');

  const encodedMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw: encodedMessage },
  });
}
