const path = require('path')
const fs = require('fs')

const rootPath = process.cwd()
const assertsJSON = require('../assets/iconfont.json')
const fileAssertsJSON = require('../assets/file_iconfont.json')

const outPutPath = (p) => path.resolve(rootPath, 'src/icons', p)

function outputTemplate(content) {
  const pathReg = /<path[^>]*>(.*?)<\/path>/s
  const rectReg = /<rect[^>]*>(.*?)<\/rect>/s
  return `
  import React from 'react'
  import { IconBase, IconBaseProps } from '../iconBase'

  ${content.reduce((p, n) => {
    let svgContent = n.svg.match(pathReg)
    if (!svgContent) {
      svgContent = n.svg.match(rectReg)
    }
    p += `export const ${n.name
      .replace(/\s*/g, '')
      .replace(/\-/g, '')}Icon: React.FC<IconBaseProps> = (props) => <IconBase {...props}>
		<svg viewBox="0 0 24 24" width="1em" height="1em" focusable="false" fill="currentColor" aria-hidden="true">
    ${svgContent[0].replace('fill-rule', 'fillRule')}
		</svg>
		</IconBase>\n\n`
    return p
  }, '')}
  `
}
function transformSVG(json) {
  const output = {}

  output.count = json.icons_count
  output.icons = json.icons

  const sectionDirs = {}
  while (output.icons.length) {
    const item = output.icons.shift()

    if (sectionDirs[item.section]) {
      sectionDirs[item.section].push(item)
    } else {
      sectionDirs[item.section] = [item]
    }
  }
  return sectionDirs
}

function run() {
  const iconFiles = transformSVG(assertsJSON)
  const fileIconFiles = transformSVG(fileAssertsJSON)

  Object.keys(iconFiles).forEach((v) => {
    fs.writeFile(outPutPath(v + '.tsx'), outputTemplate(iconFiles[v]), function (err) {
      if (err) throw err
    })
  })
  Object.keys(fileIconFiles).forEach((v) => {
    fs.writeFile(outPutPath(v + '.tsx'), outputTemplate(fileIconFiles[v]), function (err) {
      if (err) throw err
    })
  })

  fs.writeFile(
    outPutPath('index.tsx'),
    Object.keys({ ...iconFiles, ...fileIconFiles }).reduce((p, n) => {
      p += `export * from "./${n}"\n`
      return p
    }, ''),
    function (err) {
      if (err) throw err
    },
  )
}

run()
