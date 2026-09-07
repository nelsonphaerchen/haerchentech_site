import { build } from 'esbuild';
import importGlob from 'esbuild-plugin-import-glob';

// Fallback in case of default export wrapping in ESM
const globPlugin = typeof importGlob === 'function' ? importGlob : importGlob.default;

try {
  await build({
    entryPoints: ['index.js'], // adjust path if your entry point is src/index.js
    bundle: true,
    outfile: 'dist/index.js',
    format: 'esm',
    target: 'es2022',
    plugins: [globPlugin()],
  });
  console.log('Build succeeded!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}