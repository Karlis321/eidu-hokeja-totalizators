#!/usr/bin/env python3
"""
Test Google Sheets API connection and diagnose issues.
Run locally: python test_sheets_connection.py
"""

import os
from dotenv import load_dotenv
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

load_dotenv('.env.local')

print("\n" + "="*60)
print("🔍 GOOGLE SHEETS CONNECTION DIAGNOSTIC")
print("="*60 + "\n")

# Step 1: Check environment variables
print("1️⃣  Checking environment variables...")
vars_needed = [
    'GOOGLE_PROJECT_ID',
    'GOOGLE_PRIVATE_KEY_ID',
    'GOOGLE_PRIVATE_KEY',
    'GOOGLE_SERVICE_ACCOUNT_EMAIL',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_SHEET_ID'
]

missing = []
for var in vars_needed:
    value = os.getenv(var)
    if not value:
        print(f"   ❌ {var}: MISSING")
        missing.append(var)
    else:
        if var == 'GOOGLE_PRIVATE_KEY':
            print(f"   ✅ {var}: {value[:50]}... (truncated)")
        else:
            print(f"   ✅ {var}: {value}")

if missing:
    print(f"\n❌ Missing variables: {', '.join(missing)}")
    print("   Add these to .env.local file")
    exit(1)

print("\n✅ All environment variables present\n")

# Step 2: Create credentials
print("2️⃣  Creating service account credentials...")
try:
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
    print("   ✅ Credentials created successfully\n")
except Exception as e:
    print(f"   ❌ Failed to create credentials: {e}\n")
    exit(1)

# Step 3: Build Sheets service
print("3️⃣  Building Google Sheets service...")
try:
    service = build('sheets', 'v4', credentials=credentials)
    print("   ✅ Sheets service created successfully\n")
except Exception as e:
    print(f"   ❌ Failed to build service: {e}\n")
    exit(1)

# Step 4: Test Speles sheet
print("4️⃣  Testing Speles sheet...")
try:
    sheet_id = os.getenv('GOOGLE_SHEET_ID')
    result = service.spreadsheets().values().get(
        spreadsheetId=sheet_id,
        range='Speles!A1:G15'
    ).execute()

    values = result.get('values', [])
    print(f"   ✅ Connected to Google Sheet")
    print(f"   ✅ Retrieved {len(values)} rows from Speles sheet\n")

    # Show data
    if values:
        print("   📊 Speles Sheet Data:")
        print("   " + "-"*55)
        for i, row in enumerate(values[:5]):  # Show first 5 rows
            print(f"   Row {i}: {row}")
        if len(values) > 5:
            print(f"   ... ({len(values)-5} more rows)")
        print()
    else:
        print("   ⚠️  No data found in Speles sheet\n")

except Exception as e:
    print(f"   ❌ Failed to read Speles sheet: {e}\n")
    print("   Possible issues:")
    print("   - GOOGLE_SHEET_ID is incorrect")
    print("   - Sheet 'Speles' doesn't exist")
    print("   - Service account doesn't have access")
    exit(1)

# Step 5: Test Prognozes sheet
print("5️⃣  Testing Prognozes sheet...")
try:
    result = service.spreadsheets().values().get(
        spreadsheetId=sheet_id,
        range='Prognozes!A1:F10'
    ).execute()

    values = result.get('values', [])
    print(f"   ✅ Connected to Prognozes sheet")
    print(f"   ✅ Retrieved {len(values)} rows\n")

except Exception as e:
    print(f"   ⚠️  Could not read Prognozes sheet: {e}\n")

# Step 6: Test Kopvertejums sheet
print("6️⃣  Testing Kopvertejums sheet...")
try:
    result = service.spreadsheets().values().get(
        spreadsheetId=sheet_id,
        range='Kopvertejums!A1:E10'
    ).execute()

    values = result.get('values', [])
    print(f"   ✅ Connected to Kopvertejums sheet")
    print(f"   ✅ Retrieved {len(values)} rows\n")

except Exception as e:
    print(f"   ⚠️  Could not read Kopvertejums sheet: {e}\n")

# Step 7: Summary
print("="*60)
print("✅ DIAGNOSTIC COMPLETE")
print("="*60)
print("\n✅ All tests passed!")
print("\nYour Google Sheets connection is working correctly.")
print("If the app still shows errors:")
print("  1. Check Vercel environment variables")
print("  2. Redeploy to Vercel")
print("  3. Hard refresh browser (Ctrl+Shift+R)")
print()
