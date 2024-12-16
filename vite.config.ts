import {lingui} from '@lingui/vite-plugin'
import {vitePlugin as remix} from '@remix-run/dev'
import {installGlobals} from '@remix-run/node'
import {vercelPreset} from '@vercel/remix/vite'
import {defineConfig} from 'vite'
import macrosPlugin from 'vite-plugin-babel-macros'
import tsconfigPaths from 'vite-tsconfig-paths'

installGlobals()

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    remix({
      presets: [vercelPreset()],
    }),
    macrosPlugin(),
    lingui(),
    tsconfigPaths(),
  ],
  optimizeDeps: {
    exclude: ['@resvg/resvg-js'],
  },
})
