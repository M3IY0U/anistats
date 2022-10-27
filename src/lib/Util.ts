export function groupBy<T>(arr: Array<T>, keyFunc: Function) {
  var r = {};
  arr.forEach(function (x) {
    var y = keyFunc(x);
    r[y] = (r[y] || []).concat(x);
  });
  return Object.keys(r).map(function (y) {
    return r[y];
  });
}
