# 📺 GOOGLE APPS SCRIPT — VIZUĀLS CEĻVEDIS

Soli-pa-solim ar atsaucēm uz darbībām.

---

## 🚀 SOLIS 1: ATVĒRT APPS SCRIPT

### 1.1 Atvērt Google Sheet
```
https://sheets.google.com
↓
Noklikšķini savu "EIDU Totalizators" Sheet
```

### 1.2 Atvērt Apps Script redaktoru
```
Augšējā izvēlne → "Paplašinājumi" (Extensions)
↓
"Apps Script"
↓
Jauns redaktors atvērsies (var aizņemt 10 sekundes)
```

**Redzēsi:**
```
function myFunction() {
  
}
```

---

## ✂️ SOLIS 2: DZĒST DEFAULT KODU

Redaktorā redzamo `myFunction() { }` — **DZĒST VISU**

**Vienkāršākais:**
1. Nospiediet **Ctrl+A** (Select All)
2. Nospiediet **Delete**

**Rezultāts:**
```
(redaktors ir tukšs)
```

---

## 📋 SOLIS 3: NOKOPĒT KODU

### 3.1 Kopēt no viena no šiem:

**Opcija A: TXT fails (ātri)**
```
Atvērt: APPS_SCRIPT_SIMPLE.txt
Noklikšķini "Ctrl+A"
Noklikšķini "Ctrl+C"
```

**Opcija B: HTML fails (ar "Nokopēt" pogu)**
```
Atvērt: google_apps_script_code.html (pārlūkā)
Noklikšķini "📋 NOKOPĒT KODU" pogu
```

**Opcija C: Manuāli no Markdown**
```
Atvērt: GOOGLE_APPS_SCRIPT.md
Kopēt kodu no ```javascript ... ```
```

---

## 📌 SOLIS 4: IELĪMĒT APPS SCRIPT REDAKTORĀ

### 4.1 Ielīmēt kodu

**Apps Script redaktorā:**
1. Noklikšķini redaktora lauku (tas ir tukšs)
2. Nospiediet **Ctrl+V** (Paste)

**Rezultāts:**
```javascript
/**
 * EIDU HOKEJA TOTALIZATORS — GOOGLE APPS SCRIPT
 * ...
 */

function onOpen() {
  ...
}

function recalculateLeaderboard() {
  ...
}
...
```

Redzēsi daudz koda — tas ir pareizi! ✅

---

## 💾 SOLIS 5: SAGLABĀT KODU

**Apps Script redaktorā:**
1. Nospiediet **Ctrl+S** (Save)

**Notifik­ācija:**
```
"✓ Projekt: EIDU Totalizators"
```

Jauns projekts tiks izveidots automātiski.

---

## ▶️ SOLIS 6: PALAIST KODU

**Apps Script redaktorā:**
1. Augšējā daļa — redzēsi dropdown ar "Select function"
2. Noklikšķini uz tā un izvēlies: **`onOpen`**
3. Nospiediet lielo **"▶ Run"** pogu

**Notifikācija:**
```
"Execution started"
(pagaidiet 5 sekundes)
↓
"Authorization required"
```

---

## 🔐 SOLIS 7: ATĻAUT ATĻAUJAS

**Logs parādīsies:**
```
"This app wants to access..."
```

1. Noklikšķini **"Atļaut"** (Allow)
2. Izvēlies savu Google kontu
3. Noklikšķini **"Allow"** atkal

**Rezultāts:**
```
✓ Authorization granted
(redaktors atgriežas)
```

---

## 🔄 SOLIS 8: ATSVAIDZINĀT GOOGLE SHEET

**Atgriezies savam Google Sheet:**
1. Nospiediet **F5** vai **Ctrl+R** (Refresh pārlūku)
2. Vai vienkārši atvērt savu Sheet vēlreiz

**Redzēsi jaunu menu:**
```
Augšējā izvēlne → "🏒 Totalizators"
```

Ja to neredzat — palaist Script vēlreiz (solis 6).

---

## ✅ SOLIS 9: PĀRBAUDĪT VAI DARBOJAS

**Google Sheet redaktorā:**

1. Noklikšķini **"🏒 Totalizators"** menu
2. Noklikšķini **"✅ Pārbaude"**

**Logs parādīsies:**
```
✅ PĀRBAUDE:

📋 Speles: 4 rindas
📊 Prognozes: 5 rindas
🏆 Kopvertejums: 0 rindas
```

Vai kaut kas līdzīgs. Ja redzat ziņojumu — **TAS DARBOJAS!** ✅

---

## 🎯 SOLIS 10: PALAIST LEADERBOARD ATJAUNINĀŠANU

