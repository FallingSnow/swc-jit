# swc-jit
Use typescript, tsx/jsx, modules in node without having to transpile beforehand or use ts-node.

It even has source-map support.

## Usage
```
node --experimental-loader swc-jit index.ts
```

### Testing
```
node --experimental-loader ./index.mjs index.ts
```