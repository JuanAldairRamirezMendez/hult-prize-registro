const fs = require('fs');
const path = require('path');

const backend = process.env.BACKEND_URL || 'http://localhost:3000';
const cfg = { BACKEND_URL: backend };

const outPath = path.join(__dirname, '..', 'src', 'assets', 'config.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(cfg, null, 2));
console.log('Wrote', outPath, 'with', cfg.BACKEND_URL);
