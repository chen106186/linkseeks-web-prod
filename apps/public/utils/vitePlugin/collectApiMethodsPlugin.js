const { readFileSync, writeFileSync } = require('fs')
const path = require('path')
const { parse } = require('@babel/parser')
const traverse = require('@babel/traverse').default
function collectApiMethods() {
  return {
    name: 'collect-api-methods',
    transform(code, id) {
      // 仅处理 .ts, .tsx, .js 和 .jsx 文件
      if (!/\.(ts|tsx|js|jsx)$/.test(id)) return
      if (id.includes('node_modules')) return

      // 使用 Babel 解析器解析代码为 AST
      const ast = parse(code, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx'],
      })

      const usedMethods = new Set()
      // 使用 Babel traverse 遍历 AST
      traverse(ast, {
        ImportDeclaration({ node }) {
          if (node.source.value === '@apps/apis') {
            node.specifiers.forEach((specifier) => {
              if (specifier.imported) {
                usedMethods.add(specifier.imported.name)
              }
            })
          }
        },
      })

      // 定义输出文件路径
      const outputPath = path.resolve(__dirname, 'api-methods-platform.json')

      // 读取现有方法列表
      let existingMethods = []
      try {
        existingMethods = JSON.parse(readFileSync(outputPath, 'utf-8') || '[]')
      } catch {
        // 如果文件不存在或解析失败，继续处理
      }

      // 更新方法列表
      const updatedMethods = [...new Set([...existingMethods, ...Array.from(usedMethods)])]
      writeFileSync(outputPath, JSON.stringify(updatedMethods, null, 2), 'utf-8')
    },
  }
}

module.exports = collectApiMethods
