# FootyTabs

A Chrome extension that replaces your new tab page with a Premier League stats dashboard, local weather, and a search bar — personalized to your favourite team.

Chrome extension development is relatively rare in the frontend ecosystem. This project demonstrates Manifest V3 architecture, the new tab override API, browser permission handling (`geolocation`, `storage`), and packaging a React app for the Chrome Extension runtime.

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&logoColor=white)
![Chrome Extension](https://img.shields.io/badge/Chrome%20Extension-Manifest%20V3-4285F4?logo=google-chrome&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.0-7952B3?logo=bootstrap&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase%20Analytics-enabled-FFCA28?logo=firebase&logoColor=black)

## Features

- **Time-based greeting** — "Good morning / afternoon / evening, [name]" updated every second using Luxon
- **Local weather** — current temperature, weather icon, and description via OpenWeatherMap (geolocation-based); toggle between Celsius and Fahrenheit
- **Football dashboard** — carousel widget showing: team overview (position, points, form), recent results with W/D/L badges, upcoming fixtures, and full league standings table
- **Multi-league support** — Premier League, La Liga, Serie A, Bundesliga, and Ligue 1 (via TheSportsDB)
- **Favourite team preference** — pick any team from the selected league; dashboard filters data to that team
- **Dark mode** — full dark theme with dedicated CSS overrides; persisted across sessions
- **Multi-engine search bar** — search with Google, Bing, DuckDuckGo, or Ecosia; preferred engine remembered
- **Motivational quote** — random quote on each new tab (Quotable.io, with static fallback)

## Chrome Extension Installation

Because this is a built React app, you need to build it before loading it into Chrome.

**Requirements:** Node 18+ and npm.

```bash
git clone https://github.com/bhavikbhoir/FootyTabs.git
cd FootyTabs
npm install
```

Create `.env` in the project root with your OpenWeatherMap API key:

```
REACT_APP_WEATHER_API_KEY=your_openweathermap_api_key
```

Build the extension:

```bash
npm run build
```

Load into Chrome:

1. Open `chrome://extensions` in your browser
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **Load unpacked**
4. Select the `build/` folder inside this project

Open a new tab — the extension replaces Chrome's default new tab page immediately.

To update after code changes: run `npm run build` again, then click the refresh icon on the extension card in `chrome://extensions`.

## Screenshots

> Screenshots coming soon

## Tech Stack

| Technology | Version | Role |
|---|---|---|
| React | 18.2.0 | UI framework (class components) |
| Create React App / react-scripts | 5.0.1 | Build toolchain |
| Bootstrap | 5.3.0 | Layout and components |
| react-bootstrap | 2.9.0 | Bootstrap React bindings |
| react-modal | 3.16.0 | Settings and name-entry modals |
| Luxon | 3.4.0 | Date/time formatting |
| weather-icons | 1.3.2 | Iconic weather condition glyphs |
| react-icons | 5.0.0 | UI icons (settings, search) |
| Firebase | 12.9.0 | Analytics (page view events) |
| Sass | 1.97.3 | CSS preprocessing |
| Chrome Extension Manifest V3 | — | Extension runtime and permissions |

## Data Sources

- **Football data:** [TheSportsDB](https://www.thesportsdb.com/) (free API v1) — standings, fixtures, results, team info
- **Weather:** [OpenWeatherMap](https://openweathermap.org/api) API v2.5 — requires a free API key
- **Quotes:** [Quotable.io](https://quotable.io/) — random motivational quote, with hardcoded fallback

## Setup & Build

```bash
npm install          # install dependencies
npm start            # CRA dev server (browser preview; not loaded as an extension)
npm run build        # build for Chrome → /build
npm test             # run tests
```

The `npm start` dev server is useful for UI development but does not run inside the Chrome extension context. Build and load unpacked for full extension behaviour.
