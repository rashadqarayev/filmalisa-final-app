This is a dense, multi-layered topic — let me build you a complete reference guide with live interactive diagrams. Here's the full breakdown, starting from first principles.

---

## What is Module Federation?

Before properties, understand the *problem*. In a traditional monolith, one Webpack build produces one bundle. In a Microfrontend (MFE) architecture, you have many teams, many repos, many builds — but you want them to **share code at runtime** (not at build time), so you don't load React 5 times.

Module Federation is Webpack's native solution: it lets one app (`host`) load JavaScript modules from another app (`remote`) **over the network, at runtime**, and share dependencies between them.

Let's visualize the architecture first:Now let's go through every property, concept, and common mistake in detail.

---

## Part 1 — Top-level `ModuleFederationPlugin` properties

### `name`

```js
new ModuleFederationPlugin({ name: "counterpartyCheck" })
```

**What it does:** Assigns a globally-unique identifier to this build. Webpack exposes your module container under `window[name]` at runtime.

**How Webpack uses it internally:** When the browser loads your `remoteEntry.js`, Webpack registers a container object on the global scope: `window.counterpartyCheck = { get, init }`. The host calls `window.counterpartyCheck.get('./App')` to load your exposed module.

**Why it exists:** Since all MFEs run in the same browser tab, there must be a collision-free namespace. Two remotes with the same `name` will clobber each other's entry on `window`.

**Typical values:** camelCase, no hyphens (since it becomes a JS variable). Examples: `"host"`, `"loans"`, `"counterpartyCheck"`.

**Common mistake in your config:** Your remote is named `"counterpartyCheck"` but the folder is `mf-counter`. These don't need to match, but it's confusing at scale. Prefer naming them consistently: if the app is `mf-loans`, name the container `loans`.

**When NOT to use a complex name:** Keep it short and typed — you'll reference this string in every host's `remotes` config.

---

### `filename`

```js
filename: "remoteEntry.js"  // or "remoteEntry-is" (typo in your config)
```

**What it does:** The output filename for the module container manifest. This is the file the host fetches.

**How Webpack uses it internally:** Webpack generates a special runtime chunk under this filename. It contains the module registry, the `get()` and `init()` container API, and a manifest of what's exposed and what's shared.

**Important note in your config:** You have `filename: remoteEntry-is` — this is a typo. It should be `"remoteEntry.js"` (a string). Without quotes it's a reference to an undefined variable, which will throw a build error.

**Cache-busting best practice:** In production, use `filename: "remoteEntry.[contenthash].js"` and configure the host to resolve the URL dynamically (via a manifest.json). Many teams keep `"remoteEntry.js"` with no hash and use long-lived URLs + headers, because the host needs to know the URL ahead of time. This is a meaningful architectural decision with no single right answer.

---

### `exposes`

```js
exposes: {
  "./App": "./src/App",
}
```

**What it does:** Declares which modules this remote makes available to other apps. The key (e.g. `"./App"`) is the public import path. The value is the file path inside this repo.

**How Webpack uses it internally:** Each exposed entry becomes a separate async chunk. When a host calls `import('counterpartyCheck/App')`, Webpack fetches only that chunk — not the entire remote's bundle.

**Why the `./` prefix:** It's a convention enforced by Webpack. The path must start with `./` to indicate it's a module path relative to the container.

**What you can expose:** Any JavaScript module — React components, utilities, stores, hooks. You are NOT limited to one `./App`.

```js
exposes: {
  "./App":       "./src/App",
  "./utils":     "./src/shared/utils",
  "./Button":    "./src/components/Button",
}
```

**Common mistakes:**
- Exposing large barrel files — Webpack can't tree-shake them, so the entire barrel gets sent across the wire.
- Not exposing TypeScript types separately — consumers don't get type safety unless you also publish a `.d.ts` alongside.

**When to NOT expose something:** Internal implementation details, server-only code, or anything with secrets.

---

### `remotes`

```js
// In host or mf-counter:
remotes: {
  host: "host@/remoteEntry.js",
}
```

**What it does:** Tells this app where to find other containers at runtime. The format is:
```
<localAlias>: "<remoteName>@<url>"
```

**How Webpack uses it internally:** When your code writes `import App from 'host/SomeComponent'`, Webpack rewrites that to: fetch `remoteEntry.js` from the URL, call `window.host.get('./SomeComponent')`.

