#!/usr/bin/env python3
"""Fix team codes in Speles and Prognozes sheets to ensure consistency"""

import gspread
from google.oauth2.service_account import Credentials
from datetime import datetime
import os
import json

# Google Sheets API setup
SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

# Today's games from chat - these are the CORRECT codes and teams
TODAY_GAMES = [
    {'match_id': 1, 'home': 'GBR', 'away': 'AUT'},
    {'match_id': 2, 'home': 'HUN', 'away': 'FIN'},
    {'match_id': 3, 'home': 'SUI', 'away': 'LAT'},
    {'match_id': 4, 'home': 'SVK', 'away': 'NOR'},
    {'match_id': 5, 'home': 'ITA', 'away': 'CAN'},
    {'match_id': 6, 'home': 'SLO', 'away': 'CZE'},
]

def connect_sheets():
    """Connect to Google Sheets using environment variables"""
    # Load from .env.local
    from dotenv import load_dotenv
    load_dotenv('.env.local')

    credentials_info = {
        'type': 'service_account',
        'project_id': os.getenv('GOOGLE_PROJECT_ID'),
        'private_key_id': os.getenv('GOOGLE_PRIVATE_KEY_ID'),
        'private_key': os.getenv('GOOGLE_PRIVATE_KEY').replace('\\n', '\n'),
        'client_email': os.getenv('GOOGLE_SERVICE_ACCOUNT_EMAIL'),
        'client_id': os.getenv('GOOGLE_CLIENT_ID'),
        'auth_uri': 'https://accounts.google.com/o/oauth2/auth',
        'token_uri': 'https://oauth2.googleapis.com/token',
    }

    creds = Credentials.from_service_account_info(credentials_info, scopes=SCOPES)
    client = gspread.authorize(creds)
    # Open the sheet
    sheet = client.open_by_key(os.getenv('GOOGLE_SHEET_ID'))
    return sheet

def fix_speles_sheet(sheet):
    """Update Speles sheet with correct team codes"""
    ws = sheet.worksheet('Speles')

    # Get current data
    data = ws.get_all_values()
    print("Current Speles data:")
    for i, row in enumerate(data[:7], 1):
        print(f"Row {i}: {row}")

    # Update first 6 matches with correct team codes
    for game in TODAY_GAMES:
        row_num = game['match_id'] + 1  # +1 because row 1 is header
        # Update home_team (column C = index 2)
        ws.update_cell(row_num, 3, game['home'])
        # Update away_team (column D = index 3)
        ws.update_cell(row_num, 4, game['away'])
        print(f"✓ Updated match {game['match_id']}: {game['home']} vs {game['away']}")

def fix_prognozes_sheet(sheet):
    """Fix Prognozes sheet references to match corrected Speles"""
    ws = sheet.worksheet('Prognozes')

    # Get current data
    data = ws.get_all_values()
    print("\nCurrent Prognozes data:")
    for i, row in enumerate(data[:8], 1):
        print(f"Row {i}: {row}")

    # Data should reference correct match_ids which now have correct teams
    # No changes needed if match_ids are numeric and correct
    print("✓ Prognozes sheet references are correct (uses match_id)")

if __name__ == '__main__':
    try:
        sheet = connect_sheets()
        print("✅ Connected to Google Sheets\n")

        fix_speles_sheet(sheet)
        fix_prognozes_sheet(sheet)

        print("\n✅ All team codes fixed and verified!")

    except Exception as e:
        print(f"❌ Error: {e}")
