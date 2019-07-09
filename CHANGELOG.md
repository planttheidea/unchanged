# unchanged CHANGELOG

Yes, the irony is not lost on me. :)

## 2.2.0

- Fix issue where `getOwnPropertySymbols` was expected to always be supported when `Object.assign` was natively supported
- Greatly improve typings of handlers

## 2.1.0

- Add [not](README.md#not) and [notWith](README.md#notwith) methods
- Ensure that objects with custom prototypes always use the same creator

## 2.0.1

- Fix [#33](https://github.com/planttheidea/unchanged/issues/33) - ensure objects created with `Object.create(null)` do not error
- Switch from `babel-minify` to `terser` for minified build

## 2.0.0

Rewrite in TypeScript!

**BREAKING CHANGES**

- `transform` has changed to be `setWith`, and the signature has changed as well (see [the documentation](README.md#setWith) for details)

**NEW FEATURES**

- Added [`is`](README.md#is) method for assertion
- Added function-first `*With` methods corresponding to each existing method (see [the documentation](README.md#transform-methods) for details)
- TypeScript typings

**ADDITIONAL CHANGES**

- Faster `get`s, `set`s, `merge`s, and `remove`s
- Distinct `main`, `module`, and `browser` builds for better universality of consumption

## 1.5.2

- Fix `rollup` build setup with latest `curriable` and `pathington` setups

## 1.5.1

- Return support for `Symbol` keys when using `assign`, `merge`, `remove`, and `set`
- Add documentation for `has` method
- Improve speed of `add` by eliminating unneeded call to curried wrapper
- Improve speed of `merge` by eliminating unneeded extra cloning
- Improve speed of `remove` by eliminating unneeded iterations
- Allow cloning to work consistently even with data from across realms

## 1.5.0

- Add [`assign](README.md#assign) method

## 1.4.2

- Add `"sideEffects": false` for better tree-shaking in webpack

## 1.4.1

- Update to use `babel@7` (smaller build, slightly better performance)

## 1.4.0

- Add [`transform`](README.md#transform) function
- Remove use of native `Object.assign` in favor of local code (faster)

## 1.3.3

- Provide `Object.assign` fallback for IE support without polyfill
- Use internal `reduce` method for performance on non-standard objects

## 1.3.2

- Use direct assignment instead of `.push()` when cloning arrays, to prevent breakage when the array has a custom `push` method

## 1.3.1

- Remove benchmark files from published package

## 1.3.0

- Add [`call`](README.md#call) function

## 1.2.1

- Simplify code for `has`

## 1.2.0

- Add [`getOr`](README.md#getor) function

## 1.1.0

- Add `rollup` for building `dist` files
- Replace homegrown curry with `curriable`

## 1.0.7

- Improve speed of curried methods by removing unneeded `slice` calls and calling with initial `0` index

## 1.0.6

- Replace `map` with `slice` when shallow-cloning arrays (performance and footprint)

## 1.0.5

- Fix issue with using array keys when using `add` with nested arrays

## 1.0.4

- Ensure that the original object's prototype is retained on `merge` when it is not a standard object

## 1.0.3

- Use custom `splice` for `remove` instead of native (in case item is an extension of an `Array` and has messed with `splice`)

## 1.0.2

- Do not create a new object if the object type does not match what the key thinks it should be (causes invalid results for array-like objects)

## 1.0.1

- Remove duplicate call to `isCloneable` (performance improvement when cloning)

## 1.0.0

- Initial release