**Anatomy of `"host@/remoteEntry.js"`:**
- `host` — must match the `name` in the remote's own `ModuleFederationPlugin` config
- `@` — separator
- `/remoteEntry.js` — the URL the browser will fetch. `/` means relative to the current origin.

**Issue in your `mf-counter` config:** You have `host: host@/remoteEntry-js` — two problems: `remoteEntry-js` should be `remoteEntry.js`, and the URL `/remoteEntry.js` would try to load the host from `/remoteEntry.js` on the same server. This only makes sense if counter runs on the same port as the host, which is usually wrong in production. In production this should be an absolute URL:
```js
host: "host@https://shell.yourapp.com/remoteEntry.js"
```

**Dynamic remotes (production pattern):** Hard-coding URLs is fragile. Enterprise teams use a runtime lookup:
```js
// resolve the URL at runtime from a config service
remotes: {
  loans: `promise new Promise(resolve => {
    const script = document.createElement('script');
    script.src = window.__MFE_CONFIG__.loansUrl;
    script.onload = () => resolve(window.loans);
    document.head.appendChild(script);
  })`,
}
```

---

## Part 2 — The `shared` configuration (deep dive)

This is the most complex and consequential part. Let's visualize what "shared" actually does at runtime:Now let's break down each `shared` sub-property:

---

### `singleton`

```js
react: { singleton: true }
```

**What it does:** Tells Webpack "only one instance of this library must ever exist in the browser tab at a time." When any MFE tries to load this dependency, it first checks the shared scope — if a version is already registered, it uses that one instead of loading its own.

**Why React *must* be a singleton:** React stores its current component state in a module-level variable. If there are two React instances, they have two separate state stores. This causes:

1. Hooks breaking — `useState` in the remote component talks to a different React than the one rendering it. You get the dreaded "Invalid hook call" error.
2. Context not propagating — `useContext` only works within a single React tree attached to a single React instance. Context from the host won't be visible in the remote.
3. `ref` forwarding failures — refs are tracked per-instance.

**What happens if `singleton: false`:** Each app loads its own copy. If they happen to be the same version, you waste bandwidth loading it twice. If they're different versions, you get the bugs above.

**When `singleton` is NOT needed:** Pure utility libraries with no global state — `lodash`, `date-fns`, `uuid`. These are safe to load multiple times.

---

### `eager`

```js
react: { eager: true }  // vs  eager: false (default)
```

This is one of the trickiest properties. Let me illustrate the two loading behaviors:**`eager: false` (default, recommended):** React is placed in an async chunk. Webpack fetches it lazily, checks the shared scope first, and reuses an already-loaded version. This is what you want 99% of the time.

**`eager: true`:** React is bundled directly into the entry chunk. It loads synchronously, skipping the async negotiation. This means it will always be available — but it also means it always gets downloaded as part of the initial bundle, even if a remote already has it in scope.

**The bootstrap pattern (mandatory with `eager: false`):**

```js
// index.js (the real entry — stays tiny)
import('./bootstrap');  // ← must be async!

// bootstrap.js (the real app start)
import React from 'react';
import App from './App';
ReactDOM.render(<App />, document.getElementById('root'));
```

If your entry file directly `import`s React synchronously while `eager: false`, Webpack throws: "Shared module is not available for eager consumption." The async boundary in `index.js` is what gives Module Federation time to negotiate the shared scope before your code runs.

**Your config correctly has `eager: false`** — this is good. Just make sure all your apps use the bootstrap pattern.

---

### `requiredVersion`

```js
react: { requiredVersion: deps.react }         // e.g. "^18.3.1"
react: { requiredVersion: '^18.0.0' }          // range
react: { requiredVersion: false }              // disabled (your Sentry config)
```

**What it does:** Declares which version range this app needs. Webpack uses this during version negotiation — if the version found in the shared scope doesn't satisfy the range, Webpack warns (or errors with `strictVersion`).

**How version negotiation works:**
1. All apps register their preferred version in the shared scope via `init()`.
2. Webpack picks the **highest** version that satisfies all registered `requiredVersion` ranges.
3. If no single version satisfies all ranges → warning is logged, highest version is used anyway (unless `strictVersion: true`).

**`requiredVersion: deps.react` (your config) — reading from `package.json`:** This is the right pattern. `const deps = require('./package.json').dependencies` gives you `"^18.3.1"` which becomes the range. This keeps your shared config in sync with what's actually installed.

**`requiredVersion: false` (your Sentry config):** This disables the version check entirely. Webpack will accept any version from the shared scope. Fine for libraries where cross-version compatibility isn't a concern, but be careful — if the host has Sentry 7 and a remote registers Sentry 8, they'll share version 8 silently.

