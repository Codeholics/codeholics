# Local testing notes

- Chromium Playwright smoke tests passed for desktop nav visibility, mobile menu toggle, keyboard open/close flow, and theme persistence.
- Firefox Playwright smoke checks passed for desktop nav visibility, mobile menu toggle, and theme persistence using the local preview server.
- WebKit and mobile WebKit could not be launched on this Linux host because Playwright reported missing system dependencies (`libicu74`, `libflite1`) and the session does not have sudo access to install them.
- Current decision: accept Chromium + Firefox coverage as sufficient for task completion on this change, despite WebKit remaining unavailable on this host.
- Staging deployment was not performed from this session. It requires a committed/pushed branch and the repository's deployment secrets/workflow path.
- Legacy files `astro/src/components/Header.astro` and `astro/src/scripts/navbar.js` were removed after validation of the replacement header.
