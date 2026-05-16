import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export const dynamic = 'force-dynamic';

const sheets = google.sheets('v4');

/**
 * Generate Excel-like download with Kopvertejums data
 * Returns CSV format which Excel can open directly
 */
export async function GET() {
  try {
    const missingVars = [];
    if (!process.env.GOOGLE_PROJECT_ID) missingVars.push('GOOGLE_PROJECT_ID');
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) missingVars.push('GOOGLE_SERVICE_ACCOUNT_EMAIL');
    if (!process.env.GOOGLE_PRIVATE_KEY) missingVars.push('GOOGLE_PRIVATE_KEY');
    if (!process.env.GOOGLE_SHEET_ID) missingVars.push('GOOGLE_SHEET_ID');

    if (missingVars.length > 0) {
      console.error(`[/api/export-excel] Missing env vars: ${missingVars.join(', ')}`);
      return NextResponse.json({ error: 'Not configured' }, { status: 500 });
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

    // Get all three sheets
    const [spelesRes, prognosesRes, kopvertejumsRes] = await Promise.all([
      sheets.spreadsheets.values.get({
        auth,
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Speles!A1:G1000',
      }),
      sheets.spreadsheets.values.get({
        auth,
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Prognozes!A1:F1000',
      }),
      sheets.spreadsheets.values.get({
        auth,
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Kopvertejums!A1:Q1000',
      }),
    ]);

    // Convert to CSV format
    const csvContent = generateExcelCSV(
      spelesRes.data.values || [],
      prognosesRes.data.values || [],
      kopvertejumsRes.data.values || []
    );

    // Return as downloadable file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="EIDU_Hokeja_Totalizators_${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('[/api/export-excel] Error:', error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}

function generateExcelCSV(
  speles: any[],
  prognozes: any[],
  kopvertejums: any[]
): string {
  const lines: string[] = [];

  // UTF-8 BOM for Excel
  lines.push('﻿');

  // Section 1: Speles (Games)
  lines.push('=== SPĒLES ===');
  speles.forEach((row) => {
    lines.push(row.map((cell: any) => escapeCSV(cell)).join(','));
  });

  lines.push('');
  lines.push('');

  // Section 2: Prognozes (Predictions)
  lines.push('=== PROGNOZES ===');
  prognozes.forEach((row) => {
    lines.push(row.map((cell: any) => escapeCSV(cell)).join(','));
  });

  lines.push('');
  lines.push('');

  // Section 3: Kopvertejums (Results/Leaderboard)
  lines.push('=== KOPVĒRTĒJUMS ===');
  kopvertejums.forEach((row) => {
    lines.push(row.map((cell: any) => escapeCSV(cell)).join(','));
  });

  return lines.join('\n');
}

function escapeCSV(value: any): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  // If contains comma, quotes, or newline, wrap in quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}
