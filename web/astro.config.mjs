import { defineConfig } from 'astro/config';

// https://astro.build/config
import tailwind from "@astrojs/tailwind";

// The "Try it" proxy is a Vercel function in production (../api/proxy.mjs); serve the same handler in `astro dev`
const tryItProxy = {
    name: 'try-it-proxy',
    configureServer(server) {
        server.middlewares.use('/api/proxy', async (req, res) => {
            const {default: handler} = await import('../api/proxy.mjs')
            await handler(req, res)
        })
    }
}

// https://astro.build/config
export default defineConfig({
    site: 'https://valdocs.prometheuz.me',
    integrations: [tailwind()],
    build: {
        format: 'directory'
    },
    vite: {
        plugins: [tryItProxy],
        resolve: {
            preserveSymlinks: true
        }
    }
});
