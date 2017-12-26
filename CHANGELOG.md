# unchanged CHANGELOG

Yes, the irony is not lost on me. :)

## 1.0.4

* Ensure that the original object's prototype is retained on `merge` when it is not a standard object

## 1.0.3

* Use custom `splice` for `remove` instead of native (in case item is an extension of an `Array` and has messed with `splice`)

## 1.0.2

* Do not create a new object if the object type does not match what the key thinks it should be (causes invalid results for array-like objects)

## 1.0.1

* Remove duplicate call to `isCloneable` (performance improvement when cloning)

## 1.0.0

* Initial release
