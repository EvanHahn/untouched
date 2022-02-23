untouched
=========

Get pristine copies of built-in objects (like `Array` or `JSON`), even if they've been modified. This is generally for library authors who find themselves in monkey-patched browser environments.

*Currently only made for browsers. Feel free to submit a Node patch with the `vm` module!*

To use with Browserify or Webpack:

```js
var untouched = require('untouched')

var myUntouched = untouched()
var untouchedJson = myUntouched('json')
```

You can also include the script tag on the page (grab it from `src/untouched.js`):

```html
<script src="untouched.js"></script>
<script>
var myUntouched = untouched()
var untouchedJson = myUntouched('json')
</script>
```

Here's an example:

```js
// Let's say that someone has messed with the Array prototype.
// If you try to use it, you're screwed!
Array.prototype.map = function () {
  return 'this no longer works'
}

// This will return 'this no longer works'!
var arr = [1, 2, 3]
arr.map(function (n) {
  return n * n
})

// With untouched, you can get around this problem.
// This returns what you expect!
var myUntouched = untouched()
var untouchedArr = new myUntouched('Array')(1, 2, 3)
untouchedArr.map(function (n) {
  return n * n
})

// You can use it for things other than Array, too.
var untouchedJson = myUntouched('JSON')
untouchedJson.stringify({ hi: 5 })
```

We accomplish this by creating a hidden `<iframe>` and pulling variables out of it. You can remove the iframe whenever you're done with it:

```js
myUntouched.destroy()
```
