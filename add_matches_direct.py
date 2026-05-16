#!/usr/bin/env python3
"""
Script to add tomorrow's hockey games directly to Google Sheets.
No API server needed - writes directly using Google Sheets API.
"""

import json
import base64
from datetime import datetime, timedelta
from google.oauth2.service_account import Credentials
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

def create_service_account_credentials():
    """Create credentials from environment variables"""
    creds_dict = {
        "type": "service_account",
        "project_id": os.getenv('GOOGLE_PROJECT_ID'),
        "private_key_id": os.getenv('GOOGLE_PRIVATE_KEY_ID'),
        "private_key": os.getenv('GOOGLE_PRIVATE_KEY').replace('\\n', '\n'),
        "client_email": os.getenv('GOOGLE_SERVICE_ACCOUNT_EMAIL'),
        "client_id": os.getenv('GOOGLE_CLIENT_ID'),
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
    }

    credentials = Credentials.from_service_account_info(
        creds_dict,
        scopes=['https://www.googleapis.com/auth/spreadsheets']
    )
    return credentials

def add_matches_to_sheets():
    """Add games directly to Google Sheets"""

    try:
        # Get credentials and build service
        credentials = create_service_account_credentials()
        service = build('sheets', 'v4', credentials=credentials)

        sheet_id = os.getenv('GOOGLE_SHEET_ID')

        # Calculate tomorrow's date
        tomorrow = datetime.now() + timedelta(days=1)
        tomorrow_str = tomorrow.strftime('%Y-%m-%d')

        print(f"\n🏒 Adding IIHF World Championship games for {tomorrow_str}\n")

        # Games for May 17, 2026
        games = [
            ['1', f'{tomorrow_str}T10:20:00Z', 'ITA', 'SVK', '', '', 'upcoming'],
            ['2', f'{tomorrow_str}T10:20:00Z', 'GBR', 'USA', '', '', 'upcoming'],
            ['3', f'{tomorrow_str}T14:20:00Z', 'AUT', 'HUN', '', '', 'upcoming'],
            ['4', f'{tomorrow_str}T14:20:00Z', 'SWE', 'DEN', '', '', 'upcoming'],
            ['5', f'{tomorrow_str}T18:20:00Z', 'GER', 'LAT', '', '', 'upcoming'],
            ['6', f'{tomorrow_str}T18:20:00Z', 'NOR', 'SLO', '', '', 'upcoming'],
        ]

        # Append to Speles sheet
        body = {
            'values': games
        }

        result = service.spreadsheets().values().append(
            spreadsheetId=sheet_id,
            range='Speles!A:G',
            valueInputOption='RAW',
            body=body
        ).execute()

        # Print results
        updates = result.get('updates', {})
        updated_rows = updates.get('updatedRows', 0)

        print(f"✅ Added {updated_rows} games to Google Sheets:\n")
        for game in games:
            print(f"   {game[2]} vs {game[3]} at {game[1]}")

        print(f"\n✅ Check your Vercel app at: https://eidu-hokeja-totalizators.vercel.app\n")

        return True

    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == '__main__':
    required_vars = ['GOOGLE_PROJECT_ID', 'GOOGLE_PRIVATE_KEY', 'GOOGLE_SERVICE_ACCOUNT_EMAIL', 'GOOGLE_SHEET_ID']
    missing = [v for v in required_vars if not os.getenv(v)]

    if missing:
        print(f'❌ Error: Missing environment variables: {", ".join(missing)}')
        exit(1)

    add_matches_to_sheets()