**Google Sheet redaktorā:**

1. Noklikšķini **"🏒 Totalizators"** menu
2. Noklikšķini **"📊 Pārrēķināt leaderboard"**

**Logs parādīsies:**
```
✅ Leaderboard atjaunināts!

Spēlētāji: 5
Aprēķinātie punkti: ✓
```

---

## ✨ REZULTĀTS

Lapā **"Kopvertejums"** redzēsit:

```
player_name      points_3  points_2  points_1  total_points
─────────────────────────────────────────────────────────
Kārlis           1         2         1         8
Dace             1         1         0         5
Aivis            0         1         2         5
Inga             1         0         1         4
...
```

**Dati ir sakārtoti pēc `total_points` (dilstošs)!**

---

## 🔄 TURPMĀKĀ LIETOŠANA

Katru reizi, kad:
- ✏️ Jūs ievietat jaunu prognozi
- 📝 Jūs atjauninājiet spēles rezultātus

**Vienkārši:**
1. Noklikšķini **"🏒 Totalizators"**
2. Noklikšķini **"📊 Pārrēķināt leaderboard"**
3. Leaderboard atjauninās automātiski!

---

## ❓ PROBLĒMU RISINĀJUMS

### Redaktors atvēra, bet es neredzu menu "Totalizators"
```
Solis 6 — Palaist onOpen() vēlreiz
  ↓
Atļaut atļaujas vēlreiz
  ↓
Atvērt Google Sheet
  ↓
Nospiest F5 (Refresh)
```

### Kļūda: "Lapas nav atrastas"
```
Pārbaudiet lapas nosaukumus:
  ✓ Speles
  ✓ Prognozes
  ✓ Kopvertejums

Nosaukumiem jābūt TIEŠI šādiem (bez pasvītrojuma, garumzīmēm, utt.)
```

### Kļūda: "Authorization required"
```
Noklikšķini "Run" vēlreiz
  ↓
Atļaut atļaujas (svarīgi!)
  ↓
Izvēlies Google kontu, kuram pieder Sheet
```

### Leaderboard neatjauninās
```
Pārbaudiet:
  1. Vai spēles status ir "finished"?
  2. Vai rezultāti ir ievadīti (home_score, away_score)?
  3. Palaistiet "✅ Pārbaude" — redziet prognozes?
```

---

## 📺 KODU PIEŅEMŠANAS PROCESA VIENKĀRŠOJUMS

```
┌─────────────────────────────────────────┐
│ 1. Atvērt Google Sheet                  │
│    → Paplašinājumi → Apps Script       │
└─────────────────────────────────────────┘
                ↓
┌─────────────────────────────────────────┐
│ 2. Dzēst default kodu                   │
│    (Ctrl+A → Delete)                    │
└─────────────────────────────────────────┘
                ↓
┌─────────────────────────────────────────┐
│ 3. Nokopēt kodu no:                     │
│    - APPS_SCRIPT_SIMPLE.txt VAI         │
│    - google_apps_script_code.html       │
└─────────────────────────────────────────┘
                ↓
┌─────────────────────────────────────────┐
│ 4. Ielīmēt Apps Script redaktorā        │
│    (Ctrl+V)                             │
└─────────────────────────────────────────┘
                ↓
┌─────────────────────────────────────────┐
│ 5. Saglabāt (Ctrl+S)                    │
└─────────────────────────────────────────┘
                ↓
┌─────────────────────────────────────────┐
│ 6. Palaist (▶ Run) → "onOpen"           │
│    Atļaut atļaujas!                      │
└─────────────────────────────────────────┘
                ↓
┌─────────────────────────────────────────┐
│ 7. Atsvaidzināt Google Sheet (F5)       │
│    Redzēt "🏒 Totalizators" menu ✓      │
└─────────────────────────────────────────┘
                ↓
┌─────────────────────────────────────────┐
│ 8. Noklikšķini "📊 Pārrēķināt leaderboard"│
│    ✅ Gatavs!                            │
└─────────────────────────────────────────┘
```

---

## 🎉 BEIGĀS

Jūs viņš esat palaišanas Google Apps Script, kas:
- ✅ Nolasa Speles, Prognozes, Kopvertejums
- ✅ Aprēķina punktus (3/2/1)
- ✅ Atjaunina leaderboard
- ✅ Sakārto spēlētājus pēc punktiem

**Vienmēr, kad noklikšķini "📊 Pārrēķināt leaderboard"!**

---

**Veiksmi! 🚀**

*Ja joprojām ir problēmas, pārbaudiet GOOGLE_APPS_SCRIPT.md problēmu risinājuma sadaļu.*
