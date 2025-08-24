#!/usr/bin/env node

import { readFileSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cesta k manifest.json
const manifestPath = join(__dirname, '..', '.ai', 'manifest.json');

try {
  // Načítanie manifest.json
  const manifestContent = readFileSync(manifestPath, 'utf8');
  const manifest = JSON.parse(manifestContent);
  
  if (!manifest.files || !Array.isArray(manifest.files)) {
    console.error('❌ Manifest files array not found or invalid');
    process.exit(1);
  }
  
  const files = manifest.files;
  let missingFiles = [];
  
  console.log(`🔍 Validating ${files.length} files from manifest...`);
  
  // Kontrola existencie každého súboru
  for (const filePath of files) {
    const fullPath = join(__dirname, '..', filePath);
    
    try {
      const stats = statSync(fullPath);
      if (stats.isFile()) {
        console.log(`✅ ${filePath}`);
      } else {
        missingFiles.push(`${filePath} (not a file)`);
      }
    } catch (error) {
      missingFiles.push(filePath);
    }
  }
  
  // Výsledok validácie
  if (missingFiles.length > 0) {
    console.error('\n❌ Missing files:');
    missingFiles.forEach(file => console.error(`   - ${file}`));
    process.exit(1);
  }
  
  console.log(`\n✅ Manifest OK (${files.length} files validated)`);
  
} catch (error) {
  console.error('❌ Error reading manifest:', error.message);
  process.exit(1);
}
