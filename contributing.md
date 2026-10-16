# Contributing

Please don't modify any files/directories under the `docs` directory. They are regenerated from `valorant-api-types` by the
[Build Docs](.github/workflows/build-docs.yml) workflow on every push to `trunk` (locally: `npm run generate-docs` in `web`).

To modify the underlying data sources, see [./valorant-api-types](./valorant-api-types).
To change the web docs itself, check [./web](./web).

Sample responses in [`valorant-api-types/tests/endpoint-responses`](./valorant-api-types/tests/endpoint-responses) are one of the most useful contributions:
each one is checked against the endpoint's schema in CI.
Run `npm test` in `valorant-api-types` to see which endpoints still have no samples.
Real request bodies can go in [`valorant-api-types/tests/endpoint-requests`](./valorant-api-types/tests/endpoint-requests) as `<endpoint-slug>.json`:
they're checked against the endpoint's body schema and shown as the body example on the site.
