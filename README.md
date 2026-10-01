# Prontuario interattivo Taxi NCC e trazione animale Napoli

A cura dell’Agente Antonio Balzano · U.O. San Lorenzo.

Prontuario di consultazione con 118 fattispecie, ricerca per sinonimi e parole simili, indice per servizio, importi, riferimenti normativi, formule orientative, suggerimenti e note operative. I riferimenti al regolamento identificano la delibera C.C. n. 80/2005. Non contiene registrazioni di controlli, generalità dei conducenti o relazioni di servizio.

## Pubblicazione con GitHub Pages

1. Creare un repository pubblico chiamato `prontuario-taxi-ncc-napoli` nell’account scelto.
2. Caricare il CONTENUTO di questa cartella nella radice del ramo `main`. `index.html` e `version.json` devono restare nella radice; mantenere le cartelle `assets` e `allegati`. Non caricare lo ZIP come unico file.
3. In Settings → Pages scegliere Source: Deploy from a branch, Branch: main, Folder: /(root), poi Save.
4. Attendere la pubblicazione e usare il link mostrato da GitHub Pages. Il sito non è ancora pubblicato per il solo fatto di aver preparato questi file.

## Aggiornamenti per i colleghi

Gli aggiornamenti dei file su `main` vengono ripubblicati sul medesimo indirizzo. La pagina verifica il manifest `version.json` all’apertura, ogni minuto e al ritorno in primo piano. Se rileva una revisione diversa mostra “Apri versione aggiornata”, senza interrompere la lettura. Il pulsante carica un URL con il nuovo identificatore di revisione; il manifest viene richiesto senza cache e con un parametro variabile. La disponibilità dipende dal completamento della pubblicazione e dalla propagazione dei file; non è un aggiornamento istantaneo a ogni telefono.

Pubblicare sempre `index.html`, `version.json` e gli allegati aggiornati insieme, conservando il manifest generato per quella versione. Le copie HTML scaricate in precedenza non cambiano da sole: per gli aggiornamenti usare il link del sito.

## Struttura

- `index.html`: prontuario e contenuti testuali; gli allegati vengono caricati solo quando richiesti.
- `version.json`: versione, data e identificatore della revisione.
- `assets/`: stemmi già presenti nel prontuario.
- `allegati/`: documenti originali e PDF normale del prontuario, conservati integralmente.
- `.nojekyll`: pubblicazione statica senza elaborazione Jekyll.

Versione 1.0.0, contenuti revisionati al 1 ottobre 2026. Rielaborazione del prontuario U.O. G.I.T. TURISTICA, del regolamento fornito e delle diciture EGAF. Gli originali mantengono la propria attribuzione. Revisione proposta per validazione interna; fonti e limiti dell’aggiornamento sono riportati nel prontuario. Gli aggiornamenti normativi sono revisioni curate, non un’acquisizione automatica delle leggi da parte di GitHub.

Documentazione ufficiale: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
