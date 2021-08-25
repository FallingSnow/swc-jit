import assert from 'assert/strict';
import os from 'os';

function func(a: any, b: number) {
  assert.equal(a.length, b);
}

func(os.cpus(), os.cpus().length);