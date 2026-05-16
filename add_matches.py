#!/usr/bin/env python3
"""
Script to add tomorrow's hockey games to Google Sheets via the app API.
Usage: python add_matches.py
"""

import requests
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

CRON_SECRET = os.getenv('CRON_SECRET')
BASE_URL = 'http://localhost:3000'  # Change to your Vercel URL when deployed

def add_match(match_id, date_time, home_team, away_team, status='upcoming'):
    """Add a single match to Google Sheets via API"""
    url = f'{BASE_URL}/api/admin/add-match'
    headers = {
        'Authorization': f'Bearer {CRON_SECRET}',
        'Content-Type': 'application/json'
    }

    payload = {
        'match_id': match_id,
        'date_time': date_time,
        'home_team': home_team,
        'away_team': away_team,
        'status': status
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=10)
        if response.status_code == 200:
            print(f'✅ Added: {home_team} vs {away_team} at {date_time}')
            return True
        else:
            print(f'❌ Failed: {response.status_code} - {response.text}')
            return False
    except Exception as e:
        print(f'❌ Error: {e}')
        return False

def main():
    """Add tomorrow's IIHF World Championship games"""

    # Calculate tomorrow's date
    tomorrow = datetime.now() + timedelta(days=1)
    tomorrow_str = tomorrow.strftime('%Y-%m-%d')

    print(f"\n🏒 Adding IIHF World Championship games for {tomorrow_str}\n")

    # IIHF World Championship 2026 - May 17 games
    games = [
        # (match_id, date_time, home_team, away_team)
        ('1', f'{tomorrow_str}T10:20:00Z', 'ITA', 'SVK'),
        ('2', f'{tomorrow_str}T10:20:00Z', 'GBR', 'USA'),
        ('3', f'{tomorrow_str}T14:20:00Z', 'AUT', 'HUN'),
        ('4', f'{tomorrow_str}T14:20:00Z', 'SWE', 'DEN'),
        ('5', f'{tomorrow_str}T18:20:00Z', 'GER', 'LAT'),
        ('6', f'{tomorrow_str}T18:20:00Z', 'NOR', 'SLO'),
    ]

    success_count = 0
    for match_id, date_time, home_team, away_team in games:
        if add_match(match_id, date_time, home_team, away_team):
            success_count += 1

    print(f"\n✅ Successfully added {success_count}/{len(games)} games\n")
    print("Check your app at http://localhost:3000 to see the games!\n")

if __name__ == '__main__':
    if not CRON_SECRET:
        print('❌ Error: CRON_SECRET not found in .env.local')
        exit(1)

    main()
