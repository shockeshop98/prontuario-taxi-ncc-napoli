# Pubblicazione autorizzata — PWA 1.8.17 / PDF 7.19

L’autore ha autorizzato commit, push ordinario su main e deploy GitHub Pages dello stato locale verificato. Prima del commit: remoto allineato alla base aff1eff, npm test e git diff --check superati, 172 schede / 193 pagine / 172 destinazioni confermate. PWA, PDF, importi e formule coincidono con la consegna locale. Il confronto automatico di npm test è ora in sola lettura per non rigenerare il rapporto distribuito durante CI. La verifica pubblica sarà registrata dopo il deploy, usando la vera installazione pubblica 1.8.16 preparata prima del push con 17 fonti salvate e impronte corrispondenti al commit pubblicato.

La sezione seguente documenta la consegna locale precedente all’autorizzazione: «nessun commit, push o deploy» descrive quella fase.

---

# Revisione locale PWA 1.8.17 / PDF 7.19

Base effettiva: PWA 1.8.16 / PDF 7.18, commit aff1effbf91442c8ff3e6775339d1f6eb42cf784. Conservato il lavoro locale preesistente. **Nessun commit, push o deploy.** Aggiornamento esclusivamente editoriale e grafico, senza riesame normativo.

| Ambito | Modifica | Conservazione |
|---|---|---|
| G55 Taxi, p. 51 | Titolo: «Sostava fuori dagli stalli autorizzati» | Codice G55, formula, riferimenti, importi, punti, note e adempimenti invariati. Titolo aggiornato anche in ricerca, indice e PDF. |
| Crediti correnti | «Con la collaborazione del Sottotenente Pasquale D’Ascoli» · «Polizia Turistica» | Cognome D’Ascoli, crediti dell’Agente Antonio Balzano e U.O. San Lorenzo conservati. Rapporti storici e originali intatti. |
| Intestazione PWA e copertina PDF | Polizia Turistica a sinistra, CSA al centro, U.O. San Lorenzo a destra | Tre immagini originali con proporzioni e allineamento conservati. Logo CSA rettangolare completo, senza tagli o ridisegno. |

Dicitura inserita: **«Con il sostegno e la promozione del CSA — Città Metropolitana di Napoli»**. Identifica il sostegno e la promozione della struttura sindacale.

Logo originale: assets/logo-csa-napoli.jpeg, 267×100 px, SHA-256 `d391fb42e8a8aca7b828b763da1a75e89527d949b44c78d1a12da33d44ded663`. File intatto, nessun derivato necessario; dimensioni PWA al massimo pari all’originale. Incluso nel precache e nella lista esplicita Pages.

**Risultato:** 112 voci, 172 viste (104 Taxi, 60 NCC, 8 equine), **193 pagine PDF**, una pagina per ognuna delle 172 schede; 6 pagine d’indice, 172 destinazioni, 171 formule copiabili, 17 fonti.

**Invarianza verificata:** tutti gli importi, i regimi di pagamento e le tabelle delle varianti delle 172 viste; tutte le formule, alternative, attestazioni, note e adempimenti. Unico cambiamento nei dati delle schede: il titolo G55. Anche il testo delle pagine PDF successive alla copertina coincide con la 1.8.16, salvo titolo G55, data e numero di versione. Confronto completo in [verifica-invarianza.json](revisione/1.8.17/verifica-invarianza.json). Le 108 impronte protette di originali e rapporti storici restano valide; fotografia iniziale conservata localmente e non distribuita.

**Controlli eseguiti:**

- npm test: PASS sulla build finale; regressioni precedenti fissate alle rispettive pubblicazioni e controllo corrente 1.8.17. Verifica autore in sola lettura, senza riscrivere rapporti 1.8.16. Log locale: revisione/1.8.17/npm-test.log.
- PDF reale: 193 pagine, tutte le 172 destinazioni controllate; 171 formule corrispondenti alla PWA, campi e tabelle invariati.
- Browser Chromium: tutte le 172 viste a 360/390 px, 171 copie per larghezza, nessun overflow; titolo G55 verificato nella scheda, ricerca e indice. Intestazione controllata anche a 1100 px. Tre loghi caricati, rapporti dimensionali, ordine, allineamento, crediti e dicitura controllati. Copertina e pagina G55 rasterizzate dal PDF corrente e ispezionate visivamente.
- Prima installazione e aggiornamento dalla vera 1.8.16 riprodotta dagli oggetti Git: nuovo logo disponibile offline; 16 allegati invariati conservati, precedente manuale invalidato e PDF 7.19 risalvato. Riapertura offline con logo e PDF verificati per SHA.
- Esclusioni EGAF e materiali riservati mantenute; cache EGAF con query di prova eliminate e URL esclusi respinti dalla nuova PWA. Pubblicazione sempre tramite lista esplicita; fotografia e input di lavoro esclusi.
- git diff --check: PASS. Nessuna prova su telefono fisico o verifica sul sito remoto dichiarata.

Il primo controllo mobile aveva rilevato che una regola CSS precedente riduceva il carattere della dicitura CSA: corretta soltanto la priorità della regola, poi ripetuti controlli browser e npm test con esito positivo.

**Build HTML / version.json / service worker:**

`b196457a2505935c6401de705a77d378b2af23570a0f691f50e8729fac35f5bb`

**PDF 7.19:** 5.800.736 byte · SHA-256:

`eb601d89c9c6cd4ce9a7f7a08202538a2c5cb0c192d05eff77fe2552395976a3`

[Anteprima locale](revisione/1.8.17/anteprima.html) · [PDF 7.19](allegati/Prontuario_Taxi_NCC_Napoli.pdf) · [Esiti browser](revisione/1.8.17/browser-check.json).
