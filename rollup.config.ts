import {defineConfig} from 'rollup';
import copy from 'rollup-plugin-copy';
import {applyPatch} from 'diff';
import {readFileSync} from "fs";
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import { NodePackageImporter } from 'sass';
import sassRollupPlugin from 'rollup-plugin-sass';
import resolve from '@rollup/plugin-node-resolve'
// @ts-ignore — no type declarations available
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import postcss from 'rollup-plugin-postcss';
import postcssImport from 'postcss-import';
import type { Options as SassOptions } from 'sass';
import tailwindcss from '@tailwindcss/postcss';
import postcssUrl from "postcss-url";

const isWatch = process.env.ROLLUP_WATCH === 'true';
const isProd  = process.env.BUILD == "production";

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

const globalThisModules = ["photoswipe.js", "photoswipe-ui-default.js"]

export default defineConfig([
    // javascript
    {
      input: {
        global: 'src/js/index.ts',
        single: 'src/js/single.ts',
        lightbox: 'src/js/lightbox.ts',
      },
      output: {
        dir: 'dist/build/assets/built',
        sourcemap: true,
        chunkFileNames: 'chunks/[name]-[hash].js',
      },
      moduleContext: (id) => {
        const isGlobalThis = globalThisModules.some(m => id.endsWith(m))
        if (isGlobalThis) {
          return  'globalThis'
        }
      },
      plugins: [
        resolve(),
        typescript({ tsconfig: 'tsconfig.json' }),
        ...(isWatch ? [
          serve({
            contentBase: ['dist/build', 'test'],
            port: 3000,
            open: false,
          }),
          livereload({ watch: 'src' }),
        ] : []),
        ...(isProd ? [
          terser(),
        ] : []),
        copy({
          targets: [
            { src: 'themes/wind/package.json', dest: 'dist/build' }, // needed so ghost knows about theme configs
            { src: 'themes/wind/assets/fonts', dest: 'dist/build/assets' },
            { src: 'themes/wind/locales', dest: 'dist/build' },
            { src: 'themes/wind/partials', dest: 'dist/build' },
            { src: 'themes/wind/*.hbs', dest: 'dist/build' },

            // our custom images
            { src: 'src/img', dest: 'dist/build/assets' },
          ]
      })
    ]
  },

  // css
  {
    input: {
      style: "src/css/index.scss",
    },
    output: { dir: 'dist/build/assets/built' },
    plugins: [
      ...(isWatch ? [
        livereload({ watch: 'src' }),
      ] : []),
      postcss({
        sourceMap: true,
        extract: true,
        minimize: isProd,
        plugins: [
          postcssImport(),
          // tailwindcss()
        ],
        use: {
          sass: {
            importers: [new NodePackageImporter()],
            sourceMap: true,
          } satisfies SassOptions<'sync'>,
          stylus: null,
          less: null,
        },
      }),
    ]
  }
]);
