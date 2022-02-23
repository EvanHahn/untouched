/* global untouched */

describe("Untouched", function () {
  /* eslint-disable no-extend-native */
  beforeEach(function () {
    this.untouched = untouched();

    this.originalArrayMap = Array.prototype.map;
    this.originalJsonStringify = JSON.stringify;

    Array.prototype.foo = function () {
      return "boo";
    };
    Array.prototype.map = function () {
      return "wow";
    };

    JSON.foo = "dope";
    JSON.stringify = function () {
      return "haha dope";
    };
  });

  afterEach(function () {
    this.untouched.destroy();

    delete Array.prototype.foo;
    Array.prototype.map = this.originalArrayMap;

    delete JSON.foo;
    JSON.stringify = this.originalJsonStringify;
  });
  /* eslint-enable no-extend-native */

  it("returns a different Array object", function () {
    expect(this.untouched("Array")).not.toBe(Array);
  });

  it("returns a different JSON object", function () {
    expect(this.untouched("JSON")).not.toBe(JSON);
  });

  it("can make a new Array that works fine", function () {
    var UntouchedArray = this.untouched("Array");
    var arr = new UntouchedArray();

    expect(arr.length).toEqual(0);

    arr.push(1);
    arr.push(2);

    expect(arr.length).toEqual(2);
    expect(arr[0]).toEqual(1);
    expect(arr[1]).toEqual(2);
    expect(arr.join(" and ")).toEqual("1 and 2");
  });

  it("ignores methods added to Array.prototype", function () {
    expect([].foo()).toEqual("boo");

    var UntouchedArray = this.untouched("Array");
    expect(new UntouchedArray().foo).toBeUndefined();
  });

  it("uses un-monkeypatched Array methods", function () {
    function square(n) {
      return n * n;
    }

    expect([1, 2, 3].map(square)).toEqual("wow");

    var UntouchedArray = this.untouched("Array");
    var arr = new UntouchedArray(1, 2, 3);
    expect(arr.map(square)).toEqual([1, 4, 9]);
  });

  it("can use the JSON object just fine", function () {
    var untouchedJson = this.untouched("JSON");

    expect(untouchedJson.parse("{}")).toEqual({});
    expect(untouchedJson.parse('{"hi": 5}')).toEqual({ hi: 5 });

    expect(untouchedJson.stringify({})).toEqual("{}");
    expect(untouchedJson.stringify({ hi: 5 })).toEqual('{"hi":5}');
  });

  it("ignores properties added to the JSON object", function () {
    expect(JSON.foo).toEqual("dope");

    expect(this.untouched("JSON").foo).toBeUndefined();
  });

  it("uses un-monkeypatched JSON methods", function () {
    expect(JSON.stringify({ hi: 5 })).toEqual("haha dope");

    expect(this.untouched("JSON").stringify({ hi: 5 })).toEqual('{"hi":5}');
  });
});
