module.exports = function postcssLog() {
  return {
    postcssPlugin: 'postcss-log',
    Once(root, { result }) {
      // Write a small marker file so we can detect execution even
      // if stdout is not forwarded by the Angular build process.
      try {
        const fs = require('fs');
        fs.appendFileSync('/tmp/postcss-invoked.txt', `POSTCSS-LOG: ${new Date().toISOString()}\n`);
      } catch (e) {
        // fallback to console if file write fails
        console.log('POSTCSS-LOG fallback:', e && e.message);
      }
    }
  };
};
module.exports.postcss = true;
