# System PATH Cleanup Guide (Manual GUI)

## Prečo System PATH cleanup?

**System PATH** (HKLM) je globálna systémová premenná, ktorá sa aplikuje na všetkých používateľov. Na rozdiel od User PATH, **nemôže byť automaticky upravená** bez administrátorských práv.

## 🚨 **DÔLEŽITÉ: System PATH sa nemení automaticky!**

Script `Audit-SystemPath.ps1` **len číta** System PATH a vytvára report. Zmeny sa musia urobiť **ručne cez GUI** alebo **CLI s admin právami**.

## 🖥️ **CLI Cleanup (PowerShell s admin právami):**

### **DRY-RUN (bezpečné preview):**

```powershell
powershell -ExecutionPolicy Bypass -File tools/windows/Clean-SystemPath.ps1
```

### **Apply s backupom:**

```powershell
powershell -ExecutionPolicy Bypass -File tools/windows/Clean-SystemPath.ps1 -Backup .\.ai\checks\system-path-backup.json -Apply
```

**⚠️ POZOR:** CLI cleanup vyžaduje **PowerShell spustený ako Administrator** (Run as Administrator).

## 📋 **Kroky na čistenie System PATH:**

### 1. **Otvoriť System Properties**

- **Windows + R** → `sysdm.cpl` → Enter
- Alebo: **Control Panel** → System → Advanced system settings

### 2. **Environment Variables**

- Kliknúť **Environment Variables** (dole v okne)
- V sekcii **System variables** (horná časť) nájsť **Path**
- Vybrať **Path** → kliknúť **Edit**

### 3. **Čistenie System PATH**

**Odstrániť:**

- **Duplicitné záznamy** - rovnaké cesty sa môžu opakovať
- **Súborové cesty** - `*.exe`, `*.cmd`, `*.bat`, `*.ps1`, `*.msi`, `*.dll`
- **Prázdne záznamy** - len `;` bez cesty
- **Neexistujúce priečinky** - cesty k odstráneným programom

**Ponechať:**

- Windows system directories (`C:\Windows\System32`)
- Program Files directories (Git, Node.js, etc.)
- **Len priečinky, nie súbory!**

### 4. **Pravidlá pre System PATH:**

- **Maximálne 64 položiek** (Windows limit)
- **Len priečinky** - nikdy súbory
- **Žiadne duplikáty** - každá cesta len raz
- **Bez trailing separátorov** - `;` na konci

## 🔍 **Ako identifikovať problémy:**

### **Duplikáty:**

```
C:\Program Files\Git\cmd
C:\Program Files\Git\cmd        ← DUPLIKÁT
```

### **Súborové cesty (NESPRÁVNE):**

```
C:\Program Files\nodejs\node.exe  ← SÚBOR (nesprávne)
C:\Program Files\nodejs\          ← Priečinok (správne)
```

### **Prázdne záznamy:**

```
C:\Windows\System32;
;                               ← PRÁZDNY
C:\Program Files\Git\cmd
```

## ⚠️ **Bezpečnostné upozornenia:**

1. **Vždy backup** - pred zmenami si zapíšte pôvodný System PATH
2. **Test po zmene** - reštart shellu a spustite `pnpm run diag:env`
3. **Postupné odstraňovanie** - nie všetko naraz, testujte po každej zmene
4. **Administrátorské práva** - System PATH vyžaduje admin účet

## 🧪 **Overenie zmien:**

Po každej zmene:

1. **OK** → **Apply** → **OK** vo všetkých oknách (GUI) alebo **Y** confirmation (CLI)
2. **Reštart shellu** (PowerShell, CMD, Cursor)
3. **Spustiť audit:**
   ```powershell
   powershell -ExecutionPolicy Bypass -File tools/windows/Audit-SystemPath.ps1
   ```
4. **Spustiť environment check:**
   ```bash
   pnpm run diag:env
   ```

### **CLI Cleanup Verification:**

Po CLI cleanup s `Clean-SystemPath.ps1 -Apply`:

1. **Reštart shellu** (PowerShell, CMD, Cursor)
2. **Verify System PATH:**
   ```powershell
   powershell -ExecutionPolicy Bypass -File tools/windows/Audit-SystemPath.ps1
   ```
3. **Verify overall PATH:**
   ```bash
   pnpm run diag:env
   ```

## 🎯 **Cieľové hodnoty:**

**Očakávané výsledky po cleanup:**

- `pathLint.status: "OK"` (namiesto "WARN")
- `totalEntries: ≤64` (Windows limit)
- `duplicates: []` (prázdne pole)
- `fileEntries: []` (prázdne pole)

## 🆘 **Ak sa niečo pokazí:**

1. **Rollback** - vrátiť pôvodný System PATH z backupu
2. **System Restore** - ak je povolené
3. **Safe Mode** - pre kritické problémy
4. **Professional help** - ak sa Windows neštartuje

## 📝 **Príklad čistého System PATH:**

```
C:\Windows\System32
C:\Windows\System32\Wbem
C:\Program Files\Git\cmd
C:\Program Files\nodejs
C:\Program Files\PostgreSQL\17\bin
```

**Pamätajte: Len priečinky, žiadne súbory, žiadne duplikáty!** 🚀
