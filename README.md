## Setup Guide

The project relies on 3 environment variables as specified in `src/vite-env.d.ts`

```
  readonly VITE_GQL_TOKEN: string;
  readonly VITE_GQL_SCOPE: string;
  readonly VITE_GQL_ENDPOINT: string;
```

Which can be configured in a `.env` file at the project root, which should look something like

```
VITE_GQL_TOKEN=foo
VITE_GQL_SCOPE=bar
VITE_GQL_ENDPOINT=string
```
