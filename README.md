# Odoo Email Link

AI-powered CRM follow-up emails that work with any email client — packaged as a Progressive Web App.

## What it does

Connects to your Odoo CRM, fetches overdue activities assigned to you, drafts personalised follow-up emails using AI (Groq), and lets you review, edit, and send them via your normal email client. Every sent email is logged as a note in the Odoo chatter and the activity is marked done with a new follow-up scheduled.

## Features

- AI email drafting via Groq (llama-3.3-70b-versatile)
- Review & edit each email before sending
- Per-email follow-up day overrides
- Skip / unskip contacts
- File attachments (downloaded alongside mailto for manual attach)
- Assign activities to other Odoo users
- 5 colour themes (Lime, Cyan, Ember, Light, Violet)
- Credential export/import via JSON
- Works offline (PWA, cached assets)
- Installable on desktop and mobile

## Repository structure

```
OdooEmailLink/
├── index.html          # Main app (single-file, self-contained)
├── manifest.json       # PWA manifest
├── sw.js               # Service worker (offline caching)
├── icons/
│   ├── icon.svg        # Source icon
│   ├── icon-192.png    # PWA icon
│   ├── icon-512.png    # PWA icon
│   ├── icon-maskable-192.png
│   └── icon-maskable-512.png
├── server.py           # Optional local CORS proxy (see below)
└── README.md
```

## Setup

### Requirements

- An Odoo instance with XML-RPC access
- A [Groq API key](https://console.groq.com) (free tier works)
- Python 3 (only if using Local Server mode)

### Running

**Option A — Hosted (recommended)**

Deploy the repository to any static host:

- [GitHub Pages](https://pages.github.com) — push to `gh-pages` branch, enable Pages in repo settings
- [Netlify](https://netlify.com) — drag the folder into the Netlify UI
- [Vercel](https://vercel.com) — `vercel --prod` from the folder

Then open the URL in your browser and install it as a PWA using the browser's install prompt.

**Option B — Local file**

Open `index.html` directly in your browser. Service worker and install prompt won't work from `file://` — use a local server instead:

```bash
python -m http.server 8080
# then open http://localhost:8080
```

### CORS proxy

Odoo's XML-RPC API doesn't allow browser requests directly (CORS). The app uses public CORS proxies by default. For a more reliable connection, run the included local proxy:

```bash
python server.py
```

Then switch to **Local Server** mode in the app's Credentials step. The server runs on `http://localhost:7842`.

### First-time configuration

1. Enter your Odoo URL, database name, username, and API key
2. Enter your Groq API key
3. Set your default follow-up days
4. Click **Save & connect**

Export your credentials to a JSON file for backup or sharing with teammates.

## Theming

Click the five coloured dots in the top-right of the header to switch themes. The choice is saved in localStorage.

| Dot | Theme | Accent |
|-----|-------|--------|
| 🟡 | Lime (default) | `#c8f04e` |
| 🔵 | Cyan | `#00d8ff` |
| 🟠 | Ember | `#ff7c2a` |
| 🟣 | Light | `#6c47ff` |
| 🩷 | Violet | `#c77dff` |

## Notes

- Credentials are stored in `localStorage` — use the export function to back them up
- The app only reads activities assigned to the authenticated user
- Chatter history is capped at 4,000 characters per contact to stay within Groq's token limits
- The attachment feature downloads the file alongside the mailto link — browsers cannot auto-attach files to email clients
