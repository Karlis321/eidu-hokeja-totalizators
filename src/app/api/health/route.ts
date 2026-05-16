import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const envCheck = {
    GOOGLE_PROJECT_ID: process.env.GOOGLE_PROJECT_ID ? '✓ Set' : '✗ Missing',
    GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? '✓ Set' : '✗ Missing',
    GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY ? '✓ Set' : '✗ Missing',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? '✓ Set' : '✗ Missing',
    GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID ? '✓ Set' : '✗ Missing',
    CRON_SECRET: process.env.CRON_SECRET ? '✓ Set' : '✗ Missing',
    USER_EMAIL: process.env.USER_EMAIL ? '✓ Set' : '✗ Missing',
  };

  const allSet = Object.values(envCheck).every((v) => v.includes('✓'));

  return NextResponse.json(
    {
      status: allSet ? 'OK' : 'INCOMPLETE',
      environment_variables: envCheck,
      message: allSet
        ? 'All environment variables are configured'
        : 'Some environment variables are missing. Check Vercel project settings.',
    },
    { status: allSet ? 200 : 500 }
  );
}
