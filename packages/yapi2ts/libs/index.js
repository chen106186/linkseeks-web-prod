'use strict'
Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })
var e = ((a) => (
    (a.GET = 'GET'),
    (a.POST = 'POST'),
    (a.PUT = 'PUT'),
    (a.DELETE = 'DELETE'),
    (a.HEAD = 'HEAD'),
    (a.OPTIONS = 'OPTIONS'),
    (a.PATCH = 'PATCH'),
    a
  ))(e || {}),
  f = ((a) => ((a.false = '0'), (a.true = '1'), a))(f || {}),
  c = ((a) => (
    (a.query = 'query'),
    (a.form = 'form'),
    (a.json = 'json'),
    (a.text = 'text'),
    (a.file = 'file'),
    (a.raw = 'raw'),
    (a.none = 'none'),
    a
  ))(c || {}),
  E = ((a) => ((a.text = 'text'), (a.file = 'file'), a))(E || {}),
  O = ((a) => ((a.json = 'json'), (a.text = 'text'), (a.xml = 'xml'), (a.raw = 'raw'), a))(O || {})
class s {
  constructor(t) {
    this.originalFileData = t
  }
  getOriginalFileData() {
    return this.originalFileData
  }
}
function m(a) {
  const t = { data: {}, fileData: {} }
  return (
    a != null &&
      (typeof a == 'object' && !Array.isArray(a)
        ? Object.keys(a).forEach((r) => {
            a[r] && a[r] instanceof s ? (t.fileData[r] = a[r].getOriginalFileData()) : (t.data[r] = a[r])
          })
        : (t.data = a)),
    t
  )
}
function x(a, t) {
  let r = a.path
  const { data: l, fileData: n } = m(t)
  return (
    Array.isArray(a.paramNames) &&
      a.paramNames.length > 0 &&
      l != null &&
      typeof l == 'object' &&
      !Array.isArray(l) &&
      Object.keys(l).forEach((i) => {
        a.paramNames.indexOf(i) >= 0 &&
          ((r = r.replace(new RegExp(`\\{${i}\\}`, 'g'), l[i]).replace(new RegExp(`/:${i}(?=/|$)`, 'g'), `/${l[i]}`)),
          delete l[i])
      }),
    { ...a, path: r, data: l, hasFileData: n && Object.keys(n).length > 0, fileData: n }
  )
}
exports.FileData = s
exports.Method = e
exports.RequestBodyType = c
exports.RequestFormItemType = E
exports.Required = f
exports.ResponseBodyType = O
exports.parseRequestData = m
exports.prepare = x
