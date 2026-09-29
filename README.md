# FitAI – Virtual Try-On

En webapp hvor brugeren uploader:
1. Et billede af personen.
2. Et billede af tøjet.
3. Trykker "Prøv tøjet på mig".
4. Backend sender billederne til en virtual try-on AI-model.

## Start hjemmesiden

Installer Node.js.

Åbn terminal i denne mappe:

```bash
npm install
```

Lav en kopi af `.env.example` og kald den `.env`.

Tilføj din AI API-nøgle:

```text
REPLICATE_API_TOKEN=din_nøgle
```

Start:

```bash
npm start
```

Åbn derefter:

http://localhost:3000

## AI-delen

Frontend og upload-flowet er færdigt. `server.js` har én adapterfunktion,
`createTryOn()`, hvor en aktuel virtual try-on-model skal kobles på.

Det er med vilje ikke hard-coded til en bestemt model, fordi modelnavne,
inputfelter og API-versioner kan ændre sig.

## Sikkerhed

- API-nøglen skal kun ligge på serveren i `.env`.
- Uploadede billeder slettes efter forsøget.
- Til en offentlig version bør der tilføjes filstørrelsesgrænse,
  rate limiting, authentication og tydelig privatlivstekst.
