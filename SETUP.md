# 🏒 EIDU ģimenes hokeja totalizators — Setup Instrukcijas

## 1. GOOGLE CLOUD & SHEETS API

### 1.1 Izveidot Google Cloud projektu
1. Aizej uz https://console.cloud.google.com/
2. Noklikšķini "Izveidot projektu"
3. Nosauc to "EIDU Totalizators"
4. Gaidi, līdz projekts ir aktivizēts

### 1.2 Aktivizēt Google Sheets API
1. Tapu uz "APIs & Services" → "Library"
2. Meklē "Google Sheets API"
3. Noklikšķini uz tā un pēc tam "Enable"

### 1.3 Izveidot Service Account
1. "APIs & Services" → "Credentials"
2. Noklikšķini "+ Create Credentials" → "Service Account"
3. Aizpildi formu:
   - **Service Account name**: `eidu-totalizators`
   - **Service Account ID**: (auto-generated, atstāj tādu)
4. Noklikšķini "Create and Continue"
5. Nākamajā lapā noklikšķini "Done" (pārlec pāri papildu soļiem)

### 1.4 Ģenerēt JSON atslēgu
1. Google Cloud Console atvērtie pēc 1.3, nāvi uz "Service Accounts"
2. Noklikšķini uz tikko izveidotā service account
3. Skaņa "Keys"
4. "+ Add Key" → "Create new key"
5. Izvēlies **JSON** un noklikšķini "Create"
6. Saglabā šo failu drošā vietā — **TAD VAR SATUR SLEPENĀS ATSLĒGAS**

Faila saturs izskatīsies šādi:
```json
{
  "type": "service_account",
  "project_id": "...",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "...",
  ...
}
```

### 1.5 Izveidot Google Sheet
1. Aizej uz https://sheets.google.com
2. Noklikšķini "+ Jauns" (New)
3. Nosauc to "EIDU Totalizators"
4. **Pārdēvē default "Sheet1" par "Speles"**
5. Pievienot kolonas (A, B, C, ...):
   - **A**: match_id
   - **B**: date_time
   - **C**: home_team
   - **D**: away_team
   - **E**: home_score
   - **F**: away_score
   - **G**: status

6. Noklikšķini "+" (pievienot jaunu lapu) un nosauc "Prognozes"
7. Pievienot kolonas:
   - **A**: prediction_id
   - **B**: player_name
   - **C**: match_id
   - **D**: predicted_home
   - **E**: predicted_away
   - **F**: timestamp

8. Noklikšķini "+" un nosauc "Kopvertejums"
9. Pievienot kolonas:
   - **A**: player_name
   - **B**: points_3
   - **C**: points_2
   - **D**: points_1
   - **E**: total_points

### 1.6 Dod pieejamību Service Account
1. Atver Google Sheet (EIDU Totalizators)
2. Noklikšķini "Share" (labajā augšējā stūrī)
3. Kopē **client_email** no JSON faila (solis 1.4)
4. Ielīmē to "Share" dialoga laukā
5. Dod tiesības: **Editor**
6. Noklikšķini "Share"

### 1.7 Kopēt Sheet ID
1. Nozīmē bar URL: `https://docs.google.com/spreadsheets/d/{ID}/edit`
2. Saglabā `{ID}` daļu — tā ir tava **GOOGLE_SHEET_ID**

---

## 2. NEXT.JS PROJEKTA SETUP

### 2.1 Inicializēt Next.js projektu
```bash
npx create-next-app@latest eidu-totalizators --typescript --tailwind
# Saka "Yes" uz visiem jautājumiem
cd eidu-totalizators
```

### 2.2 Instalēt papildu paketes
```bash
npm install googleapis
```

### 2.3 Kopēt kodus
Kopē šos failus tavā projektā:

**src/utils/points.ts** — punktu aprēķina loģika
**src/app/page.tsx** — frontend (abi tabulatori)
**src/app/api/predictions/route.ts** — prognozes saglabāšana
**src/app/api/matches/route.ts** — spēļu iegūšana
**src/app/api/leaderboard/route.ts** — leaderboard iegūšana
**src/app/api/player-history/route.ts** — spēlētāja vēsture
**src/app/api/cron/update-scores/route.ts** — automātiska punktu atjaunināšana

