# 🔗 GOOGLE SHEETS UN APLIKĀCIJAS INTEGRĀCIJA

Kā Google Sheets savienojas ar jūsu Next.js aplikāciju.

---

## 📊 DARBĪBAS PLŪSMA

```
┌─────────────────────────────────────────────────────────────┐
│                    LIETOTĀJS                                │
│              (pārlūka aplikācija)                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ├─→ [Frontend] page.tsx
                     │   - Dropdown (spēlētāji)
                     │   - Spēļu saraksts
                     │   - Ievades lauki (prognozes)
                     │   - Kopvērtējuma tabula
                     │
                     └─→ [API Routes]
                         ├─ GET  /api/matches → Google Sheets (Speles)
                         ├─ GET  /api/leaderboard → Google Sheets (Kopvertejums)
                         ├─ POST /api/predictions → Google Sheets (Prognozes)
                         ├─ GET  /api/player-history → Google Sheets (Prognozes + Speles)
                         └─ GET  /api/cron/update-scores → Recalculate & Update
                             │
                             └─→ [Google Sheets]
                                 ├─ Speles (spēles un rezultāti)
                                 ├─ Prognozes (lietotāju prognozes)
                                 └─ Kopvertejums (punktu kopsummārs)
```

---

## 🔄 DETALIZĒTA DARBĪBAS SECĪBA

### 1. LIETOTĀJS IESNIEŽ PROGNOZI

**Frontend:**
```
Lietotājs:
1. Izvēlās spēlētāju (dropdown)
2. Ievada prognozes (2 ievades lauki per spēli)
3. Noklikšķini "Saglabāt prognozes"

JavaScript:
4. handleSubmit() izsaucas POST /api/predictions
5. Sūta JSON:
   {
     "player_name": "Kārlis",
     "predictions": [
       {"match_id": "match_3", "predicted_home": 1, "predicted_away": 2}
     ]
   }
```

**Backend (API):**
```
POST /api/predictions/route.ts:
1. Saņem JSON datus
2. Iegūst nākamo prediction_id
3. Ievieto jaunu rindu lapā "Prognozes"
4. Izsauc updateLeaderboard()
   ├─ Nolasa "Prognozes" + "Speles"
   ├─ Aprēķina punktus katram spēlētājam (points.ts)
   ├─ Atjaunina lapu "Kopvertejums"
5. Grāvējas 200 OK

Frontend:
6. Ziņojums: "✅ Prognozes veiksmīgi saglabātas"
7. Atsvaidzina leaderboard (GET /api/leaderboard)
```

**Google Sheets:**
```
Lapā "Prognozes" piebrauc jauna rinda:
├─ prediction_id: 11
├─ player_name: Kārlis
├─ match_id: match_3
├─ predicted_home: 1
├─ predicted_away: 2
└─ timestamp: 2026-05-22T14:30:00Z

Lapā "Kopvertejums" atjauninās Kārļa punkti (ja spēle pabeigta)
```

---

### 2. SPĒLES REZULTĀTS ATJAUNINĀS

**Cron Job (ik 4 stundas):**
```
Vercel Cron trigers:
GET /api/cron/update-scores?Authorization=Bearer{CRON_SECRET}

Backend (src/app/api/cron/update-scores/route.ts):
1. Pārbauda autentifikāciju (CRON_SECRET)
2. Izsauc fetchRealScores() — iegūst reālos rezultātus
   (Pašlaik: mock dati, nākotnē: sporta API)
3. Atjaunina Speles lapu ar home_score un away_score
4. Izsauc updateLeaderboard()
   ├─ Parsē Speles un Prognozes
   ├─ Aprēķina punktus (tikai finished spēlēm)
   ├─ Atjaunina Kopvertejums
5. Grāvējas JSON ar atjauninātajiem spēlēm
```

**Google Sheets:**
```
Lapā "Speles" atjauninās rezultāti:
├─ match_1 status: "finished"
├─ home_score: 2, away_score: 3

Lapā "Kopvertejums" atjauninās visu spēlētāju punkti
└─ Aprēķins: ja prognoza skaita, tiek pieskaitīti punkti
```

---

### 3. LIETOTĀJS SKATĀS LEADERBOARD

**Frontend:**
```
Lietotājs noklikšķini "Kopvērtējums" tabulatoru

JavaScript:
1. useEffect() → GET /api/leaderboard
2. Nolasa Sheets lapas "Kopvertejums"
3. Renderē tabulu (sakārtotu pēc total_points dilstošā kārtībā)
4. Lietotājs noklikšķini uz spēlētāja vārda
5. Izsaucas GET /api/player-history?player=Kārlis
6. Paplašinās accordion ar vēsturi
```

**Backend:**
```
GET /api/leaderboard:
├─ Nolasa Sheets lapu "Kopvertejums"
├─ Parsē datus
└─ Grāvējas JSON ar punktiem

GET /api/player-history:
├─ Nolasa Sheets lapu "Prognozes" (filtrē pēc player_name)
├─ Nolasa Sheets lapu "Speles"
├─ Apvieno datus (prognoza + faktiskais rezultāts)
└─ Grāvējas vēsturi
```

---

## 🔐 GOOGLE SHEETS API KREDENCIĀLI

### Atrašanās vieta: `.env.local`

