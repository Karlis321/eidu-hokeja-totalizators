# 📊 GOOGLE SHEETS — ĀTRS UZRAUDZĪBAS CEĻVEDIS

Neizmanto ilgi instrukcijas? Šis fails ir vienkāršais ceļvedis.

---

## ⚡ 5 MINŪŠU SHEETS SETUP

### 1. Atvērt Google Sheets
```
https://sheets.google.com
```

### 2. Izveidot jaunu Spreadsheet
- Noklikšķini "**+ Jauna**"
- Noklikšķini "**Google Tabulas**"
- Nosauc: **EIDU Totalizators**

### 3. Pārdēvēt lapas

Apakšā, noklikšķini uz "Sheet1":
- Pārdēvē → **Speles**
- Noklikšķini "+"  → **Prognozes**
- Noklikšķini "+" → **Kopvertejums**

### 4. Ievadīt datus

Katrai lapai — virsraksts + dati. **Skatīt tabulācijas zemāk ↓**

### 5. Kopēt Spreadsheet ID
```
https://docs.google.com/spreadsheets/d/XXXXX/edit
                                       ↑
                             Kopē šo
```
Saglabā kā **GOOGLE_SHEET_ID** .env.local

### 6. Share ar Service Account
- Noklikšķini "Share"
- Ielīmē service account e-pastu
- Izvēlies "Editor"
- "Share" ✅

**GATAVS!** 🎉

---

## 📋 LAPĀ DATI (Kopēt-ielīmēt)

### Lapa: **Speles**

**A1 virsraksts:**
```
match_id	date_time	home_team	away_team	home_score	away_score	status
```

**A2-A7 dati:**
```
match_1	2026-05-20T18:00:00Z	Latvija	Vācija	2	3	finished
match_2	2026-05-21T19:00:00Z	Kanāda	Zviedrija	3	2	finished
match_3	2026-05-22T18:00:00Z	Čehija	Norvēģija			upcoming
match_4	2026-05-23T20:00:00Z	Krievija	Somija			upcoming
match_5	2026-05-24T19:00:00Z	Šveice	Lietuva			upcoming
match_6	2026-05-25T18:00:00Z	ASV	Skotija			upcoming
```

---

### Lapa: **Prognozes**

**A1 virsraksts:**
```
prediction_id	player_name	match_id	predicted_home	predicted_away	timestamp
```

**A2-A11 dati:**
```
1	Kārlis	match_1	2	2	2026-05-20T15:30:00Z
2	Aivis	match_1	3	1	2026-05-20T15:45:00Z
3	Inga	match_2	1	2	2026-05-21T16:00:00Z
4	Dace	match_1	2	3	2026-05-20T16:00:00Z
5	Kārlis	match_2	3	2	2026-05-21T17:00:00Z
6	Aivis	match_2	2	3	2026-05-21T17:15:00Z
7	Jānis D.	match_1	2	2	2026-05-20T16:30:00Z
8	Jānis S.	match_1	1	3	2026-05-20T16:45:00Z
9	Andris	match_2	3	1	2026-05-21T17:30:00Z
10	Elīna	match_2	2	2	2026-05-21T17:45:00Z
```

---

### Lapa: **Kopvertejums**

**A1 virsraksts:**
```
player_name	points_3	points_2	points_1	total_points
```

**A2-A9 dati:**
```
Kārlis	1	2	1	8
Aivis	0	1	2	5
Inga	1	0	1	4
Dace	1	1	0	5
Jānis D.	0	0	1	1
Jānis S.	0	0	0	0
Andris	0	0	1	1
Elīna	0	1	0	2
```

---

## 💡 KOPĒT-IELĪMĒT VEIDS

### Solis 1: Ielīmēt virsrakstu
1. Noklikšķini **A1**
2. Kopē virsrakstu (no augstāk)
3. Ielīmē Sheets (Ctrl+V vai Cmd+V)

### Solis 2: Ielīmēt datus
1. Noklikšķini **A2**
2. Kopē datus (tab-atdalīti)
3. Ielīmē Sheets

**GATAVS!** Sheets parsē automātiski.

---

## 🔍 PĀRBAUDES SARAKSTS

- [ ] Trīs lapas (Speles, Prognozes, Kopvertejums)
- [ ] Visi virsraksti ievadīti
- [ ] Dati ievadīti pareizi
- [ ] Spreadsheet ID kopēts (.env GOOGLE_SHEET_ID)
- [ ] Service Account pievienots (Share)
- [ ] Tiesības ir "Editor"

---

## 📊 CSV FAILI (Vietējie)

Projektā ir dati .csv formātā:

```
sample_data_speles.csv
sample_data_prognozes.csv
sample_data_kopvertejums.csv
```

Var eksportēt no Sheets vai importēt uz Sheets.

---

## 🔗 NĀKAMAIS SOLIS

Pēc Sheets setup:
1. Jaudie next QUICK_START.md
2. Instalēt Next.js (`npm install`)
3. Konfigurēt `.env.local` ar GOOGLE_SHEET_ID
4. Palaist `npm run dev`

---

## ❓ ĀTRĀS ATBILDES

| Q | A |
|-|-|
| Vietas nav jāskopoļo? | Ne, visi dati ir pieejami no project papīriem |
| Vai var kopēt-ielīmēt? | Jā, tab-delimited teksts |
| Kur ir .csv faili? | Projektā — sample_data_*.csv |
| Kā share'ot? | Noklikšķini "Share" → Service Account e-pasts |
| Kur ir ID? | URL /d/{GOOGLE_SHEET_ID}/ |

---

**Pabeigts! 🎉 Soli pa solim — un Sheets būs gatavs.**
