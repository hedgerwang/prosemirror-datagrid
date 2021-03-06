# ProseMirror Data Grid module

- [DEMO](https://hedgerwang.github.io/prosemirror-datagrid/dist/demo.html)

This module defines a schema extension to support datagrid with virtual scrolling and editing support.

## Installation

1. git clone git@github.com:hedgerwang/prosemirror-datagrid.git
2. `npm install`

## Usage

**Development**

1. Run `npm run dev`
2. Oen browser at `http://localhost:9000`

**Production**

1. Run `npm run build` and build files at the directory `/dist`.
2. Open `./dist/demo.html` for local testing.

---

**All commands**

| Command              | Description                                                |
| -------------------- | ---------------------------------------------------------- |
| `npm run dev`        | Build app quickly in dev mode.                             |
| `npm run build`      | Build app quickly in production mode (codes are minified). |
| `npm run test`       | Run tests                                                  |
| `npm run lint`       | Run linter                                                 |
| `npm run lint --fix` | Run linter and fix issues                                  |
| `npm run tsc`        | Run TypeScript compiler                                    |
