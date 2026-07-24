# DCN Ascensori — Sito web

Sito vetrina per azienda di ascensori: home con esperienza scroll-driven e sfondo 3D (vano ascensore in Three.js), quattro pagine interne, design dark premium con accento oro.

## Struttura

```
ascensori/
├── index.html              Home (hero 3D scroll-driven, card, statistiche, testimonianze, FAQ, CTA)
├── pages/
│   ├── prodotti.html       Gamma prodotti con foto e schede tecniche
│   ├── servizi.html        Installazione (timeline), manutenzione (piani), modernizzazione
│   ├── azienda.html        Storia, valori, certificazioni
│   └── contatti.html       Form preventivo con validazione + recapiti + emergenze + mappa
├── css/
│   ├── base.css            Design token, reset, tipografia, utility, reveal
│   ├── components.css      Nav, bottoni, card, form, footer, testimonials, FAQ, cookie, loader, scroll-top, WhatsApp
│   ├── home.css            Stili specifici della home
│   └── pages.css           Stili delle pagine interne
├── js/
│   ├── main.js             Nav, menu mobile, reveal on scroll, contatori, FAQ, cookie, scroll-top, loader
│   ├── home.js             Dissolvenza hero, card fisse, particelle
│   ├── elevator3d.js       Scena Three.js: risalita del vano guidata dallo scroll
│   └── form.js             Validazione client del form contatti
└── assets/img/             Logo, favicon SVG, foto prodotti
```

## Avvio locale

`elevator3d.js` è un modulo ES: serve un server HTTP (non `file://`).

```bash
python3 -m http.server 8000
# poi apri http://localhost:8000
```

## Funzionalità

- **Home page**: Hero full-screen con scena 3D, particelle animate, card rivelate da scroll, sezione statistiche animate, servizi, loghi clienti, testimonianze, FAQ accordion, CTA finale
- **Prodotti**: Schede prodotto con foto reali, specifiche tecniche, tag di categoria
- **Servizi**: Timeline di installazione in 5 passi, 3 piani di manutenzione (Essential/Comfort/Full Risk), modernizzazione
- **Azienda**: Storia, valori con card, certificazioni ISO, statistiche animate
- **Contatti**: Form con validazione client, recapiti diretti, banner emergenza 24/7, mappa Google Maps integrata

### Componenti globali (tutte le pagine)
- **Page loader** — spinner dorato all'apertura, si dissolve al caricamento
- **Cookie banner** — glassmorphism, slide-up, persiste scelta in localStorage
- **Scroll-to-top** — pulsante dorato, appare dopo 600px di scroll
- **Pulsante WhatsApp** — contatto rapido flottante con animazione pulse
- **Menu mobile** — hamburger animato, overlay con backdrop-filter

## Note tecniche

- **3D**: Three.js 0.160 via CDN (import map in `index.html`). Se WebGL manca, resta il gradiente CSS di fallback.
- **Accessibilità**: `prefers-reduced-motion` rispettato ovunque (niente particelle/scrub, contenuti visibili subito), focus visibili, aria-label, contrasti ≥ 4.5:1.
- **Form contatti**: solo demo client-side. Per andare in produzione collegare `js/form.js` a un endpoint reale (Formspree, Netlify Forms o API propria) — punto segnalato nel commento dentro il file.
- **Cookie banner**: gestione consenso con localStorage. In produzione collegare a una CMP reale (Iubenda, Cookiebot, etc.).
- **Dati segnaposto**: telefoni, indirizzo, P.IVA e loghi clienti sono fittizi: sostituirli prima della pubblicazione.
- **Design system**: palette dark + oro (`#d4a319`), font Lexend (titoli) / Source Sans 3 (testo), token in `css/base.css`.

## Deploy

Sito statico: qualunque hosting va bene (Netlify, Vercel, GitHub Pages, hosting condiviso). Nessuna build necessaria.
