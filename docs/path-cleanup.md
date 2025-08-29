# Windows PATH Cleanup Guide

## Čo je PATH a prečo duplicitné/súborové položky škodia

**PATH** je systémová premenná, ktorá obsahuje zoznam priečinkov, kde Windows hľadá spustiteľné súbory.

**Problémy:**

- **Duplicitné záznamy** - spôsobujú nepredvídateľné chovanie, rôzne verzie nástrojov
- **Súborové cesty** (_.exe, _.cmd, _.bat, _.ps1) - PATH má obsahovať len priečinky, nie súbory
- **Overlong PATH** (>64 položiek) - môže spôsobovať chyby pri spúšťaní aplikácií

## Ako spustiť DRY-RUN (preview zmien)

```powershell
powershell -ExecutionPolicy Bypass -File tools/windows/Export-CleanPath.ps1
```

**Výstup:** JSON s `mode: "DRY-RUN"`, `oldCount`, `newCount`, `removedDuplicates`, `removedFileEntries`

## Ako urobiť backup + APPLY

```powershell
powershell -ExecutionPolicy Bypass -File tools/windows/Export-CleanPath.ps1 -Backup .\.ai\checks\user-path-backup.json -Apply
```

**Postup:**

1. Backup sa uloží do `.ai/checks/user-path-backup.json`
2. Zobrazí sa preview zmien
3. Confirmation prompt: "About to update **User PATH** only. Proceed? (Y/N)"
4. Odpoveď: `Y` pre potvrdenie
5. User PATH sa aktualizuje
6. Reštart shellu je potrebný

## Overenie zmien

Po APPLY a reštarte shellu:

```powershell
pnpm run diag:env
```

**Očakávané výsledky:**

- `pathLint.status: "OK"` (alebo výrazne menej WARN)
- `totalEntries: ~25` (namiesto 83)
- `duplicates: []` (prázdne pole)
- `fileEntries: []` (prázdne pole)

## Rollback (obnovenie pôvodného PATH)

Ak potrebuješ vrátiť pôvodný stav:

1. Otvor backup súbor `.ai/checks/user-path-backup.json`
2. Skopíruj hodnotu z `userPath` poľa
3. Windows → System Properties → Environment Variables → User variables → Path
4. Vlož pôvodnú hodnotu
5. OK → Apply → OK

## Bezpečnostné poznámky

- **Script mení len User PATH** (HKCU), nikdy nie System PATH
- **DRY-RUN je default** - nič sa nemení bez `-Apply` parametra
- **Backup je povinný** s `-Backup` parametrom
- **Confirmation prompt** - Y/N potvrdenie pred zmenou
- **ExecutionPolicy Bypass** - ak je potrebný pre spustenie

## Fallback (ak script zlyhá)

### PowerShell ExecutionPolicy blok:

```powershell
powershell -ExecutionPolicy Bypass -File tools/windows/Export-CleanPath.ps1
```

### Registry zápis zlyhá:

1. Windows → System Properties → Environment Variables → User variables → Path
2. Ručne vymazať duplikáty a súborové cesty (_.exe, _.cmd, _.bat, _.ps1)
3. Ponechať len nevyhnutné priečinky (Node, Git, Cursor/VS Code, etc.)

## Príklad výstupu

**DRY-RUN:**

```json
{
  "mode": "DRY-RUN",
  "oldCount": 83,
  "newCount": 25,
  "removedDuplicates": ["C:\\Python313\\Scripts\\", "C:\\WINDOWS\\system32"],
  "removedFileEntries": ["C:\\Program Files\\nodejs\\node.exe"],
  "proposedPathPreview": "C:\\Users\\olieb\\Mastro\\node_modules\\.bin;C:\\Users\\olieb\\AppData\\Local\\node\\corepack\\v1\\pnpm\\10.14.0\\dist\\node-gyp-bin;..."
}
```

**APPLY:**

```json
{
  "mode": "APPLY",
  "oldCount": 83,
  "newCount": 25,
  "removedDuplicates": [...],
  "removedFileEntries": [...],
  "proposedPathPreview": "..."
}
```

