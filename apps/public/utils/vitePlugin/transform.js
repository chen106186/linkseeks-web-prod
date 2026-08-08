const platformJson = require('./api-methods-platform.json')
const adminJson = require('./api-methods.json')
const fs = require('fs')

const diffJson = platformJson.filter((v) => adminJson.includes(v))

fs.writeFile('./diffJson', JSON.stringify(diffJson), (err) => {
  if (err) throw err
})
