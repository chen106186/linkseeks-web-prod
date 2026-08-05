const allToken = require('./yapiToken.json')

module.exports = Object.keys(allToken)
  .filter((v) => allToken[v].needUpdate)
  .map((key) => {
    console.log(`\n本次需要更新的服务有${key}`)
    return {
      name: key,
      ...allToken[key],
    }
  })
