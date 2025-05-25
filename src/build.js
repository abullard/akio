require('esbuild').build({
  entryPoints: ['./src/index.js'],
  bundle: true,
  platform: 'node',
  outfile: 'dist/accio.js',
  banner: {
    js: '#!/usr/bin/env node',
  },
}).catch(() => process.exit(1));