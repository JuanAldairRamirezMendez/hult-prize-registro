const postcssLog = require('./scripts/postcss-log.js');
module.exports = {
  plugins: [
    // Local logger to confirm PostCSS pipeline runs during build
    postcssLog(),
    require('@tailwindcss/postcss')(),
    require('autoprefixer')(),
  ]
}
