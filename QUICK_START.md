# ⚡ ĀTRS STARTS — EIDU hokeja totalizators

## 30 minūšu setup procesa ringbrīdis

### Solis 1: Google Cloud (10 min)
1. Aizej uz https://console.cloud.google.com/
2. Izveidot jaunu projektu: "EIDU Totalizators"
3. Aktivizēt **Google Sheets API** (APIs & Services → Library)
4. Izveidot **Service Account** (Credentials → Create → Service Account)
5. Lejupielādēt **JSON atslēgu** (Service Account → Keys → Add Key → JSON)
6. Nokopēt **project_id**, **private_key**, **client_email** no JSON faila

### Solis 2: Google Sheets (5 min)
1. Aiziet uz https://sheets.google.com
2. Izveidot jaunu spreadsheet: "EIDU Totalizators"
3. Pārdēvēt Sheet1 → "Speles"
4. Pievienot kolonas: `match_id`, `date_time`, `home_team`, `away_team`, `home_score`, `away_score`, `status`
5. Noklikšķini "+" un pievienot "Prognozes" ar kolonnām: `prediction_id`, `player_name`, `match_id`, `predicted_home`, `predicted_away`, `timestamp`
6. Noklikšķini "+" un pievienot "Kopvertejums" ar kolonnām: `player_name`, `points_3`, `points_2`, `points_1`, `total_points`
7. **Share** → ielīmēj service account email → Editor tiesības
8. Nokopēj **Spreadsheet ID** no URL (`/d/{ID}/`)

### Solis 3: Next.js projekts (10 min)
```bash
# Inicializēt
npx create-next-app@latest eidu-totalizators --typescript --tailwind --yes
cd eidu-totalizators

# Instalēt googleapis
npm install googleapis

# Kopēt visu kodu no šeit uz src/ direktoriju
# (skatīt failā struktūra)
```

### Solis 4: .env.local
Izveidot `.env.local` proyekta saknē:
```env
GOOGLE_TYPE=service_account
GOOGLE_PROJECT_ID=<no JSON>
GOOGLE_PRIVATE_KEY_ID=<no JSON>
GOOGLE_PRIVATE_KEY="<no JSON ar \n>"
GOOGLE_CLIENT_EMAIL=<no JSON>
GOOGLE_CLIENT_ID=<no JSON>
GOOGLE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
GOOGLE_TOKEN_URI=https://oauth2.googleapis.com/token
GOOGLE_AUTH_PROVIDER_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
GOOGLE_CLIENT_CERT_URL=<no JSON>

GOOGLE_SHEET_ID=<tavs spreadsheet ID>
CRON_SECRET=super-secret-123
```

### Solis 5: Palaist lokāli
```bash
npm run dev
```

Atvērt http://localhost:3000 ✅

---

## Pirmā testa čeklis

- [ ] Pieejams http://localhost:3000
- [ ] Redzas "EIDU ģimenes totalizators" virsrakstu
- [ ] Dropdown darbojās (Kārlis, Aivis, ...)
- [ ] Spēles paslodējas (ja Google Sheets ir dati)
- [ ] Ievadi prognozes un noklikšķini "Saglabāt"
- [ ] Pārej uz "Kopvērtējums" un redzēt leaderboard

---

## Deploy uz Vercel

```bash
# Git
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR/REPO.git
git push -u origin main

# Vercel
```

1. Aizies uz https://vercel.com
2. "Import Project" → izvēlies GitHub repo
3. Settings → Environment Variables → pievienot .env.local vērtības
4. Deploy ✅

---

## Ja kaut kas ir salūzis...

### "GOOGLE_SHEET_ID nav nosūtīts"
- Pārbaudī `.env.local`, vai `GOOGLE_SHEET_ID` ir pareizs

### "Kļūda savienošanās laikā"
- Pārbaudī, vai Service Account e-pasts ir pievienots Google Sheet ar Editor tiesībām

### "Private key kļūdas"
- JSON `private_key` satur `\n` — tas ir jābūt tieši tā `.env.local` iekšā

---

## Nākamie soļi

1. **Pievienot reālas hokeja spēles** — integrēt ar ESPN / Hockey API
2. **Pievienot vairākus čempionātus** — nav tikai PČ
3. **Statistika un analīze** — secinājumi par labākajiem prognozējiem
4. **Push paziņojumi** — vai prognozi ir iesniegtas

---

**Veiksmi! 🏒**
