// 颜色列表
const ColorMaps = {
  blue: ['#f0f7ff', '#dbebff', '#b3d2ff', '#8ab7ff', '#6198ff', '#3877ff', '#2558d9', '#153db3', '#0a268c', '#061866'],
  green: ['#daf2e7', '#93e6c0', '#68d9aa', '#41cc97', '#1fbf87', '#00b37a', '#008c65', '#00664d', '#004032', '#001a15'],
  orange: [
    '#fff9eb',
    '#ffecc2',
    '#ffdb99',
    '#ffc870',
    '#ffb347',
    '#ff991f',
    '#d9770f',
    '#b35804',
    '#8c3f00',
    '#662b00',
  ],
  red: ['#fff2f0', '#ffe0db', '#fab6af', '#ed8780', '#e05a55', '#d32f2f', '#ad1d22', '#871018', '#610710', '#3b040b'],
  violet: [
    '#e1ddeb',
    '#d4d1de',
    '#bdb6d1',
    '#988bc4',
    '#7465b8',
    '#5243aa',
    '#372d85',
    '#211b5e',
    '#100d38',
    '#040412',
  ],
  yellow: [
    '#fffaf0',
    '#fffaf0',
    '#fcf4e6',
    '#f0d7b4',
    '#e3b986',
    '#d69b5d',
    '#b07843',
    '#8a572d',
    '#633a1c',
    '#3d2211',
  ],
}

const generate = (color: string): string[] => {
  return ColorMaps[color]
}

/** ----------------- 主色定义 ---------------- */
const DESIGN_RED = 'red'
const DESIGN_GREEN = 'green'
const DESIGN_BLUE = 'blue'
const DESIGN_ORANGE = 'orange'
/** 紫色 */
const DESIGN_VIOLET = 'violet'
const DESIGN_YELLOW = 'yellow'

const colorMaps = {
  red: generate(DESIGN_RED),
  green: generate(DESIGN_GREEN),
  blue: generate(DESIGN_BLUE),
  orange: generate(DESIGN_ORANGE),
  violet: generate(DESIGN_VIOLET),
  yellow: generate(DESIGN_YELLOW),
  gray: [],
}

export const designColors = {
  DESIGN_RED,
  DESIGN_GREEN,
  DESIGN_BLUE,
  DESIGN_ORANGE,
  DESIGN_VIOLET,
  DESIGN_YELLOW,
}

export interface themeStyle {
  PRIMARY_COLOR: string
  SUB_PRIMARY_COLOR: string
}

/**
 * 通过该函数可以动态设置 组件的皮肤
 * 目前已实现更换主颜色
 */
export const setTheme = (style: themeStyle) => {
  COLOR_SYMBOL.PRIMARY_COLOR = style.PRIMARY_COLOR
  COLOR_SYMBOL.SUB_PRIMARY_COLOR = style.SUB_PRIMARY_COLOR
}

export const COLOR_SYMBOL = {
  PRIMARY_COLOR: DESIGN_GREEN,
  SUB_PRIMARY_COLOR: DESIGN_BLUE,
}

export type ColorMapTypes = typeof colorMaps

/**
 * 适配转化, 设计可能稍微对颜色会产生微调
 */
const adaptationTransform = (colors: ColorMapTypes): ColorMapTypes => {
  return colors
}

/**
 * 主色一般都为第6号颜色, 从1开始数
 */
export default adaptationTransform(colorMaps)
