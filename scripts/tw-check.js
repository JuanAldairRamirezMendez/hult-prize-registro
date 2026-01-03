const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
// Use the PostCSS plugin package that wraps Tailwind for PostCSS
const tailwind = require('@tailwindcss/postcss');
const autoprefixer = require('autoprefixer');

(async () => {
  try {
    const projectRoot = path.resolve(__dirname, '..');
    const stylesPath = path.join(projectRoot, 'src', 'styles.css');
    const outPath = '/tmp/tw-check.css';

    if (!fs.existsSync(stylesPath)) {
      console.error('No existe', stylesPath);
      process.exit(2);
    }

    const input = fs.readFileSync(stylesPath, 'utf8');
    const configPath = path.join(projectRoot, 'tailwind.config.cjs');
    let config = {};
    if (fs.existsSync(configPath)) {
      config = require(configPath);
    }

    console.log('Usando tailwind config content paths:', config.content || []);

    const result = await postcss([tailwind(config), autoprefixer]).process(input, {
      from: stylesPath,
      to: outPath,
    });

    fs.writeFileSync(outPath, result.css, 'utf8');
    console.log('Generado:', outPath, 'size:', result.css.length);

    const hasTextGreen = /text-green-600/.test(result.css);
    const hasBgGreen = /bg-green-600/.test(result.css);
    console.log('text-green-600 presente en output?:', hasTextGreen);
    console.log('bg-green-600 presente en output?:', hasBgGreen);

    // show some snippets if present
    if (hasTextGreen) {
      const idx = result.css.indexOf('text-green-600');
      console.log(result.css.slice(Math.max(0, idx-200), idx+200));
    }

    process.exit(0);
  } catch (err) {
    console.error('Error ejecutando PostCSS+Tailwind:', err && err.stack || err);
    process.exit(3);
  }
})();
