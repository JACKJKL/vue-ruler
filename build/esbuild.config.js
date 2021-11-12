require('esbuild').build({
    entryPoints: ['./src/index.js'],
    bundle: true,
    outfile: './lib/out.js',
  }).catch(() => process.exit(1))