describe('Untouched', function () {
  beforeEach(function () {
    this.untouched = untouched()

    this.originalArrayMap = Array.prototype.map
    this.originalJsonStringify = JSON.stringify

    Array.prototype.foo = function () {
      return 'boo'
    }
    Array.prototype.map = function () {
      return 'wow'
    }

    JSON.foo = 'dope'
    JSON.stringify = function () {
      return 'haha nope'
    }
  })

  afterEach(function () {
    this.untouched.destroy()

    delete Array.prototype.foo
    Array.prototype.map = this.originalArrayMap

    delete JSON.foo
    JSON.stringify = this.originalJsonStringify
  })

  it('returns a different Array object', function () {
    expect(this.untouched('Array')).not.toBe(Array)
  })

  it('returns a different JSON object', function () {
    expect(this.untouched('JSON')).not.toBe(JSON)
  })

  it('can make a new Array that works fine', function () {
    var UntouchedArray = this.untouched('Array')
    var arr = new UntouchedArray()

    expect(arr.length).toEqual(0)

    arr.push(1)
    arr.push(2)

    expect(arr.length).toEqual(2)
    expect(arr[0]).toEqual(1)
    expect(arr[1]).toEqual(2)
    expect(arr.join(' and ')).toEqual('1 and 2')
  })

  it('ignores methods added to Array.prototype', function () {
    expect([].foo()).toEqual('boo')

    var UntouchedArray = this.untouched('Array')
    expect(new UntouchedArray().foo).toBeUndefined()
  })

  it('uses Array methods that are not monkeypatched', function () {
    function square (n) {
      return n * n
    }

    expect([1, 2, 3].map(square)).toEqual('wow')

    var UntouchedArray = this.untouched('Array')
    var arr = new UntouchedArray(1, 2, 3)
    expect(arr.map(square)).toEqual([1, 4, 9])
  })
})
