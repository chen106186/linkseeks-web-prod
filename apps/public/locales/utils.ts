export const mergeClassObj = (target, proto) => {
  Object.keys(proto)
    .filter((v) => v !== 'constructor')
    .forEach((v) => {
      target[v] = proto[v]
    })
  Object.getOwnPropertyNames(proto.__proto__)
    .filter((v) => v !== 'constructor')
    .forEach((v) => {
      target[v] = proto[v]
    })
}
