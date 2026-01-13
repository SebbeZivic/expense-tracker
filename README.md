# Budget Tracker

En React-baserad budget tracker-applikation där användare kan hantera sina intäkter och kostnader. Projektet använder mockdata och localStorage för datalagring, och har automatisk CI/CD med GitHub Actions.

## 🚀 Funktioner

- **Autentisering**: Skapa konto och logga in (mockad autentisering med localStorage)
- **Dashboard**: Översiktlig vy med balans, intäkter och kostnader
- **Transaktioner**: Lägg till nya intäkter och kostnader
- **Automatisk balansberäkning**: Balansen uppdateras automatiskt baserat på transaktioner
- **Skyddade routes**: Dashboard är endast tillgänglig för inloggade användare

## 🛠️ Tech Stack

- **Frontend**: React 18 med TypeScript
- **Routing**: React Router v6
- **State Management**: React Context API
- **Styling**: Vanlig CSS
- **Build Tool**: Vite
- **Testing**: Vitest + React Testing Library
- **CI/CD**: GitHub Actions
- **Deployment**: GitHub Pages

## 📋 Förutsättningar

- Node.js 18 eller senare
- npm eller yarn

## 🏃 Kör projektet lokalt

1. **Klona projektet**
   ```bash
   git clone <repository-url>
   cd expense-tracker
   ```

2. **Installera dependencies**
   ```bash
   npm install
   ```

3. **Starta utvecklingsservern**
   ```bash
   npm run dev
   ```

4. **Öppna i webbläsaren**
   - Applikationen kommer att köras på `http://localhost:5173`

## 🧪 Testning

### Köra tester
```bash
# Köra alla tester
npm test

# Köra tester med UI
npm run test:ui

# Köra tester med coverage
npm run coverage
```

### Testade funktioner
- ✅ Login fungerar korrekt
- ✅ Dashboard renderas när användare är inloggad
- ✅ Balansberäkning fungerar korrekt
- ✅ Transaktioner kan läggas till och hämtas

## 🔐 Mock Autentisering

Projektet använder en mockad autentiseringslösning som lagrar användardata i localStorage.

### Hur det fungerar:

1. **Registrering**: När en användare registrerar sig sparas deras information i localStorage under nyckeln `budget_tracker_users`
2. **Inloggning**: Vid inloggning kontrolleras email och lösenord mot sparade användare
3. **Session**: Den inloggade användaren sparas i localStorage under nyckeln `budget_tracker_current_user`
4. **Logout**: Tar bort den nuvarande användaren från localStorage

### Data som sparas:
- **Användare**: Email, lösenord (okrypterat för demo), namn
- **Transaktioner**: Beskrivning, belopp, datum, användar-ID
- **Session**: Nuvarande inloggad användare

**OBS**: Detta är endast för demoändamål. I en riktig applikation skulle lösenord krypteras och autentisering hanteras via en säker backend.

## 🚀 CI/CD Pipeline

Projektet har en automatisk CI/CD-pipeline som körs vid varje push till `main`-branchen.

### Workflow-steg:

1. **Checkout**: Hämtar koden från GitHub
2. **Setup Node.js**: Konfigurerar Node.js 18
3. **Install dependencies**: Kör `npm ci` för att installera dependencies
4. **Run tests**: Kör alla tester med Vitest
5. **Build**: Bygger projektet med `npm run build`
6. **Deploy**: Deployar automatiskt till GitHub Pages om tester passerar

### GitHub Pages Deployment

För att aktivera GitHub Pages:

1. Gå till ditt repository på GitHub
2. Navigera till **Settings** → **Pages**
3. Välj **Source**: `gh-pages` branch, `/root` folder
4. Efter första push till `main` kommer GitHub Actions automatiskt att skapa `gh-pages`-branchen och deploya projektet

**Viktigt**: Om ditt repository heter något annat än `expense-tracker`, eller om du deployar som root-site, måste du uppdatera `base`-värdet i `vite.config.ts`:
- För project pages: `base: '/ditt-repo-namn/'`
- För root site: `base: '/'`

### Lokal testning av CI/CD

Du kan testa build-processen lokalt:

```bash
# Testa att bygga projektet
npm run build

# Förhandsgranska produktionsbyggen
npm run preview
```

## 📁 Projektstruktur

```
expense-tracker/
├── src/
│   ├── components/          # (För framtida komponenter)
│   ├── context/
│   │   └── AuthContext.tsx  # Autentiseringskontext
│   ├── pages/
│   │   ├── Login.tsx        # Inloggningssida
│   │   ├── Register.tsx     # Registreringssida
│   │   └── Dashboard.tsx    # Huvudsida med budget
│   ├── services/
│   │   ├── authService.ts   # Mock autentisering
│   │   └── transactionService.ts  # Transaktionshantering
│   ├── tests/
│   │   ├── setup.ts         # Test setup
│   │   ├── auth.test.tsx    # Autentiseringstester
│   │   ├── dashboard.test.tsx  # Dashboard-tester
│   │   └── balance.test.ts  # Balansberäkningstester
│   ├── App.tsx              # Huvudapplikationskomponent
│   ├── main.tsx             # Entry point
│   └── index.css            # Globala stilar
├── .github/
│   └── workflows/
│       └── ci-cd.yml        # GitHub Actions workflow
├── public/                  # Statiska filer
├── index.html               # HTML template
├── package.json             # Dependencies och scripts
├── vite.config.ts           # Vite konfiguration
├── tsconfig.json            # TypeScript konfiguration
└── README.md                # Denna fil
```

## 💰 Budgetlogik

- **Intäkter**: Positiva belopp (t.ex. +5000 SEK)
- **Kostnader**: Negativa belopp (t.ex. -3000 SEK)
- **Balans**: Summan av alla transaktioner
  - Om balansen är positiv visas den i grönt
  - Om balansen är negativ visas den i rött

## 🎯 Användning

### Testkonto
Ett demo-konto skapas automatiskt första gången du öppnar applikationen:
- **Email**: `demo@example.com`
- **Lösenord**: `demo123`
- **Namn**: Demo Användare

Du kan använda detta konto för att logga in direkt, eller skapa ett nytt konto.

### Steg för att använda applikationen:

1. **Logga in**: Gå till `/login` och logga in med testkontot eller dina egna uppgifter
   - Testkonto: `demo@example.com` / `demo123`
2. **Skapa konto** (valfritt): Gå till `/register` och skapa ett nytt konto
3. **Dashboard**: Efter inloggning kommer du till dashboard där du kan:
   - Se din nuvarande balans
   - Se lista över intäkter och kostnader
   - Lägga till nya intäkter
   - Lägga till nya kostnader
4. **Logga ut**: Klicka på "Logga ut"-knappen för att logga ut

## 📝 Noteringar

- All data lagras lokalt i webbläsarens localStorage
- Data försvinner om localStorage rensas
- Endast en användare behövs för demoändamål
- Projektet är designat för pedagogiska ändamål

## 🤝 Bidrag

Detta projekt är byggt som en demo-applikation. För förbättringar eller buggfixar, skapa gärna en pull request.

## 📄 Licens

Detta projekt är öppet för användning och modifiering.
