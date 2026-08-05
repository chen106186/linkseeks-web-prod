const { types } = require('./packages/scripts/cz-emoji-conventional/constant')

module.exports = {
  header: '# 瓴犀前端版本更新说明',
  types: Object.keys(types)
    .filter((key) => !types[key].hidden)
    .map((t) => ({
      type: t,
      section: types[t].description,
    })),
  skip: {},
}
