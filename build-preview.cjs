// Build a portable HTML preview from the actual local extension files.
const fs = require('node:fs');
const path = require('node:path');
const read = name => fs.readFileSync(path.join(__dirname, name), 'utf8');
const html = read('preview.html')
  .replace('<link rel="stylesheet" href="styles.css">', () => `<style>${read('styles.css')}</style>`)
  .replace('<script src="content.js"></script>', () => `<script>${read('content.js').replace(/<\/script/gi, '<\\/script')}</script>`);
fs.writeFileSync(path.join(__dirname, 'ui-preview.html'), html);
console.log('Built ui-preview.html (self-contained, no server required)');
