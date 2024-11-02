import untouched from "./untouched.js";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

window.runTests = () => {
  /* eslint-disable no-extend-native */
  Array.prototype.foo = () => "boo";
  Array.prototype.map = () => "wow";
  /* eslint-enable no-extend-native */

  assert([].foo() === "boo", "test extends Array to add `foo`");
  assert([].map() === "wow", "test extends Array to change `map``");

  const ut = untouched();

  assert(ut("Array") !== Array, "should return a different Array object");
  assert(ut("JSON") !== JSON, "should return a different JSON object");

  const UntouchedArray = ut("Array");
  const untouchedArray = new UntouchedArray();
  untouchedArray.push(1, 2, 3);
  assert(
    untouchedArray.foo === undefined,
    "should not have extra properties attached"
  );
  assert(
    untouchedArray.map((n) => n + 1).join() === "2,3,4",
    "should use an untouched Array map"
  );

  ut.destroy();
};
