(function (win, doc) {
  'use strict';

  function DOM(elements) {

    if (!(this instanceof DOM))
      return new DOM(elements);

    this.element = doc.querySelectorAll(elements);
  }

  DOM.prototype.on = function on(event, callback) {
    this.element.forEach(function (el) {
      el.addEventListener(event, callback, false)
    })
  }

  DOM.prototype.get = function get(index) {
    if (!index)
      return this.element[0];
    return this.element[index];
  }

  DOM.prototype.off = function off(event, callback) {
    this.element.forEach(function (el) {
      el.removeEventListener(event, callback, false)
    })
  }

  DOM.prototype.forEach = function forEach(fn) {
    Array.prototype.forEach.call(this.element, fn)
  }

  DOM.prototype.map = function map(fn) {
    Array.prototype.map.call(this.element, fn)
  }

  DOM.prototype.filter = function filter(fn) {
    Array.prototype.filter.call(this.element, fn)
  }

  DOM.prototype.reduce = function reduce(fn) {
    Array.prototype.reduce.call(this.element, fn)
  }

  DOM.prototype.reduceRight = function reduceRight(fn) {
    Array.prototype.reduceRight.call(this.element, fn)
  }

  DOM.prototype.every = function every(fn) {
    Array.prototype.every.call(this.element, fn)
  }

  DOM.prototype.some = function some(fn) {
    Array.prototype.some.call(this.element, fn)
  }

  DOM.prototype.setData = function setData(data) {
    return (this.data = data)
  }

  DOM.prototype.getData = function getData() {
    return this.data
  }

  DOM.isArray = function isArray(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]'
  }

  DOM.isObject = function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
  }

  DOM.isFunction = function isFunction(fn) {
    return Object.prototype.toString.call(fn) === '[object Function]'
  }

  DOM.isNumber = function isNumber(number) {
    return Object.prototype.toString.call(number) === '[object Number]'
  }

  DOM.isString = function isString(string) {
    return Object.prototype.toString.call(string) === '[object String]'
  }

  DOM.isBoolean = function isBoolean(boolean) {
    return Object.prototype.toString.call(boolean) === '[object Boolean]'
  }

  DOM.isNull = function isNull(element) {
    return (
      Object.prototype.toString.call(element) === '[object Null]' ||
      Object.prototype.toString.call(element) === '[object Undefined]'
    )
  }

  win.DOM = DOM;

})(window, document)