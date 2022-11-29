/**
 * All polyfills to go here.
 * Created by Bhargav Butani on 10.07.2021.
 */
/* String polyfills */
if (!String.prototype.format) {
  String.prototype.format = function () {
    let args = arguments[0];
    return this.replace(/{(\d+)}/g, function (match, number) {
      return typeof args[number] != "undefined" ? args[number] : match;
    });
  };
}

if (!String.prototype.beginsWith) {
  String.prototype.beginsWith = function (string) {
    return this.indexOf(string) === 0;
  };
}

if (!String.prototype.contains) {
  String.prototype.contains = function (string) {
    return this.indexOf(string) > 0;
  };
}

/* Remove spaces from inside a string */
if (!String.prototype.removeSpaces) {
  String.prototype.removeSpaces = function () {
    return this.replace(/\s+/g, "");
  };
}
