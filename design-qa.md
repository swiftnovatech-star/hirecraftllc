# CSS hero artwork verification

final result: passed

## Current target

The artwork rules from the user's `/mnt/HDD/Profiles/style.css` are extracted into `src/components/hero-art.css` and used by `src/components/hero-art.tsx`. Only artwork selectors, their color dependencies, and their responsive rules are imported; unrelated page styles are not copied.

The original rounded frame is preserved rather than using the supplied stylesheet's near-square frame: a pronounced top-left curve and smaller remaining corners. The artwork label is lowered slightly to clear the curve. The surrounding hero layout, headline, actions, and proof statement remain unchanged. Previously removed eyebrow text and floating badge remain absent.

## Evidence

- Chromium checks at 1440px, 900px, 700px, and 360px widths report no horizontal overflow or runtime errors.
- The artwork heights match the supplied breakpoints: 528px, 470px, and 410px.
- The top-left frame radius is 110px on desktop and 80px on mobile.
- Artwork screenshots: `/tmp/hirecraft-extracted-art-1440.png`, `/tmp/hirecraft-extracted-art-900.png`, `/tmp/hirecraft-extracted-art-700.png`, and `/tmp/hirecraft-extracted-art-360.png`.
- The production build and all eight existing browser tests pass.

The spheres use the supplied gradients and shadows; the bridge uses its original translucent border, rotation, and backdrop blur rather than the previous masked approximation. No raster image is loaded for the hero artwork. Browser verification covers Chromium; other engines have not been tested.