**Common mistake:** Setting `requiredVersion: '^19.0.0'` in one remote while the host uses `18.x`. Webpack will warn every time the app loads in production. This is a noisy issue that's easily missed.

---

### `strictVersion`

```js
react: { singleton: true, strictVersion: true, requiredVersion: '^18.0.0' }
```

**What it does:** Upgrades version mismatch warnings to **hard runtime errors**. If the version in the shared scope doesn't satisfy `requiredVersion`, the module load throws rather than proceeding with the wrong version.

**When to use:** In large enterprise setups where you want to enforce that every team uses a compatible version. Prevents silent bugs from version drift.

**When NOT to use:** During development or in small teams where the overhead of debugging hard errors outweighs the risk. Also avoid it for Sentry/utility libs where cross-version use is safe.

**Your config doesn't use this** — that's fine for now, but worth adding for `react` and `react-dom` in production.

---

### `version`

```js
react: { version: '18.3.1' }  // override what's reported
```

**What it does:** Manually overrides the version that gets registered in the shared scope. Normally Webpack reads the version from `node_modules/react/package.json` automatically.

**When you need it:** Only in unusual setups — e.g. if you have a forked package with a different version in its `package.json` than what consumers should see.

**Common mistake:** Using `version` to lie about compatibility. Don't report `version: '18.0.0'` when you're running `17.0.2` — this bypasses version negotiation and causes runtime bugs.

**Your config doesn't use this** — correct, you don't need it.

---

### `import`

```js
react: { import: 'react' }  // default, rarely set explicitly
```

**What it does:** The module to import when this shared dep is loaded. Defaults to the key name. You'd only set it if your internal module name differs from the key.

**Use case:** Aliased packages.
```js
shared: {
  "my-react-alias": {
    import: "react",  // actually load 'react' when 'my-react-alias' is imported
    singleton: true,
  }
}
```

**Your config doesn't set this** — correct, leave it at default.

---

### `shareScope`

```js
react: { shareScope: 'default' }  // the default value
```

**What it does:** Groups shared modules into named scopes. All apps sharing the same scope name share a single version registry. Different scope names = isolated registries.

**Why it exists:** Imagine you have two unrelated product areas on the same page — one React 17 legacy app and one React 18 new app. Putting them in different scopes lets them coexist without version conflicts:

```js
// Legacy remote
react: { singleton: true, shareScope: 'legacy' }

// New remote
react: { singleton: true, shareScope: 'modern' }
```

**Your config** uses the implicit default scope everywhere — this is correct for a single coherent product.

---

### `library`

```js
library: { type: 'var', name: 'myAppContainer' }
```

**What it does:** Controls how the module container is exposed in the output bundle. Defaults to `var` (global variable on `window`).

**Options:**
- `{ type: 'var', name: 'myApp' }` → `window.myApp = ...` (default, works everywhere)
- `{ type: 'module' }` → ES module export (needs `experiments.outputModule: true`)
- `{ type: 'commonjs' }` → for Node.js SSR setups
- `{ type: 'system' }` → for SystemJS-based MFE architectures

**Your config doesn't set this** — fine, it defaults to `var` which is correct for browser environments.

---

### `publicPath`

```js
output: { publicPath: 'auto' }  // or 'https://cdn.yourapp.com/loans/'
```

**What it does (in `output`, not inside ModuleFederationPlugin):** Tells Webpack the base URL prefix for all dynamic chunk URLs. When a remote loads async chunks, Webpack prepends `publicPath` to compute the full URL.

**`auto`:** Webpack infers the `publicPath` from the URL where `remoteEntry.js` was loaded. This works well if your chunks live next to your `remoteEntry.js`.

**Hardcoded URL:** Necessary if your assets are on a CDN with a different origin than your HTML.

**Common mistake:** Leaving `publicPath` as `undefined` in a remote app. Webpack defaults to `''` (relative), which breaks when the remote's chunks are loaded from a different origin than the host's page.

---

## Part 3 — Review of your specific configurations

Let me walk through each file and flag the issues:---

## Part 4 — The corrected, production-grade configuration

Here's what each config should look like:

