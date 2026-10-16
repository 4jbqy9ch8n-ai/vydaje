# Výdaje za děti

Minimalistická evidence společných výdajů, dělení 50/50. Funguje offline, data drží v iPhonu a volitelně je synchronizuje do Google tabulky.

## 1. GitHub Pages
1. Na github.com → **New repository** → název např. `vydaje` → **Public** → Create.
2. Na stránce repozitáře klikni na **uploading an existing file**.
3. Přetáhni do okna **celý obsah** této složky (včetně složky `fonts`), kromě `Code.gs` a `README.md` (ty tam být můžou, nevadí).
4. **Commit changes**.
5. **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main`, složka `/ (root)` → Save.
6. Za 1–2 minuty běží na `https://<tvoje-jméno>.github.io/vydaje/`.

## 2. iPhone
1. Otevři adresu v **Safari** → Sdílet → **Přidat na plochu**.
2. Spouštěj z ikony – běží na celou obrazovku a i offline.

Tím je aplikace hotová. Synchronizace níže je volitelná.

## 3. Synchronizace do Google tabulky (volitelně)
1. Nová Google tabulka → Rozšíření → **Apps Script** → vlož obsah `Code.gs`.
2. V `TOKEN` nahraď text vlastním dlouhým tajným klíčem.
3. Nasadit → Nové nasazení → **Webová aplikace**; Spustit jako: **Já**; Přístup: **Kdokoli** → zkopíruj URL končící `/exec`.
4. V aplikaci dole **Nastavení** → vlož URL a klíč → Uložit.

## Ovládání
- Zadej částku, za co, vyber kdo platil, šipka přidá.
- **Vyrovnat** → klepni ještě jednou na **Potvrdit**.
- Smazání: klepni na řádek, pak znovu na **Smazat**.
- Dole **Nastavení**: jména, synchronizace, záloha do souboru.

## Aktualizace
Po úpravě souborů zvyš verzi v `sw.js` (`vydaje-v4`…), jinak iPhone může držet starou verzi.
