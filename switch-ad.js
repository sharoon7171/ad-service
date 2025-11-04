#!/usr/bin/env node

/**
 * Ad Switcher Script
 * Copies a selected ad from ads/ directory to root ad.json
 * 
 * Usage: node switch-ad.js [ad-name]
 * Example: node switch-ad.js prevent-duplicate-tabs
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Usage: node switch-ad.js [ad-name]');
  console.error('Example: node switch-ad.js prevent-duplicate-tabs');
  console.error('\nAvailable ads:');
  
  // List available ads
  const adsDir = path.join(__dirname, 'ads');
  if (fs.existsSync(adsDir)) {
    const files = fs.readdirSync(adsDir)
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''));
    files.forEach(ad => console.error(`  - ${ad}`));
  }
  
  process.exit(1);
}

const adName = args[0];
const sourceFile = path.join(__dirname, 'ads', `${adName}.json`);
const targetFile = path.join(__dirname, 'ad.json');

// Check if source file exists
if (!fs.existsSync(sourceFile)) {
  console.error(`Error: Ad file not found: ${sourceFile}`);
  console.error(`Available ads in ads/ directory:`);
  
  const adsDir = path.join(__dirname, 'ads');
  if (fs.existsSync(adsDir)) {
    const files = fs.readdirSync(adsDir)
      .filter(file => file.endsWith('.json'))
      .map(file => `  - ${file.replace('.json', '')}`);
    files.forEach(file => console.error(file));
  }
  
  process.exit(1);
}

// Read source ad file
let adContent;
try {
  adContent = fs.readFileSync(sourceFile, 'utf8');
  
  // Validate JSON
  JSON.parse(adContent);
} catch (error) {
  console.error(`Error: Invalid JSON in ${sourceFile}`);
  console.error(error.message);
  process.exit(1);
}

// Write to universal ad.json
try {
  fs.writeFileSync(targetFile, adContent, 'utf8');
  console.log(`✓ Successfully switched to ad: ${adName}`);
  console.log(`✓ Updated ad.json`);
} catch (error) {
  console.error(`Error: Failed to write ad.json`);
  console.error(error.message);
  process.exit(1);
}

