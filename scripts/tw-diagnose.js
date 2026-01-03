const fs = require('fs');
const path = require('path');

function readConfig() {
  const cfgPath = path.resolve(__dirname, '..', 'tailwind.config.cjs');
  if (!fs.existsSync(cfgPath)) {
    console.error('tailwind.config.cjs no encontrado:', cfgPath);
    process.exit(2);
  }
  const cfg = require(cfgPath);
  return { cfgPath, cfg };
}

function walkDir(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walkDir(full, fileList);
    else fileList.push(full);
  }
  return fileList;
}

function expandPattern(pattern) {
  // Simple handler: if pattern contains '{' with extensions, extract base dir
  if (pattern.includes('{') && pattern.includes('}')) {
    // examples: /abs/path/src/**/*.{html,ts,js,mjs}
    const pre = pattern.split('{')[0];
    const brace = pattern.slice(pattern.indexOf('{') + 1, pattern.indexOf('}'));
    const exts = brace.split(',').map(s => s.trim());
    // find base dir before **
    const starIdx = pre.indexOf('**');
    let base = pre;
    if (starIdx !== -1) base = pre.slice(0, starIdx);
    base = base.replace(/\/*$/, '');
    return { type: 'globExt', base: base || '.', exts };
  }
  // if no braces but contains wildcard *
  if (pattern.includes('*')) {
    const starIdx = pattern.indexOf('*');
    let base = pattern.slice(0, starIdx);
    base = base.replace(/\/*$/, '');
    return { type: 'glob', base: base || '.' };
  }
  // otherwise literal file
  return { type: 'file', file: pattern };
}

(async () => {
  const { cfgPath, cfg } = readConfig();
  const content = cfg.content || [];
  console.log('Usando config:', cfgPath);
  console.log('Patterns content:', content);

  const matchedFiles = new Set();

  for (const p of content) {
    const info = expandPattern(p);
    if (info.type === 'file') {
      const f = path.resolve(info.file);
      if (fs.existsSync(f)) matchedFiles.add(f);
      else console.warn('Archivo no encontrado:', f);
    } else if (info.type === 'globExt') {
      const base = path.resolve(info.base);
      if (!fs.existsSync(base)) {
        console.warn('Base no existe:', base);
        continue;
      }
      const all = walkDir(base);
      for (const f of all) {
        const ext = path.extname(f).replace('.', '');
        if (info.exts.includes(ext)) matchedFiles.add(f);
      }
    } else if (info.type === 'glob') {
      const base = path.resolve(info.base);
      if (!fs.existsSync(base)) continue;
      const all = walkDir(base);
      for (const f of all) matchedFiles.add(f);
    }
  }

  const files = Array.from(matchedFiles).sort();
  console.log('\nArchivos coincidentes encontrados:', files.length);
  if (files.length > 100) console.log('...mostrando primeros 200');
  files.slice(0, 200).forEach((f, i) => console.log(`${i + 1}. ${path.relative(process.cwd(), f)}`));

  // Buscar text-green-600 y bg-green-600
  const needle = /text-green-600|bg-green-600/g;
  const hits = [];
  for (const f of files) {
    try {
      const txt = fs.readFileSync(f, 'utf8');
      const m = txt.match(needle);
      if (m && m.length) {
        hits.push({ file: f, count: m.length });
      }
    } catch (e) {
      // ignore
    }
  }

  console.log('\nArchivos que contienen text-green-600/bg-green-600:', hits.length);
  hits.forEach(h => console.log(`- ${path.relative(process.cwd(), h.file)} (ocurrencias: ${h.count})`));

  if (hits.length === 0) {
    console.log('\nNingún archivo fuente contiene literal `text-green-600` o `bg-green-600` según los patrones de content.');
    console.log('Si las clases se generan dinámicamente (ngClass, concatenación) Tailwind no las detectará.');
  }

  process.exit(0);
})();
