import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: true,
  clean: true,
  format: ['esm', 'cjs', 'iife'],
  globalName: 'promise_tree',
  platform: 'browser',
  // external: ['nanoid'],
  noExternal: ['nanoid'],
  dts : false,
  // esbuildOptions(options, {format}) {
  //   if (format === 'esm') {
  //     options.entryPoints = ['src/index.ts']
  //   }
  //   return options
  // },
  outExtension({ format }) {
    return {
      js: `.${format}.js`,
    }
  },
})