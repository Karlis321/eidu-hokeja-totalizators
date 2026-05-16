# 📊 GOOGLE SHEETS SETUP — PILNAS INSTRUKCIJAS

## 1. GOOGLE SHEETS IZVEIDE

### Solis 1.1: Atvērt Google Sheets
1. Aizej uz https://sheets.google.com
2. Piesakies ar savu Google kontu
3. (Ja pirmo reizi — Google ļūgs pieņemt noteikumus)

### Solis 1.2: Izveidot jaunu Spreadsheet
1. Noklikšķini **"+ Jauna"** (New) augšējā kreisajā stūrī
2. Noklikšķini **"Google Tabulas"** (Google Sheets)
3. Jauns Sheet tiks atvērts

### Solis 1.3: Pārdēvēt Spreadsheet
1. Augšējā kreisajā stūrī — **"Beznosaukums tabulas"**
2. Noklikšķini uz tā un ieraksti: **EIDU Totalizators**
3. Nospied **Enter**

### Solis 1.4: Pirmā lapa — "Speles"
1. Apakšā redzams **"Sheet1"** — noklikšķini uz tā un pārdēvē to par **"Speles"**
   - Labo pogu → Pārdēvēt
2. Noklikšķini **OK**

---

## 2. LAPU STRUKTŪRA UN KOLONAS

### Lapa 1: "Speles" (Spēles)

**Virsraksts rinda (A1:G1):**
```
match_id | date_time | home_team | away_team | home_score | away_score | status
```

**Soli:**
1. Noklikšķini uz **A1** (pirmais lauks)
2. Ieraksti: `match_id`
3. Nospied **Tab** (pāriet uz B1)
4. Ieraksti: `date_time`
5. Nospied **Tab** un turpini:
   - B1: `date_time`
   - C1: `home_team`
   - D1: `away_team`
   - E1: `home_score`
   - F1: `away_score`
   - G1: `status`

**Pietest dati (A2:G5):**
| match_id | date_time | home_team | away_team | home_score | away_score | status |
|----------|-----------|-----------|-----------|------------|------------|--------|
| match_1 | 2026-05-20T18:00:00Z | Latvija | Vācija | 2 | 3 | finished |
| match_2 | 2026-05-21T19:00:00Z | Kanāda | Zviedrija |  |  | upcoming |
| match_3 | 2026-05-22T18:00:00Z | Čehija | Norvēģija |  |  | upcoming |

### Lapa 2: "Prognozes" (Prognozes)

1. Noklikšķini **"+"** lapas apakšā
2. Pārdēvē uz **"Prognozes"**

**Virsraksts rinda (A1:F1):**
```
prediction_id | player_name | match_id | predicted_home | predicted_away | timestamp
```

**Pietest dati (A2:F6):**
| prediction_id | player_name | match_id | predicted_home | predicted_away | timestamp |
|---------------|-------------|----------|----------------|----------------|-----------|
| 1 | Kārlis | match_1 | 2 | 2 | 2026-05-20T15:30:00Z |
| 2 | Aivis | match_1 | 3 | 1 | 2026-05-20T15:45:00Z |
| 3 | Inga | match_2 | 1 | 2 | 2026-05-21T16:00:00Z |
| 4 | Dace | match_1 | 2 | 3 | 2026-05-20T16:00:00Z |

### Lapa 3: "Kopvertejums" (Leaderboard)

1. Noklikšķini **"+"** lapas apakšā
2. Pārdēvē uz **"Kopvertejums"**

**Virsraksts rinda (A1:E1):**
```
player_name | points_3 | points_2 | points_1 | total_points
```

**Pietest dati (A2:E9):**
| player_name | points_3 | points_2 | points_1 | total_points |
|-------------|----------|----------|----------|--------------|
| Kārlis | 1 | 2 | 1 | 8 |
| Aivis | 0 | 1 | 2 | 5 |
| Inga | 1 | 0 | 1 | 4 |
| Dace | 1 | 1 | 0 | 5 |
| Jānis D. | 0 | 0 | 0 | 0 |
| Jānis S. | 0 | 0 | 0 | 0 |
| Andris | 0 | 0 | 0 | 0 |
| Elīna | 0 | 0 | 0 | 0 |

---

## 3. DATU IEVADE GOOGLE SHEETS

### Ātrais veids — Kopēt un ielīmēt

#### Lapa "Speles"

A1 — G1 ievadi:
```
match_id	date_time	home_team	away_team	home_score	away_score	status
```

A2 — G5 ievadi:
```
match_1	2026-05-20T18:00:00Z	Latvija	Vācija	2	3	finished
match_2	2026-05-21T19:00:00Z	Kanāda	Zviedrija	3	2	finished
match_3	2026-05-22T18:00:00Z	Čehija	Norvēģija			upcoming
match_4	2026-05-23T20:00:00Z	Krievija	Somija			upcoming
```

#### Lapa "Prognozes"

A1 — F1 ievadi:
```
prediction_id	player_name	match_id	predicted_home	predicted_away	timestamp
```

A2 — F6 ievadi:
```
1	Kārlis	match_1	2	2	2026-05-20T15:30:00Z
2	Aivis	match_1	3	1	2026-05-20T15:45:00Z
3	Inga	match_2	1	2	2026-05-21T16:00:00Z
4	Dace	match_1	2	3	2026-05-20T16:00:00Z
5	Kārlis	match_2	3	2	2026-05-21T17:00:00Z
```

#### Lapa "Kopvertejums"

A1 — E1 ievadi:
```
player_name	points_3	points_2	points_1	total_points
```

