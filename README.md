# Noteable App

## Installation
1. git clone git@github.com:hedgerwang/app-noteable.git
2. `yarn install` (or `npm install` for npm)

## Usage
**Development**

1. Run `yarn run dev`, this starts a watcher that continuously watch code changes and re-build files at the directory `/dist`.
2. From a separate terminal, run `yarn run server`, then open browser at `http://localhost:8000`


**Production**

1. Run `yarn run build` and build files at the directory `/dist`.
2. From a separate terminal, run `yarn run server`, then open browser at `http://localhost:8000`

---

**All commands**

Command | Description
--- | ---
`yarn run dev` | Build app quickly in dev mode.
`yarn run build` | Build app quickly in production mode (codes are minified).
`yarn run test` | Run tests
`yarn run lint` | Run linter
`yarn run lint --fix` | Run linter and fix issues
`yarn run tsc` | Run TypeScript compiler
`yarn run server` |  Run Dev server from localhost with HTTPS

Setup  HTTPS Server for Mac
1. install `mkcert`: `brew install mkcert`
2. create cert `mkcert localhost 127.0.0.1`
3. install cert `mkcert -install`
3. start server `node node_modules/http-server/bin/http-server dist -S -C localhost+1.pem -K localhost+1-key.pem`


**Note**: replace `yarn` with `npm` in `package.json` if you use npm.
