void function () {
  function untouched () {
    var iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    document.body.appendChild(iframe)

    var result = function (value) {
      return iframe.contentWindow[value]
    }

    result.destroy = function () {
      document.body.removeChild(iframe)
    }

    return result
  }

  if (typeof module === 'undefined') {
    this.untouched = untouched
  } else {
    module.exports = untouched
  }
}()
