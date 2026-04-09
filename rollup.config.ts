import {defineConfig} from 'rollup';
import copy from 'rollup-plugin-copy';
import {applyPatch} from 'diff';
import {readFileSync} from "fs";
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';

// prefer patch files in case the theme vendor releases an update
function applyPatches(patchfile: Buffer, filename: string): any {
  const originalFile =  filename.replace('.patch', '')
  const originalFileName = `themes/onflow/${originalFile}`
  const originalContents = readFileSync(originalFileName, 'utf-8');
  return applyPatch(originalContents, patchfile.toString())
}

function renamePatch(name: string, extension: string, fullPath: string): string {
  return name
}

export default defineConfig([
    // javascript
    {
      input: 'src/js/index.ts',
      output: { file: 'dist/custom.js', sourcemap: true },
      plugins: [
        typescript({ tsconfig: 'tsconfig.json' }),
        terser(),
        copy({
          targets: [
            // Copy pre-built stuff in the theme package, no need to re-build
            { src: 'themes/onflow/assets/built', dest: 'dist' },
            { src: 'themes/onflow/assets/vendors', dest: 'dist' },
            { src: 'themes/onflow/locales', dest: 'dist' },
            { src: 'themes/onflow/partials', dest: 'dist' },
            { src: 'themes/onflow/*.hbs', dest: 'dist' },
            { src: 'themes/onflow/routes.yaml', dest: 'dist' },
            { src: 'patches/onflow/**', dest: 'dist', transform: applyPatches, rename: renamePatch },

            // our custom images
            { src: 'src/img', dest: 'dist' },
          ]
      })
    ]
  },
  {
    input: "src/css/index.css",
    output: { file: 'dist/custom.css', sourcemap: true },
    plugins: [
      postcss({ extract: true, minimize: true }),
    ]
  }
]);
