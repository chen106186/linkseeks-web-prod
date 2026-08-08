import cssVars from 'css-vars-ponyfill'
import defaultStyle from '@linkseeks/ui/src/styles/theme/variables.less'

export type Theme = 'default' | 'dark' | 'red'

export const settingTheme = (theme: Theme = 'default') => {
  const getTheme = () => {
    switch (theme) {
      case 'default':
        return defaultStyle
      // case 'dark':
      //   return DarkTheme
      // case 'red':
      //   return Redtheme
    }
  }

  document.documentElement.setAttribute('data-theme', theme)
  cssVars({
    watch: true, // 当添加，删除或修改其<link>或<style>元素的禁用或href属性时，ponyfill将自行调用
    variables: getTheme() as any, // variables 自定义属性名/值对的集合
    onlyLegacy: false, // false  默认将css变量编译为浏览器识别的css样式  true 当浏览器不支持css变量的时候将css变量编译为识别的css
  })
}
