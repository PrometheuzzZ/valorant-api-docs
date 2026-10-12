import { defineConfig } from 'astro/config';

// https://astro.build/config
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
    site: 'https://valdocs.prometheuz.me',
    integrations: [tailwind()],
    build: {
        format: 'directory'
    },
    vite: {
        resolve: {
            preserveSymlinks: true
        }
    }
});