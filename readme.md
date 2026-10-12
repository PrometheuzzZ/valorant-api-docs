# Valorant API Docs

### **To read documentation and get started, go to <https://valdocs.prometheuz.me>**

This is a project designed to automatically document Valorant endpoints based on a typescript module describing endpoints and types.
This module is published on npm so it can be consumed from other projects to use the types, generate documentation, or generate api code.

The site also serves exports generated from the same data: an Insomnia workspace at `/insomnia.json` and an OpenAPI 3.1 spec at `/openapi.json`.

Markdown versions of the docs are generated into the `docs` directory automatically.

To contribute to the code generating the documentation, see the `web` directory.
To contribute to the underlying data and types, see the `valorant-api-types` directory.
Modifications to the `docs` directory will be removed automatically.
