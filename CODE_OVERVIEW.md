# 📖 Koda apskats

## 1. Frontend (`src/app/page.tsx`)

### Izkārtojums
- **Tab skaņa**: "Iesniegt prognozes" (default) un "Kopvērtējums"
- **State**: `activeTab`, `selectedPlayer`, `matches`, `predictions`, `leaderboard`, `expandedPlayer`

### "Iesniegt prognozes" lapa
1. **Dropdown** ar 8 spēlētājiem — valcēts `SPELETAJI` masīva
2. **Spēles saraksts** — ielādēts no `/api/matches`
3. **Laika bloķējums** — `canSubmitPrediction()` no `points.ts`
   - Ja ir palikusi <1 stunda, lauki ir disabled
4. **Ievades lauki** — divi input per spēli (home/away goli)
5. **Saglabāt poga** — POST uz `/api/predictions`

### "Kopvērtējums" lapa
1. **Tabula** — ielādēts no `/api/leaderboard`
2. **Sazvietošanas** — sort aiz `total_points` (dilstošs)
3. **Accordions** — noklikšķinis uz vārdu, paplašinās vēsture
4. **Vēsture** — iegūts no `/api/player-history`

### API izsaukumi
- `GET /api/matches` — spēles nolasīšana
- `GET /api/leaderboard` — leaderboard nolasīšana
- `POST /api/predictions` — prognožu saglabāšana
- `GET /api/player-history?player=Kārlis` — vēsture nolasīšana

---

## 2. Punktu loģika (`src/utils/points.ts`)

### `calculatePoints(prediction)`
```typescript
export function calculatePoints(prediction: PredictionResult): number
```
- **3 punkti**: `predictedHome === actualHome && predictedAway === actualAway`
- **2 punkti**: `winnerCorrect && (homeGoalsCorrect || awayGoalsCorrect)`
- **1 punkts**: `winnerCorrect || homeGoalsCorrect || awayGoalsCorrect`
- **0 punktu**: vis pārējie gadījumi

### `calculateTotalPoints(predictions[])`
Saskaita `points_3`, `points_2`, `points_1` un aprēķina `total_points`

### `canSubmitPrediction(matchDateTimeISO)`
Pārbauda, vai spēles sākums ir ≥1 stundu nākotnē

### `getWinner(home, away)`
Returns: `1` (mājās), `2` (viesi), `0` (neizšķirts)

---

## 3. API maršruti

### `src/app/api/predictions/route.ts`
**POST /api/predictions**

Saņem:
```json
{
  "player_name": "Kārlis",
  "predictions": [
    { "match_id": "match_1", "predicted_home": 2, "predicted_away": 1 }
  ]
}
```

Dara:
1. Iegūst nākamo `prediction_id` no "Prognozes" lapas
2. Ievieš jauas rindas
3. Izsauc `updateLeaderboard()` — aprēķina punktus un atjaunina "Kopvertejums"

---

### `src/app/api/matches/route.ts`
**GET /api/matches**

Atgriež:
```json
{
  "matches": [
    {
      "match_id": "match_1",
      "date_time": "2026-05-20T18:00:00Z",
      "home_team": "Latvija",
      "away_team": "Vācija",
      "home_score": 2,
      "away_score": 3,
      "status": "finished"
    }
  ]
}
```

---

### `src/app/api/leaderboard/route.ts`
**GET /api/leaderboard**

Nolasa "Kopvertejums" lapu un atgriež spēlētāja punktus.

---

### `src/app/api/player-history/route.ts`
**GET /api/player-history?player=Kārlis**

1. Iegūst visas spēlētāja prognozes
2. Apvieno ar faktiski spēļu rezultātiem
3. Atgriež:
```json
{
  "history": [
    {
      "match_display": "Latvija — Vācija",
      "predicted_home": 2,
      "predicted_away": 1,
      "actual": { "home": 2, "away": 3 }
    }
  ]
}
```

---

### `src/app/api/cron/update-scores/route.ts`
**GET /api/cron/update-scores** (ar `Authorization: Bearer {CRON_SECRET}`)

1. Pārbauda autentifikāciju
2. Iegūst visas spēles no "Speles"
3. Mēģina iegūt reālos rezultātus (pašlaik returns `null`, drīz integrēts ar sporta API)
4. Atjaunina "Speles" lapu ar jauniem rezultātiem
5. Izsauc `updateLeaderboard()` — pārrēķina punktus

**Piezīme**: `fetchRealScores()` ir vieta, kur integrēt sporta API (ESPN, Hockey-Reference, utt.)