A2 — E9 ievadi:
```
Kārlis	1	2	1	8
Aivis	0	1	2	5
Inga	1	0	1	4
Dace	1	1	0	5
Jānis D.	0	0	0	0
Jānis S.	0	0	0	0
Andris	0	0	0	0
Elīna	0	0	0	0
```

---

## 4. SPREADSHEET ID KOPĒŠANA

### Solis 4.1: Nolasīt URL
1. Atvēri savu "EIDU Totalizators" Sheet
2. Pārlūka adreses joslā redzi: `https://docs.google.com/spreadsheets/d/XXXXX/edit`
3. Kopē **XXXXX** daļu (garais kods)

### Solis 4.2: Saglabāt ID
- Šis ir tavs **GOOGLE_SHEET_ID**
- Saglabā to drošā vietā — būs nepieciešams `.env.local`

Piemērs ID: `1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p`

---

## 5. SERVICE ACCOUNT SAVIENOŠANA (Google Cloud)

**Ja tu jau ieguvi Google Cloud Service Account:**

### Solis 5.1: Kopēt Service Account e-pastu
1. Google Cloud Console → Service Accounts
2. Nospied uz tavā service account
3. Kopē **client_email** (e-pasta adrese)
4. Saglabā to

### Solis 5.2: Dod pieejamību Google Sheet
1. Atver savu "EIDU Totalizators" Sheets
2. Noklikšķini **"Share"** (labajā augšējā stūrī)
3. Ielīmē service account e-pastu
4. Izvēlies **"Editor"** (redaktors)
5. Noklikšķini **"Share"**

**DONE!** Service Account var tagad rakstīt uz šo Sheet.

---

## 6. VERIFIKĀCIJA

### Pārbaudi, vai viss ir pareizi:

#### Lapa "Speles"
- [ ] 4 rindas ar datu (header + 4 spēles)
- [ ] match_id sākas ar "match_"
- [ ] date_time ir ISO formāts (YYYY-MM-DDTHH:MM:SSZ)
- [ ] home_score un away_score ir skaitļi (vai tukši upcoming spēlēm)

#### Lapa "Prognozes"
- [ ] Vismaz 4 rindas (header + prognozes)
- [ ] player_name ir viens no 8 spēlētājiem
- [ ] match_id atbilst "Speles" match_id
- [ ] predicted_home un predicted_away ir skaitļi

#### Lapa "Kopvertejums"
- [ ] 8 rindas (header + 8 spēlētāji)
- [ ] Visi spēlētāji ir uzrādīti
- [ ] total_points = points_3 * 3 + points_2 * 2 + points_1 * 1

---

## 7. PIEVIENOŠANA COWORK'AI (Neobligāts)

Ja vēlies piekļūt Sheet'am caur Cowork MCP:

### Solis 7.1: Meklēt Google Sheets connector
```
Cowork → Connectors → Search "Google Sheets"
```

### Solis 7.2: Pievienot savienojumu
1. Noklikšķini "Connect"
2. Piesakies ar Google kontu
3. Atļauj Cowork piekļuvi Sheets

### Solis 7.3: Piekļūt Sheet'am
Pēc savienošanas, vari izmantot Cowork MCP tools lasīšanai/rakstīšanai.

---

## 8. TESTĒŠANA

### Lokāls tests (caur Next.js)

1. Palaidi `npm run dev`
2. Atvēri http://localhost:3000
3. Sekojot uz "Kopvērtējums" — redzēsi leaderboard no Sheet

### Manuāls API tests

```bash
# Nolasīt visas spēles
curl http://localhost:3000/api/matches

# Nolasīt leaderboard
curl http://localhost:3000/api/leaderboard

# Iesniedz prognozi
curl -X POST http://localhost:3000/api/predictions \
  -H "Content-Type: application/json" \
  -d '{
    "player_name": "Kārlis",
    "predictions": [
      {"match_id": "match_3", "predicted_home": 1, "predicted_away": 1}
    ]
  }'
```

---

## 9. PROBLĒMU RISINĀJUMS

### "Nevar piekļūt Sheet'am"
- Pārbaudī, vai `.env.local` ir GOOGLE_SHEET_ID
- Pārbaudī, vai Service Account e-pasts ir pievienots Share
- Pārbaudī, vai tiesības ir "Editor"

### "Dati nesaglabājas"
- Pārbaudī, vai Google Cloud credentials (`.env`) ir pareizi
- Skatīt Server logs (npm run dev konsole)
- Atvēri Google Sheet manuāli — vai ir kolabas?

### "API atgriež 500 kļūdu"
- Pārbaudī Vercel Logs (ja Vercel)
- Skatīt Next.js localhost logs
- Pārbaudī, vai Google API ir aktivizēts

---

## 10. NĀKAMIE SOĻI

1. ✅ Google Sheet izveidots
2. ✅ Trīs lapas (Speles, Prognozes, Kopvertejums)
3. ✅ Pietestu dati ievadīti
4. ✅ Service Account savienots
5. 👉 Palaist `npm run dev`
6. 👉 Testēt http://localhost:3000
7. 👉 Deploy uz Vercel

---

## 📞 ĀTRI LINKI

- [Google Sheets](https://sheets.google.com)
- [Google Cloud Console](https://console.cloud.google.com)
- [Service Account izveide](https://console.cloud.google.com/iam-admin/serviceaccounts)

---

**Šis viss ir gatavs! Tagad turpini ar QUICK_START.md → Solis 3 (Next.js setup) 🚀**