### 2.4 Konfigurēt .env.local
1. Izveidot `.env.local` failu projekta saknē
2. Kopēt saturu no `.env.local.example`
3. Aizpildīt vērtības no Google Cloud (JSON faila):

```
GOOGLE_TYPE=service_account
GOOGLE_PROJECT_ID=<project_id no JSON>
GOOGLE_PRIVATE_KEY_ID=<private_key_id no JSON>
GOOGLE_PRIVATE_KEY="<private_key no JSON>"  # Palikt "\n" jaunajiem rindiem!
GOOGLE_CLIENT_EMAIL=<client_email no JSON>
GOOGLE_CLIENT_ID=<client_id no JSON>
GOOGLE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
GOOGLE_TOKEN_URI=https://oauth2.googleapis.com/token
GOOGLE_AUTH_PROVIDER_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
GOOGLE_CLIENT_CERT_URL=<client_x509_cert_url no JSON>

GOOGLE_SHEET_ID=<tavs SHEET ID>

CRON_SECRET=jauns-slepenais-atslega-123
```

**Svarīgi:** private_key jāsaglabā kā viena rinda, `\n` vietā.

### 2.5 Palaist lokāli
```bash
npm run dev
```

Tagad atvērt http://localhost:3000

---

## 3. DEPLOJS VERCEL

### 3.1 Sagatavot Git
```bash
git init
git add .
git commit -m "Initial commit: EIDU Hokeja Totalizators"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/eidu-totalizators.git
git push -u origin main
```

### 3.2 Savienot ar Vercel
1. Aizej uz https://vercel.com
2. Noklikšķini "Import Project"
3. Izvēlies savu GitHub repozitoriju
4. Noklikšķini "Import"

### 3.3 Pievienot Environment Variables
1. Vercel projektā → Settings → Environment Variables
2. Pievienot visas `.env.local` vērtības

### 3.4 Deplojs
Vercel automātiski deploy'o `main` branch. Pēc pāris minūšu — atrodams https://YOUR_PROJECT.vercel.app

---

## 4. VERCEL CRON (Automātiska punktu atjaunināšana)

### 4.1 Konfigurēt vercel.json
Izveidot `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/update-scores",
    "schedule": "0 */4 * * *"
  }]
}
```

Šis palaidīs `/api/cron/update-scores` ik 4 stundas.

### 4.2 Autentifikācija
`/api/cron/update-scores` pārbaudīs **Authorization: Bearer {CRON_SECRET}**

Vercel automātiski sūta šo header.

---

## 5. DARBĪBU SARAKSTS

- [ ] Google Cloud projekts izveidots
- [ ] Google Sheets API aktivizēts
- [ ] Service Account izveidots un JSON lejupielādēts
- [ ] Google Sheet izveidots ar trim lapām
- [ ] Service Account lietotājs pievienots Sheet
- [ ] Next.js projekts inicializēts
- [ ] Visi .ts/.tsx faili kopēti
- [ ] .env.local konfigurēts
- [ ] `npm run dev` darbojas lokāli
- [ ] Git push'ots uz GitHub
- [ ] Vercel projekts izveidots
- [ ] Environment Variables iestatīti Vercel
- [ ] vercel.json skrolls iestatīts
- [ ] Deplojs izsūtīts uz Vercel
- [ ] Testēta UI un API

---

## 6. PROBLĒMU RISINĀJUMS

### "GOOGLE_SHEET_ID nav nosūtīts"
→ Pārbaudī `.env.local`, vai GOOGLE_SHEET_ID ir pareizs

### "Kļūda iegūstot spēles"
→ Pārbaudī Google Sheets pieejamību (Share → Service Account lietotājs)

### "Vercel Cron neizsūtīts"
→ Pārbaudī `vercel.json` ir projektā
→ Pārbaudī, vai `CRON_SECRET` Vercel ir tas pats kā `route.ts`

### "Private key kļūdas"
→ Pārbaudī, vai `\n` atrašanās vietas ir `.env.local` iekšā pareizi

---

**Veiksmi ar totalizatoru! 🏒**