---

## 4. Google Sheets integrācija

### `getSheets()` funkcija
Visos API routos inicializē Google Sheets klient ar service account kredencialiem no `.env`.

```typescript
const sheets = await getSheets();
const response = await sheets.spreadsheets.values.get({ ... });
```

### Datu plūsma

```
Frontend (page.tsx)
    ↓ POST /api/predictions (prognoze)
API (predictions/route.ts)
    ↓ Ievieto rindas Google Sheets
Google Sheets (Prognozes)
    ↓ updateLeaderboard()
Google Sheets (Kopvertejums)
    ↓ GET /api/leaderboard
Frontend (Kopvērtējums skaņa)
```

---

## 5. Secības un izsaukumi

### Frontend ielāde
1. `useEffect()` → `fetchMatches()`, `fetchLeaderboard()`
2. `GET /api/matches` → spēles parāda
3. `GET /api/leaderboard` → leaderboard parāda

### Prognožu iesniegšana
1. Lietotājs ievada prognozes
2. Noklikšķini "Saglabāt prognozes"
3. `handleSubmit()` → `POST /api/predictions`
4. Backend: ievieš Google Sheets + atjaunina leaderboard
5. Frontend atsvaidzina leaderboard

### Vēstures parāde
1. Noklikšķini uz spēlētāja vārda kopvērtējumā
2. `togglePlayerHistory()` → `GET /api/player-history?player=Kārlis`
3. Dati parādīti accordion stilā

---

## 6. Konfigurācija

### `.env.local` variābles
```env
GOOGLE_TYPE                    # "service_account"
GOOGLE_PROJECT_ID             # Google Cloud project ID
GOOGLE_PRIVATE_KEY_ID         # Private key ID
GOOGLE_PRIVATE_KEY            # Private key (ar \n rindas pauzes)
GOOGLE_CLIENT_EMAIL           # Service Account e-pasts
GOOGLE_CLIENT_ID              # Client ID
GOOGLE_AUTH_URI               # "https://accounts.google.com/o/oauth2/auth"
GOOGLE_TOKEN_URI              # "https://oauth2.googleapis.com/token"
GOOGLE_AUTH_PROVIDER_CERT_URL # "https://www.googleapis.com/oauth2/v1/certs"
GOOGLE_CLIENT_CERT_URL        # Cert URL

GOOGLE_SHEET_ID               # Spreadsheet ID
CRON_SECRET                   # Vercel Cron autentifikācijas noslēpums
```

### `vercel.json` (Cron)
```json
{
  "crons": [{
    "path": "/api/cron/update-scores",
    "schedule": "0 */4 * * *"
  }]
}
```

---

## 7. Errora apstrāde

Visi API route pārbaudī:
- Vai dati ir korekti (`if (!playerName) { return 400 }`)
- Vai Google Sheets API atgriezusi kļūdu (`try/catch`)
- Atgriež `{ message, status }`

Frontend parāda ziņojumus:
- Success: `✅ Prognozes veiksmīgi saglabātas`
- Error: `❌ Kļūda: ...`

---

## 8. Optimizācija un nākamie soļi

### Pašreiz
- ✅ Pilna punktu aprēķina loģika
- ✅ Google Sheets integrācija
- ✅ Frontend UI (abi tabulatori)
- ✅ Laika bloķējums
- ✅ Cron jobs infrastruktūra

### Ieteiktie uzlabojumi
1. **Sporta API integrācija** — aizstāt `fetchRealScores()` ar reālu API
2. **Notifikācijas** — informēt par drīzajām spēlēm
3. **Vēstures pārlūkošana** — labāka UI spēlēm
4. **Atsaukšanas** — labot prognozes pirms spēles sākuma
5. **Daudzāns čempionāts** — ne tikai PČ
6. **Statistika** — secinājumi par labākajiem prognozējiem

---

## 9. Debugging tips

### Lokāli
```bash
npm run dev
# Atvērt DevTools (F12)
# Network tab — skatīt API izsaukumus
# Console — skatīt kļūdas
```

### Vercel
1. Atvērt Vercel Dashboard
2. Projekts → Logs → Runtime Logs
3. GET/POST izsaukumi parādīti ar atbildem

### Google Sheets
1. Atverot Sheets spreadsheet
2. Skatīt "Prognozes" un "Kopvertejums" lapas — vai dati tiek ierakstīti?

---

**Jautājumi? Lasīt SETUP.md vai QUICK_START.md!**
