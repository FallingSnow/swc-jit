# swc-jit
Use typescript in node without having to transpile beforehand or use ts-node.

It even has source-map support.

## Install
```
npm install swc-jit
```

## Usage
```
node --experimental-loader swc-jit --enable-source-maps index.ts
```

### Testing
```
node --experimental-loader ./index.mjs index.ts
```