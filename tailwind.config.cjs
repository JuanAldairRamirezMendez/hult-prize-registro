/** @type {import('tailwindcss').Config} */
const path = require('path');
module.exports = {
  // Use rutas absolutas para evitar problemas cuando la herramienta
  // ejecuta Tailwind desde un CWD distinto al del proyecto.
  content: [
    // Escanear plantillas y TS/JS en `src`. Añadimos mjs/js por si el builder
    // genera plantillas en otros formatos.
    `${path.resolve(__dirname, 'src')}/**/*.{html,ts,js,mjs}`,
    // Archivo de inclusión opcional que creamos para forzar clases en diagnóstico
    `${path.resolve(__dirname, 'src')}/_tailwind-include.html`
  ],
  theme: {
    extend: {},
  },
  // Si necesitas safelist, re-introduce aquí; por ahora lo removemos
  // para garantizar que la detección por content funcione.
  plugins: [],
}