```js
// ─── shared/federation.config.js (single source of truth) ─────────────────
// Extract shared config to avoid copy-pasting across all apps
const deps = require('./package.json').dependencies;

const sharedDeps = {
  ...deps,
  react: {
    singleton: true,
    requiredVersion: deps.react,    // e.g. "^18.3.1"
    eager: false,
    strictVersion: true,            // production: hard error on mismatch
  },
  "react-dom": {
    singleton: true,
    requiredVersion: deps["react-dom"],
    eager: false,
    strictVersion: true,
  },
  "@sentry/react":    { singleton: true, requiredVersion: deps["@sentry/react"],    eager: false },
  "@sentry/browser":  { singleton: true, requiredVersion: deps["@sentry/browser"],  eager: false },
  "@sentry/core":     { singleton: true, requiredVersion: deps["@sentry/core"],     eager: false },
  "@sentry/tracing":  { singleton: true, requiredVersion: deps["@sentry/tracing"],  eager: false },
};

module.exports = sharedDeps;
```

```js
// ─── Host app: webpack.config.js ─────────────────────────────────────────
const { ModuleFederationPlugin } = require('webpack').container;
const sharedDeps = require('./shared/federation.config');

module.exports = {
  output: {
    publicPath: 'auto',   // or absolute CDN URL in prod
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      // Host doesn't expose anything (it's the shell)
      // It declares where remotes live:
      remotes: {
        loans:            'loans@https://loans.yourapp.com/remoteEntry.js',
        counterpartyCheck:'counterpartyCheck@https://counter.yourapp.com/remoteEntry.js',
      },
      shared: sharedDeps,
    }),
  ],
};
```

```js
// ─── mf-loans: webpack.config.js ─────────────────────────────────────────
new ModuleFederationPlugin({
  name: 'loans',
  filename: 'remoteEntry.js',
  exposes: {
    './App':     './src/App',
    './LoanList':'./src/components/LoanList',  // expose granularly, not barrel
  },
  shared: sharedDeps,
}),
```

```js
// ─── mf-counter: webpack.config.js ───────────────────────────────────────
new ModuleFederationPlugin({
  name: 'counterpartyCheck',        // must match host's remotes key
  filename: 'remoteEntry.js',       // ← was remoteEntry-is (typo)
  exposes: {
    './App': './src/App',
  },
  // ← removed: remotes: { host: ... } — remotes should not depend on the host
  shared: sharedDeps,
}),
```

```js
// ─── src/index.js (all apps — the async boundary) ────────────────────────
// THIS FILE MUST STAY TINY. Do not import React here.
import('./bootstrap');

// ─── src/bootstrap.js ─────────────────────────────────────────────────────
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```

---

## Part 5 — Enterprise-level best practices

**1. Version governance:** Keep all MFEs on the same major version of shared singletons. Use a monorepo or a shared `package.json` baseline. Automate alerts when a team upgrades React without coordinating.

**2. Dynamic remote URLs:** Never hard-code remote URLs in `webpack.config.js` for production. Serve a `mfe-manifest.json` from your API gateway that maps remote names to their current CDN URLs. Load it before bootstrapping.

**3. Error boundaries around remote components:** Always wrap remote-loaded components in React `<ErrorBoundary>`. If a remote's chunk fails to load (network error, bad deploy), you want graceful degradation — not a white screen.

**4. Type safety:** Use `@module-federation/typescript` or manually publish `.d.ts` files alongside your remotes so consumers get type checking across MFE boundaries.

**5. Shared scope contamination:** Only add a package to `shared` if it truly needs to be deduplicated. Adding every package from `...deps` (as your config does) registers hundreds of modules in the shared scope, slowing down initialization. Be selective — share only singletons and large libraries.

**6. `...deps` spread (your config):** This is a common anti-pattern. `...deps` shares literally every dependency in your `package.json`. Instead, explicitly list only what matters:
```js
// ✗ bad — shares lodash, axios, date-fns, and 50 other libs unnecessarily
shared: { ...deps, react: { singleton: true } }

// ✓ good — only share what MUST be deduplicated
shared: {
  react:      { singleton: true, requiredVersion: deps.react },
  'react-dom': { singleton: true, requiredVersion: deps['react-dom'] },
  'react-router-dom': { singleton: true, requiredVersion: deps['react-router-dom'] },
}
```

**7. CI version enforcement:** Add a script to your CI that reads all MFE `package.json` files and verifies `react` versions are compatible before allowing a deploy.

The biggest conceptual shift: **Module Federation is a runtime system, not a build-time one.** The bugs it introduces are invisible during `npm run build` — they only surface when apps load together in a browser. That's why the shared scope negotiation rules matter so much, and why version governance across teams is the real engineering challenge.
