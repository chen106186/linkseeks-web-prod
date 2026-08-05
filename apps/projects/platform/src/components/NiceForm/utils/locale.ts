import { localesStorage } from '@linkseeks/storage'
import zh_CN from 'antd/es/locale/zh_CN'
import ko_KR from 'antd/es/locale/ko_KR'

const locale = localesStorage.getItem() || 'zh-CN'
/** 处理日期选择组件国际化问题 */
export const dateLocale = () => {
  switch (locale) {
    case 'zh-CN':
      return {
        lang: {
          ...zh_CN.DatePicker?.lang,
          shortWeekDays: ['一', '二', '三', '四', '五', '六', '日'],
          shortMonths: [
            '一月',
            '二月',
            '三月',
            '四月',
            '五月',
            '六月',
            '七月',
            '八月',
            '九月',
            '十月',
            '十一月',
            '十二月',
          ],
        },
      }
    case 'ko-KR':
      return {
        lang: ko_KR.DatePicker?.lang,
      }
    default:
      return {}
  }
}
