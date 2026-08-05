import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()
export const basicsABLINK = [
  {
    id: 'circulation',
    title: intl.formatMessage({
      id: 'eightD.liuzhuanjindu',
      defaultMessage: intl.formatMessage({ id: 'eightD.liuzhuanjindu', defaultMessage: '流转进度' }),
    }),
  },
  {
    id: 'basis',
    title: intl.formatMessage({
      id: 'eightD.jichuxinxi',
      defaultMessage: intl.formatMessage({ id: 'eightD.jichuxinxi', defaultMessage: '基础信息' }),
    }),
  },
  {
    id: 'problem',
    title: intl.formatMessage({
      id: 'eightD.wentimiaoshu',
      defaultMessage: intl.formatMessage({ id: 'eightD.wentimiaoshu', defaultMessage: '问题描述' }),
    }),
  },
  {
    id: 'attachment',
    title: intl.formatMessage({
      id: 'eightD.fujian',
      defaultMessage: intl.formatMessage({ id: 'eightD.fujian', defaultMessage: '附件' }),
    }),
  },
  {
    id: 'group',
    title: intl.formatMessage({
      id: 'eightD.xiaozuchengyuan',
      defaultMessage: intl.formatMessage({ id: 'eightD.xiaozuchengyuan', defaultMessage: '小组成员' }),
    }),
  },
  {
    id: 'temporary',
    title: intl.formatMessage({
      id: 'eightD.linshiezhicuoshi',
      defaultMessage: intl.formatMessage({ id: 'eightD.linshiezhicuoshi', defaultMessage: '临时遏制措施' }),
    }),
  },
  {
    id: 'atAll',
    title: intl.formatMessage({
      id: 'eightD.genbenyuanyin',
      defaultMessage: intl.formatMessage({ id: 'eightD.genbenyuanyin', defaultMessage: '根本原因' }),
    }),
  },
]
export const basicsPcaABLINK = [
  {
    id: 'permanent',
    title: intl.formatMessage({
      id: 'eightD.yongjiujiuzhengcuoshi',
      defaultMessage: intl.formatMessage({ id: 'eightD.yongjiujiuzhengcuoshi', defaultMessage: '永久纠正措施' }),
    }),
  },
  {
    id: 'permanentCode',
    title: intl.formatMessage({
      id: 'eightD.yongjiujiuzhengcuoshiyanzheng',
      defaultMessage: intl.formatMessage({
        id: 'eightD.yongjiujiuzhengcuoshiyanzheng',
        defaultMessage: '永久纠正措施验证',
      }),
    }),
  },
  {
    id: 'prevent',
    title: intl.formatMessage({
      id: 'eightD.yufang',
      defaultMessage: intl.formatMessage({ id: 'eightD.yufang', defaultMessage: '预防' }),
    }),
  },
  {
    id: 'confirmation',
    title: intl.formatMessage({
      id: 'eightD.xiaoguoqueren',
      defaultMessage: intl.formatMessage({ id: 'eightD.xiaoguoqueren', defaultMessage: '效果确认' }),
    }),
  },
]
