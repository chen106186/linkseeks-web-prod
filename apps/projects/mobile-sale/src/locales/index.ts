import zh_CN from './zh_CN'
// import en_US from "./en_US";
// import ko_KR from "./ko_KR";

export const localeResource: any = {
  'zh-CN': zh_CN,
  // "en-US": en_US,
  // "ko-KR": ko_KR,
}

/**
 *
 * 如果打包出来common.js 已经超过1MB了 先注释2个语言包 的引入 和 注释其他2个语言 在打包 体积会相对少一半
 * 目前现在打包三个语言包 主包的common.js 已经超过1MB了
 *
 * */

const LANGUAGE: any = 'zh-CN'
