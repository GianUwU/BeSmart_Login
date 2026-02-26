# BeSmart Login App

Eine moderne Login- und Registrierungsanwendung mit mehrsprachiger Unterstützung (Englisch, Französisch, Deutsch), gebaut mit React und Vite.

## 🎯 Features

- **Authentifizierung**: Login- und Registrierungsseiten mit Validierung
- **Mehrsprachigkeit**: Unterstützung für Englisch (EN), Französisch (FR) und Deutsch (DE)
- **Dashboard**: Geschützte Seite mit Produktliste nach erfolgreicher Anmeldung

## 🚀 Installation

```bash
npm install

npm run dev

npm run build
```

## 🌐 Sprachunterstützung

Die Anwendung unterstützt folgende Sprachen:

- **🇬🇧 English (EN)**
- **🇫🇷 Français (FR)**
- **🇩🇪 Deutsch (DE)**

Sprachen können über den Language Switcher gewechselt werden, und die Auswahl wird in der URL reflektiert (z.B. `/login/de`, `/dashboard/en`).

## 🔐 Authentifizierung

- Benutzer können sich mit Benutzername und Passwort registrieren
- Nach erfolgreicher Anmeldung wird der Benutzername in `localStorage` gespeichert
- Das Dashboard ist geschützt und erfordert eine aktive Sitzung

## 🔗 API-Integration

Die Anwendung kommuniziert mit einem Backend-API:

- **Development**: Proxy über Vite (definiert in `vite.config.js`)
- **Production**: Direkter API-Aufruf über `VITE_API_URL` Environment-Variable

Wichtige Endpoints:
- `GET /api/product/list` - Liste aller Produkte abrufen

## 📝 Environment-Variablen

### `.env.production`
```
VITE_API_URL=https://ipt71.kuno-schuerch.bbzwinf.ch
```

## 🚢 Deployment auf Plesk

Für das Deployment auf Plesk wird eine `.htaccess` Datei verwendet, um Client-seitige Routing-Anfragen korrekt zu bearbeiten:

## 👤 Autor

Gian Gaudenz
