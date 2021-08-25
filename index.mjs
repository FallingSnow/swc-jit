import swc from '@swc/core';
import fs from 'fs';
import { extname } from 'path';

import sourceMapSupport from 'source-map-support';
sourceMapSupport.install({
  retrieveSourceMap: function (source) {
    if (source.endsWith('.ts')) {
      return {
        url: source,
        map: globalThis.__swc_loader_maps.get(source)
      };
    }
    return null;
  }
});

const INLINE_MAPS = false;
const SWC_OPTIONS = {
  "sourceMaps": true,
  "env": {
    "targets": {
      "node": process.version.substring(1)
    }
  },
  "jsc": {
    "parser": {
      "syntax": "typescript",
      "dynamicImport": true
    },
    "loose": true,
    "keepClassNames": true
  },
  "module": {
    "type": "es6",
    "lazy": "true",
    "noInterop": true
  }
};

globalThis.__swc_loader_maps = new Map();

export async function resolve(specifier, context, defaultResolve) {
  const { parentURL } = context;
  const ext = extname(specifier);
  const path = new URL(specifier, parentURL).href.replace('file://', '');
  
  // If there is no extension, check if a file with this name and .ts extension exists
  if (specifier.startsWith('.') && ext === '' && fs.existsSync(`${path}.ts`)) {
    specifier = `${specifier}.ts`;
  }

  // Defer to Node.js for all other specifiers.
  return defaultResolve(specifier, context, defaultResolve);
}

export function getFormat(url, context, defaultGetFormat) {
  // This loader assumes all .ts JavaScript is ES module code.
  if (url.endsWith('.ts')) {
    return {
      format: 'module'
    };
  }

  // Let Node.js handle all other URLs.
  return defaultGetFormat(url, context, defaultGetFormat);
}

export async function getSource(url, context, defaultGetSource) {
  // For JavaScript to be loaded via swc, we need to compile it and
  // return it.
  if (url.endsWith('.ts')) {
    let { code, map } = await swc.transformFile(url.substring(7), SWC_OPTIONS);

    // Remove the source code from the map. Makes it a little leaner.
    map = JSON.parse(map);
    delete map.sourcesContent;
    map = JSON.stringify(map);

    if (INLINE_MAPS) {
      const mapBase64 = Buffer.from(map).toString('base64');
      const mapLocation = `data:application/json;base64,${mapBase64}`;

      code = code + `\n//# sourceMappingURL=${mapLocation}`;
    } else {
      globalThis.__swc_loader_maps.set(url, map);
    }

    return { source: code };
  }

  // Let Node.js handle all other URLs.
  return defaultGetSource(url, context, defaultGetSource);
}
