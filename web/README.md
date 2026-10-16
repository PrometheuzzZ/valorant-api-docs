# Valorant API Docs Web

The web frontend for the Valorant API Docs. Built using Astro, TypeScript, and Tailwind CSS.

This module consumes the `@prometheuzz/valorant-api-types` library and produces a static site that can be deployed to any static hosting provider.

## Development

To run the development server, run `npm install` followed by `npm run dev` in this directory.

If you're testing a custom version of `@prometheuzz/valorant-api-types`, you can run [npm link](https://docs.npmjs.com/cli/v10/commands/npm-link) the local version of the library to this project.
Because of Vite's module optimizations, you'll need to kill and restart the development server after making changes to the library.

## Try it

Every HTTP endpoint page has a "Try it" panel that sends the request from the browser.
Values like the shard, puuid and tokens are shared by every endpoint page (session storage, or local storage when "Save" is ticked);
the client platform and the latest client version (from `api.radiantconnect.ca`, cached for 3 hours) are filled in automatically.

Riot's servers don't send CORS headers, so remote requests go through [`/api/proxy`](api/proxy.js),
a Vercel function that only forwards to Riot hosts and doesn't store anything. `npm run dev` serves the same handler.
Local client endpoints (`127.0.0.1`) are called directly from the browser.

## To do
 - Use Astro v3's preload feature to preload links on hover