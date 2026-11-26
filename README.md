# GIF Search

A React 17 demo for searching GIPHY, browsing trending GIFs and copying image links.

## Local development

Use Node 22 and npm. Install with `npm ci --ignore-scripts`.
Copy `.env.example` to `.env.local`, supply your own restricted GIPHY application key, then run `NODE_OPTIONS=--openssl-legacy-provider npm start`.
The key is embedded in the browser bundle: environment variables do not make it secret. Without a key, the app shows a configuration message and sends no API requests.

A key was present in historical commits. Its owner must rotate/restrict it before live use. Removing it from current source does not revoke it. Never paste private credentials into this frontend.

## Behavior

- Submit a trimmed query with Enter or Search. Trending clears the query.
- Requests use a 12-second timeout, cancel obsolete searches and ignore late responses.
- Loading, failure/retry and no-results states are explicit. Results are limited to 25 with G rating requested from GIPHY; external content is not independently reviewed.
- Each card has a keyboard-accessible copy button. Success appears only after the clipboard resolves. A direct image link remains available when clipboard permission is denied or unsupported.
- Clipboard support normally requires HTTPS or localhost.

## Validation

```sh
npm run lint
CI=true npm test -- --watchAll=false --runInBand
NODE_OPTIONS=--openssl-legacy-provider npm run build
```

Eight regression tests cover keyboard search/reset, missing configuration, malformed results, request retry, stale responses, timeout and clipboard success/failure. Network and clipboard APIs are mocked in tests. Local production UI was checked at 320, 768 and 1280 pixels for search/reset and horizontal overflow; populated live GIF results remain unverified without a replacement key.

## Deployment and limitations

`npm run build` outputs `build/`, suitable for an existing free static host. Set the browser-visible key at build time and rebuild. No hosting resource is provisioned by this repository. GitHub Pages was not configured during the November 27, 2026 inspection. A preview integration, if discovered on the PR, is distinct from production deployment.

The legacy Create React App 4 toolchain needs the temporary OpenSSL option on Node 22. It has outstanding dependency audit findings and is not production-ready. Dart Sass replaces the obsolete native compiler without changing the framework. A supported build-tool migration, credential rotation and live service verification are release prerequisites. No paid APIs or hosting have been provisioned.
