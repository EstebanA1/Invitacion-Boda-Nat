import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'path';
import {fileURLToPath} from 'node:url';
import {defineConfig} from 'vite';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig(() => {
  return {
    plugins: [
      {
        name: 'inline-cover-critical-css',
        transformIndexHtml(html) {
          const criticalCss = fs.readFileSync(path.resolve(projectRoot, 'src/cover-critical.css'), 'utf8');
          const envelopePrerender = fs.readFileSync(path.resolve(projectRoot, 'src/envelope-prerender.html'), 'utf8');
          return html
            .replace('<!-- cover-critical -->', `<style>${criticalCss}</style>`)
            .replace('</main></div></div>', `${envelopePrerender}</main></div></div>`);
        },
      },
      {
        name: 'preload-direct-journey-entry',
        transformIndexHtml: {
          order: 'post',
          handler(html, context) {
            if (!context.bundle) return html.replace('<!-- journey-preloads -->', '');

            const outputs = Object.values(context.bundle);
            const mountChunk = outputs.find((output) =>
              output.type === 'chunk' && output.facadeModuleId?.endsWith('/src/mountWeddingApp.tsx'),
            );
            const journeyChunk = outputs.find((output) =>
              output.type === 'chunk' && output.facadeModuleId?.endsWith('/src/components/DigitalWeddingInvitation.tsx'),
            );
            const stylesheet = outputs.find((output) =>
              output.type === 'asset' && output.fileName.endsWith('.css'),
            );

            const resources = [
              mountChunk && ['modulepreload', 'script', `/${mountChunk.fileName}`],
              journeyChunk && ['modulepreload', 'script', `/${journeyChunk.fileName}`],
              stylesheet && ['stylesheet', 'style', `/${stylesheet.fileName}`],
            ].filter(Boolean);

            const preloadScript = `<script>(()=>{if(document.documentElement.dataset.entry!=="journey")return;const deferEnvelope=location.hash.slice(1)==="scene-envelope";${JSON.stringify(resources)}.forEach(([rel,as,href])=>{if(deferEnvelope&&rel==="modulepreload")return;const link=document.createElement("link");link.rel=rel;link.href=href;if(rel==="preload")link.as=as;document.head.appendChild(link);});})();</script>`;
            const directMountScript = mountChunk
              ? `<script type="module">if(document.documentElement.dataset.entry==="journey"&&location.hash.slice(1)!=="scene-envelope")import("/${mountChunk.fileName}").then(({mountWeddingApp})=>mountWeddingApp());</script>`
              : '';
            return html.replace('<!-- journey-preloads -->', `${preloadScript}${directMountScript}`);
          },
        },
      },
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(projectRoot, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
