#!/usr/bin/env python3
"""
Fix Google Sheets data inconsistency.
Clears Speles!A2:G1000 and re-adds all 12 games with sequential match_id (1-12).
Run locally: python fix_sheet_data.py
"""

import os
from dotenv import load_dotenv
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

load_dotenv('.env.local')

def get_sheets_service():
    """Create Google Sheets service"""
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
    return build('sheets', 'v4', credentials=credentials)

def clear_sheet(service):
    """Clear Speles!A2:G1000"""
    try:
        service.spreadsheets().values().clear(
            spreadsheetId=os.getenv('GOOGLE_SHEET_ID'),
            range='Speles!A2:G1000'
        ).execute()
        print("✅ Cleared Speles!A2:G1000")
    except Exception as e:
        print(f"❌ Error clearing sheet: {e}")
        return False
    return True

def add_games(service):
    """Add all 12 games with sequential match_id"""
    games = [
        # May 16, 2026
        ['1', '2026-05-16T13:00:00Z', 'GBR', 'AUT', '', '', 'upcoming'],
        ['2', '2026-05-16T13:00:00Z', 'HUN', 'FIN', '', '', 'upcoming'],
        ['3', '2026-05-16T15:30:00Z', 'SWE', 'NOR', '', '', 'upcoming'],
        ['4', '2026-05-16T15:30:00Z', 'CZE', 'USA', '', '', 'upcoming'],
        ['5', '2026-05-16T18:00:00Z', 'LAT', 'GER', '', '', 'upcoming'],
        ['6', '2026-05-16T18:00:00Z', 'ITA', 'SVK', '', '', 'upcoming'],
        # May 17, 2026
        ['7', '2026-05-17T13:00:00Z', 'AUT', 'FIN', '', '', 'upcoming'],
        ['8', '2026-05-17T13:00:00Z', 'USA', 'GBR', '', '', 'upcoming'],
        ['9', '2026-05-17T15:30:00Z', 'NOR', 'CZE', '', '', 'upcoming'],
        ['10', '2026-05-17T15:30:00Z', 'SUI', 'LAT', '', '', 'upcoming'],
        ['11', '2026-05-17T18:00:00Z', 'GER', 'SWE', '', '', 'upcoming'],
        ['12', '2026-05-17T18:20:00Z', 'NOR', 'SLO', '', '', 'upcoming'],
    ]

    try:
        result = service.spreadsheets().values().append(
            spreadsheetId=os.getenv('GOOGLE_SHEET_ID'),
            range='Speles!A2:G',
            valueInputOption='RAW',
            body={'values': games}
        ).execute()

        updated_rows = result.get('updates', {}).get('updatedRows', 0)
        print(f"✅ Added {updated_rows} games with sequential match_id (1-12)")
        return True
    except Exception as e:
        print(f"❌ Error adding games: {e}")
        return False

if __name__ == '__main__':
    print("\n🔧 Fixing Google Sheets data inconsistency...\n")

    service = get_sheets_service()

    # Step 1: Clear existing data
    if not clear_sheet(service):
        print("❌ Failed to clear sheet. Aborting.")
        exit(1)

    # Step 2: Add games with sequential match_id
    if not add_games(service):
        print("❌ Failed to add games. Aborting.")
        exit(1)

    print("\n✅ Google Sheets data fixed successfully!\n")
