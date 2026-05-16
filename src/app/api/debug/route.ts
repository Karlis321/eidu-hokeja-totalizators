import { NextResponse } from 'next/server';
import { google } from 'googleapis';
export const dynamic = 'force-dynamic';

const sheets = google.sheets('v4');

export async function GET() {
  const debug: any = {
    envVars: {
      GOOGLE_PROJECT_ID: !!process.env.GOOGLE_PROJECT_ID,
      GOOGLE_PRIVATE_KEY_ID: !!process.env.GOOGLE_PRIVATE_KEY_ID,
      GOOGLE_PRIVATE_KEY: !!process.env.GOOGLE_PRIVATE_KEY,
      GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
      GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID,
    },
    tests: {},
  };

  try {
    // Test 1: Create auth
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
    debug.tests.authCreated = true;

    // Test 2: List sheets
    const spreadsheet = await sheets.spreadsheets.get({
      auth,
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
    });
    debug.tests.spreadsheetAccess = true;
    debug.sheetNames = spreadsheet.data.sheets?.map(s => s.properties?.title);

    // Test 3: Read Speles
    const speles = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Speles!A1:G5',
    });
    debug.tests.spelesRead = true;
    debug.speles = {
      rows: speles.data.values?.length,
      firstRow: speles.data.values?.[0],
    };

    // Test 4: Read Prognozes
    const prognozes = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Prognozes!A1:F5',
    });
    debug.tests.prognosesRead = true;
    debug.prognozes = {
      rows: prognozes.data.values?.length,
      firstRow: prognozes.data.values?.[0],
    };

    // Test 5: Read Kopvertejums
    const kopvertejums = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Kopvertejums!A1:E5',
    });
    debug.tests.kopvertejumsRead = true;
    debug.kopvertejums = {
      rows: kopvertejums.data.values?.length,
      firstRow: kopvertejums.data.values?.[0],
    };

    debug.allTests = true;
    return NextResponse.json(debug, { status: 200 });
  } catch (error) {
    debug.error = error instanceof Error ? error.message : String(error);
    debug.errorStack = error instanceof Error ? error.stack : '';
    return NextResponse.json(debug, { status: 200 });
  }
}
