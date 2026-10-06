# Rapporto revisione locale 1.8.5 / PDF 7.7

Revisione del 6 ottobre 2026 richiesta dal m.llo D’Ascoli. Nessun commit, push o pubblicazione eseguiti.

## Modifiche

- **R17 e R18:** eliminate dal catalogo attivo, dalla ricerca, dall’indice, dai modelli, dai suggerimenti, dai dati storici non esposti, dal confronto di copertura del regolamento e dal PDF. I tre originali del taxi collettivo restano integri in `allegati/` e disponibili in “Fonti e allegati”.
- **TC01:** identifica espressamente come ordinanze dirigenziali O.D. n. 1/2019, n. 10/2025 e n. 9/2026. Mantiene tratta, € 6 per passeggero con bagagli, tassametro non avviato, ricevuta, tabella, turnazione, percorsi, fermate e stalli. La deroga temporanea per vetture con meno di sette posti è limitata alla tratta e alla proroga fino al 31/12/2026; non genera una sanzione autonoma.
- **G24:** titolo “Comportamento scorretto: acquisizione di clienti fuori dalla fila dei passeggeri”. La formula documenta passeggeri già in fila, persone esterne contattate, offerta, acquisizione, prelievo, luoghi, orari e fonti. “Fuori dalla fila” riguarda le persone e non prova un prelievo fuori posteggio. Riferimento comunale: delibera C.C. n. 80/2005, art. 23, comma 1, lett. c. Importi e seguito già presenti sono conservati; l’art. 86, comma 3-bis, CdS non è esteso automaticamente.
- **G28-02:** nel riquadro normativo sono presenti art. 86, comma 3-bis, CdS e regolamento comunale, art. 23, comma 1, lett. n. Le note distinguono l’obbligo generale di ricevuta su richiesta dalla consegna a inizio corsa a tariffa predeterminata, riportata dalla D.D. n. 72/2012, punto 7, lett. b, con richiamo alla D.D. n. 135/2010. Importi, formula e classificazione approvati restano invariati.

## Fonti e limiti

Gli originali O.D. n. 1/2019, n. 10/2025 e n. 9/2026 sono stati letti integralmente. La ricerca nelle fonti ufficiali comunali indicizzate del 6 ottobre 2026 non ha individuato un atto successivo che proroghi la tratta oltre il 31/12/2026; l’assenza di risultati non prova l’assenza di atti non indicizzati.

L’allegato ufficiale indicizzato della D.D. n. 72/2012 espone il punto 7, lett. b, ma il collegamento diretto restituisce HTTP 404. Non è quindi acquisito il file integrale. Anche la D.D. n. 135/2010 integrale resta da acquisire. Questi limiti sono mantenuti nelle note e in `VERIFICA_RICEVUTE_TARIFFE.md`.

## Output e verifiche

- PWA **1.8.5**, build `d75a19483d6ade84569d9f0bb9838ee8c6c6eb6e738dae9d35c9776eeaaae135`.
- PDF **7.7**, 206 pagine: 187 schede di una pagina, sei pagine di indice; G24 p. 45, TC01 p. 58, G28-02 p. 87.
- `npm test`: superato integralmente.
- Browser mobile 390 × 844: ricerca, assenza di R17/R18, apertura delle tre schede, layout senza scorrimento orizzontale, copia senza suggerimenti e collegamenti PDF verificati.
- “Fonti e allegati”: apertura, download e salvataggio offline presenti per i tre originali del taxi collettivo.
- PDF salvato nella PWA e richiesto offline: risposta `206`, `application/pdf`, intervallo di byte valido.
- Controllo visivo: copertina e pagine 45, 58 e 87 leggibili, senza tagli o sovrapposizioni.

Il PDF 7.7 dovrà essere salvato nuovamente per l’uso offline; gli originali invariati possono essere conservati dalla cache durante un futuro aggiornamento.
