/* eslint-disable @typescript-eslint/no-unused-vars */

import path from 'path'
import path from 'path'
import fs from 'fs'
export default function hello() {
  return 'Hello World';
}

// prefer-const
let x = 200;

// unused disable directive
// eslint-disable-next-line eqeqeq
if (x === 200) {
  console.log('hello');
}

function getJsx() {
  return <a href={'unnecessary curly bracket'}>{'More unnecessary curlies'}</a>;
}

// @typescript-eslint/consistent-type-definitions

// @typescript-eslint/consistent-type-definitions
// prefer interface over type

type MyType = { a: string; b: number };

// should be ok
interface MyOtherType {
  a: string;
  b: number;
}

// should be ok
function inlineObjectType(options: { a: string; b: number }) {}

// react/self-closing-comp

// error, we could use self closing
const gretter1 = <Greeter></Greeter>;

// this should be fine
const greeter2 = <Greeter />;

// this should also be fine
const greeter3 = <Greeter>Hello World</Greeter>;

/* eslint-enable @typescript-eslint/no-unused-vars */

try {
  // something
} catch (_) {
  // `_` should trigger eslint
}

// unused var
let y = 'abc';

function someFunction(
  unusedArg: string,
  usedArg: string,
  anotherUnused: number,
  _unused: any,
) {
  console.log(usedArg);
  // unusedArg should be fine
  // anotherUnused should cause an error
  // the final `_unused` should also be fine
}

/* eslint-disable @typescript-eslint/no-unused-vars */


someFunction('a', 'b', 6);

const greeting = 'Hello';

function Greeter(props: React.PropsWithChildren) {
  // testing that using a variable in jsx prevents no-unused-vars
  return <p>{greeting}, Brian!</p>;
}

// no-restricted-globals
Buffer.from('hello');

// simple-import-sort/exports
export { someFunction, Greeter}