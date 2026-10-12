# Contributing

Please don't modify any files/directories under the `docs` directory. Those files are automatically generated.

To modify the underlying data sources, see [./valorant-api-types](./valorant-api-types).
To change the web docs itself, check [./web](./web).

Sample responses in [`valorant-api-types/tests/endpoint-responses`](./valorant-api-types/tests/endpoint-responses) are one of the most useful contributions:
each one is checked against the endpoint's schema in CI.
Run `npm test` in `valorant-api-types` to see which endpoints still have no samples.
