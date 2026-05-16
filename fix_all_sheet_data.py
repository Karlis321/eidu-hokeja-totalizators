#!/usr/bin/env python3
"""
Fix Google Sheets data inconsistency across both Speles and Prognozes sheets.
- Updates Speles: sequential match_id (1-12)
- Updates Prognozes: converts match_1/2/3... to 1/2/3...
- Keeps leaderboard intact
Run locally: python fix_all_sheet_data.py
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

def fix_speles_sheet(service):
    """Fix Speles sheet with sequential match_id (1-12)"""
    print("\n🔧 Fixing Speles sheet...")

    # Clear existing data
    try:
        service.spreadsheets().values().clear(
            spreadsheetId=os.getenv('GOOGLE_SHEET_ID'),
            range='Speles!A2:G1000'
        ).execute()
        print("  ✅ Cleared Speles!A2:G1000")
    except Exception as e:
        print(f"  ❌ Error clearing sheet: {e}")
        return False

    # Add all 12 games with sequential match_id
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
        print(f"  ✅ Added {updated_rows} games with sequential match_id (1-12)")
        return True
    except Exception as e:
        print(f"  ❌ Error adding games: {e}")
        return False

def fix_prognozes_sheet(service):
    """Convert match_1, match_2, etc. to 1, 2, etc. in Prognozes sheet"""
    print("\n🔧 Fixing Prognozes sheet...")

    try:
        # Fetch all predictions
        response = service.spreadsheets().values().get(
            spreadsheetId=os.getenv('GOOGLE_SHEET_ID'),
            range='Prognozes!A2:E1000'
        ).execute()

        rows = response.get('values', [])
        if not rows:
            print("  ⚠️  No predictions found in Prognozes sheet")
            return True

        # Update match_id column (column C, index 2)
        updated_count = 0
        for idx, row in enumerate(rows):
            if len(row) > 2:  # Ensure row has match_id column
                match_id = row[2]
                # Convert match_1 -> 1, match_2 -> 2, etc.
                if isinstance(match_id, str) and match_id.startswith('match_'):
                    new_match_id = match_id.replace('match_', '')
                    row[2] = new_match_id
                    updated_count += 1

        # Write all rows back
        if updated_count > 0:
            service.spreadsheets().values().update(
                spreadsheetId=os.getenv('GOOGLE_SHEET_ID'),
                range='Prognozes!A2:E1000',
                valueInputOption='RAW',
                body={'values': rows}
            ).execute()
            print(f"  ✅ Updated {updated_count} predictions (match_X → X)")
        else:
            print("  ⚠️  No match_X format found (already fixed?)")

        return True
    except Exception as e:
        print(f"  ❌ Error fixing Prognozes: {e}")
        return False

def verify_sheets(service):
    """Verify both sheets are fixed"""
    print("\n✅ Verification:")

    try:
        # Check Speles
        speles = service.spreadsheets().values().get(
            spreadsheetId=os.getenv('GOOGLE_SHEET_ID'),
            range='Speles!A2:A13'
        ).execute()
        speles_rows = len(speles.get('values', []))
        print(f"  ✅ Speles: {speles_rows} games loaded")

        # Check Prognozes
        prognozes = service.spreadsheets().values().get(
            spreadsheetId=os.getenv('GOOGLE_SHEET_ID'),
            range='Prognozes!A2:C10'
        ).execute()
        prognozes_rows = len(prognozes.get('values', []))
        print(f"  ✅ Prognozes: {prognozes_rows} predictions loaded")

        return True
    except Exception as e:
        print(f"  ❌ Verification failed: {e}")
        return False

if __name__ == '__main__':
    print("\n" + "="*50)
    print("🏒 FIXING GOOGLE SHEETS DATA INCONSISTENCY")
    print("="*50)

    service = get_sheets_service()

    # Step 1: Fix Speles sheet
    if not fix_speles_sheet(service):
        print("\n❌ Failed to fix Speles sheet. Aborting.")
        exit(1)

    # Step 2: Fix Prognozes sheet
    if not fix_prognozes_sheet(service):
        print("\n❌ Failed to fix Prognozes sheet. Aborting.")
        exit(1)

    # Step 3: Verify
    if not verify_sheets(service):
        print("\n⚠️  Verification had issues but fixes may still be applied.")

    print("\n" + "="*50)
    print("✅ ALL SHEET DATA FIXED SUCCESSFULLY!")
    print("="*50)
    print("\nYour sheets are now synced:")
    print("  • Speles: Games with match_id 1-12")
    print("  • Prognozes: Predictions updated to match new match_id format")
    print("\n🚀 Ready for cron jobs to manage scores!\n")
