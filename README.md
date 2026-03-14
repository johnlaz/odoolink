Odoo Email Link
Your Odoo CRM, supercharged with AI — in a single HTML file.
OEL is a Progressive Web App that handles two things your CRM can't do alone: drafting smart follow-up emails from overdue activities, and capturing inbound leads from your inbox before they fall through the cracks. No backend to host, no new accounts to create, no subscription.
---
What's inside
Phase 1 — Follow-up Email Engine
Connect to Odoo, see every overdue activity assigned to you, and get AI-drafted follow-up emails ready to review in seconds. Edit, attach a file, schedule a follow-up date, assign a colleague — then open your mail client with one click. Every sent email is logged to the Odoo chatter automatically.
Phase 2 — Lead Capture Engine
Point OEL at your Turbify / Yahoo Business inbox and it will scan for emails matching your saved templates (call alerts, quote requests, contact forms — whatever you receive). Groq AI reads the body and extracts the customer name, phone, email, and notes. Review the lead, confirm the assigned rep, pick an activity date, and push it to Odoo as an opportunity with one click. Duplicate checking runs automatically so you never pollute the CRM.
---
Getting started
What you need
Requirement	Notes
Odoo instance	XML-RPC access required. API key from Profile → Account Security → API Keys
Groq API key	Free at console.groq.com — no credit card
Python 3	Only needed for Local Server mode and Lead Capture
First run
Clone or download this repo
Double-click `start.bat` (Windows) or run `python imap_server.py` (Mac/Linux)
Open `index.html` in your browser (or use a local server — see below)
Enter your Odoo and Groq credentials on Step 1, click Continue
That's it. The local servers start silently in the background and handle both the CORS proxy and IMAP scanning.
Hosting (optional)
The app works as a static site on any host:
```bash
# GitHub Pages — push to main, enable Pages in repo settings
# Netlify — drag the folder into the UI
# Vercel
vercel --prod
```
---
The five-step workflow
```
Step 1  →  Step 2  →  Step 3  →  Step 4  →  Step 5
Creds      Connect     Draft      Send       Lead Capture
```
You can jump straight to Step 5 (Lead Capture) from the credentials screen — no need to run the email drafting flow if you're only processing inbound leads.
---
Phase 1 — Follow-up emails in detail
Fetches all activities assigned to you that are due today or overdue
Drafts a personalised email for each contact using Groq AI, pulling from the CRM record and recent chatter history
Review & edit each draft before sending — subject, body, recipient
Attach a file (it downloads alongside the mailto link so you can drag it in)
Assign activity to another user with their own follow-up date
Skip / unskip contacts from a batch
On send: fires `mailto://`, logs the email to chatter as a note, marks the activity done, schedules the next follow-up
---
Phase 2 — Lead capture in detail
Setting up scan templates
The Spec Wizard is the fastest way to build a template:
Click Wizard in the Lead Specifications panel
Browse your recent inbox and check the emails you want to base templates on
Step through each — the body is shown exactly as the scanner will see it
Adjust the pre-filled subject/sender filters and add an AI hint if useful
Save all & close
Alternatively, create a spec manually and fill in the filters yourself.
Scan filters
Each spec has two filter types (at least one required):
Filter	Options	Example
Subject	contains, exact match	`"Call In"` matches `"Re: Call In Request"`
Sender	exact address, domain only, contains	`@searchkings.com` matches any alert from that domain
Body search is also available but opt-in — it's slower since it downloads the full email.
AI extraction
Groq reads the matched email body and extracts:
Customer name (handles ALL CAPS call alert formats)
Phone number
Email address
Notes — the full call summary or project description, verbatim
Agent — the rep who took the call, used to auto-assign the Odoo opportunity
Add a hint to your spec to help Groq with unusual formats, e.g. "This is a SearchKings call alert. Caller name is in ALL CAPS after the star rating line."
Pushing to Odoo
Before any push OEL checks `crm.lead` for matching email and phone. If a duplicate is found the push button is disabled and the existing records are shown — you can still override if you're sure it's a different opportunity. The check also runs at push time to catch concurrent entries by teammates.
On push:
Find or create `res.partner`
Create `crm.lead` as opportunity
Log the source email as a chatter note
Create a `mail.activity` due on your chosen date — it shows up in Phase 1 immediately
---
Settings & data
Export / Import
Use Export settings on the credentials screen to download a single JSON file containing everything:
Odoo and Groq credentials
IMAP credentials
All lead specs
Theme preference
Import on any machine to restore instantly. Specs are merged on import — existing ones are preserved.
Themes
Five themes, switchable via the coloured dots in the top-right corner:
	Theme	Accent
🟡	Lime (default)	`#c8f04e`
🔵	Cyan	`#00d8ff`
🟠	Ember	`#ff7c2a`
🟣	Light	`#6c47ff`
🩷	Violet	`#c77dff`
---
Local servers
Two Python servers run locally to handle things browsers can't do:
Server	Port	Purpose
`server.py`	7842	CORS proxy for Odoo XML-RPC
`imap_server.py`	7843	IMAP scanning + starts server.py automatically
Start everything: double-click `start.bat` (Windows) or run `python imap_server.py`.
Use Check servers in the app to verify both are running. The Test Groq AI button confirms your API key is working before you run a full scan.
Without local servers
Switch to CORS Proxy mode on the credentials screen. The app falls back to public CORS proxies (corsproxy.io and others) — fine for Phase 1, but IMAP scanning requires the local server.
---
Repository structure
```
OdooEmailLink/
├── index.html              Main app — everything in one file
├── imap_server.py          Lead Capture server (port 7843)
├── server.py               CORS proxy (port 7842, auto-started)
├── start.bat               Windows launcher — starts both servers + opens app
├── manifest.json           PWA install metadata
├── sw.js                   Service worker for offline support
├── icons/                  App icons (SVG + PNG)
└── README.md               You are here
```
---
Frequently asked questions
Do I need to leave a terminal open?
On Windows, `start.bat` launches both servers silently in the background — no terminal visible. On Mac/Linux, run `python imap_server.py` and minimise the window.
Is my data safe?
Everything runs locally. Credentials are stored in your browser's localStorage and optionally in an export file you control. Nothing is sent to any third-party service except Groq (for AI) and your own Odoo instance.
What Groq model does it use?
`llama-3.3-70b-versatile` by default — free tier, no credit card. Switch to `llama-3.1-8b-instant` for faster responses at higher volume.
Can multiple people use it?
Yes — each person runs their own copy and connects with their own Odoo credentials. Activities are always filtered to the logged-in user. Export your settings and share the JSON with a teammate to get them set up quickly (they'll need to add their own passwords).
Can I install it as an app?
Yes — open it in Chrome or Edge and look for the install icon in the address bar. It works as a standalone desktop or mobile app with offline support.
---
Built with Groq AI · Odoo XML-RPC · vanilla JS · Python · zero dependencies