```env
GOOGLE_TYPE=service_account
GOOGLE_PROJECT_ID=your-project-id
GOOGLE_PRIVATE_KEY_ID=your-private-key-id
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CLIENT_EMAIL=service-account@project.iam.gserviceaccount.com
GOOGLE_CLIENT_ID=...
GOOGLE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
GOOGLE_TOKEN_URI=https://oauth2.googleapis.com/token
GOOGLE_AUTH_PROVIDER_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
GOOGLE_CLIENT_CERT_URL=...

GOOGLE_SHEET_ID=1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p
```

### Darbības:
1. **Visi API route** izmanto `getSheets()` funkciju (no googleapis)
2. **Auth**: Service Account privātā atslēga (no `.env`)
3. **Scopes**: `https://www.googleapis.com/auth/spreadsheets`
4. **Piekļuve**: Google Sheets API lasīšanai/rakstīšanai

---

## 🔗 API ENDPOINTS — APSKATS

| Endpoint | Metode | Darbība | Dati no/uz Sheets |
|----------|--------|---------|------------------|
| `/api/matches` | GET | Nolasīt spēles | Speles |
| `/api/leaderboard` | GET | Nolasīt leaderboard | Kopvertejums |
| `/api/predictions` | POST | Saglabāt prognozes | Prognozes |
| `/api/player-history` | GET | Nolasīt spēlētāja vēsturi | Prognozes + Speles |
| `/api/cron/update-scores` | GET | Atjaunināt rezultātus | Speles + Kopvertejums |

---

## 📋 LAPU LOĢIKA

### Lapa "Speles"
```
Nolases:
├─ match_id (unikāls identifikators)
├─ date_time (ISO format — nosaka vai bloķēt ievadi)
├─ home_team, away_team (parāda UI)
├─ home_score, away_score (rezultāts — aizpilda Cron)
└─ status (upcoming/finished — ietekmē UI)

Raksta:
└─ Cron job atjaunina home_score, away_score, status
```

### Lapa "Prognozes"
```
Nolases:
├─ prediction_id (unikāls)
├─ player_name (spēlētājs)
├─ match_id (savieno ar Speles)
├─ predicted_home, predicted_away (lietotāja prognoze)
└─ timestamp (kad iesniegta)

Raksta:
├─ Frontend POST /api/predictions
└─ Backend ievieš jaunes rindas
```

### Lapa "Kopvertejums"
```
Nolases:
├─ player_name
├─ points_3, points_2, points_1 (sadalīts pa kategorijām)
└─ total_points (summa)

Raksta:
├─ Cron job atjaunina pēc katra Speles atjaunināšanas
├─ Backend updateLeaderboard() recalculē
└─ Aprēķins: points_3 × 3 + points_2 × 2 + points_1 × 1
```

---

## 🎯 PUNKTU APRĒĶINA FORMULA

```typescript
// src/utils/points.ts

calculatePoints(prediction, actual):
  if (prediction === actual) → 3 punkti ✅ (precīzs rezultāts)
  else if (winner + 1 gols pareizs) → 2 punkti (daļēji)
  else if (tikai winner VAI tikai 1 gols) → 1 punkts (tikai viena)
  else → 0 punktu (kļūda)

total_points = points_3 × 3 + points_2 × 2 + points_1 × 1
```

---

## ⏱️ LAIKA IEROBEŽOJUMI

### Frontend validācija:

```typescript
canSubmitPrediction(matchDateTimeISO):
  now < (matchTime - 1 stunda) → True (var iesniedz)
  now >= (matchTime - 1 stunda) → False (bloķēts)
```

**Piemērs:**
- Spēle sākas: 20:00
- Laika bloķējums: 19:00
- 18:30 — ievades lauki atvērti ✅
- 19:05 — ievades lauki bloķēti ❌

---

## 🔄 SINHRONIZĀCIJA

### Lokāli (`npm run dev`)
- **Frontend** izsauc `/api/` routes
- **Routes** saziņojas ar Google Sheets API
- **Rezultāts** rāds uzreiz (refresh tikai manuāli)

### Vercel (Production)
- **Frontend** izsauc `/api/` routes (uz vercel.com)
- **Routes** saziņojas ar Google Sheets API
- **Cron Job** ik 4 stundas atjaunina rezultātus
- **Users** redz atjauninājumus pēc lapas pārlādes (vai auto-refresh)

---

## ✅ INTEGRĀCIJAS CHECKLIST

- [ ] `.env.local` ir uzpildīts ar pareiziem kredenciāliem
- [ ] GOOGLE_SHEET_ID sakrīt ar jūsu Sheets ID
- [ ] Service Account e-pasts ir pievienots Sheets ar Editor tiesībām
- [ ] Google Sheets lapas nosauktas pareizi (Speles, Prognozes, Kopvertejums)
- [ ] Virsraksti ir pareizi (match_id, date_time, utt.)
- [ ] Pietestu dati ievadīti
- [ ] npm install izpildīts
- [ ] npm run dev darbojas
- [ ] http://localhost:3000 atveras
- [ ] API calls grāvējas (DevTools → Network)
- [ ] Dati rādās no Sheets
- [ ] Prognožu iesniegšana pieraksta Sheets

---

## 🚀 NĀKAMIE SOĻI

1. ✅ Izveide Google Sheets (GOOGLE_SHEETS_SETUP.md)
2. ✅ Pietestu dati ievadīti (CSV faili ir pieejami)
3. ✅ Service Account savienots
4. 👉 Setup Next.js (QUICK_START.md)
5. 👉 Konfigurēt `.env.local`
6. 👉 Palaist `npm run dev`
7. 👉 Testēt integr
8. 👉 Deploy uz Vercel

---

**Viss pieeja! 🎉 Sheets un App ir savienotas.**
