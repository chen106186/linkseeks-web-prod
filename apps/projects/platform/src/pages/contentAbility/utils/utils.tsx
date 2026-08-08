import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

const tagColorStyle = {
  '1': { color: '#606266', background: '#F4F5F7' },
  '2': { color: '#00A98F', background: '#EBF7F2' },
  '3': { color: '#E63F3B', background: '#FFEBE6' },
}

// 设置Table 状态
const setFormStatus = (ctx, name: string, key: string, value: any) => {
  ctx.setFieldState(name, (state) => {
    // @ts-ignore
    state.props['x-component-props'][key] = value
  })
}

// 设置table DataSource
const setTableDataSource = (ctx, { dataSource, total }) => {
  ctx.setFieldState('table', (state) => {
    //@ts-ignore
    state.props['x-component-props']['loading'] = false
    //@ts-ignore
    state.props['x-component-props']['dataSource'] = dataSource

    if (state.props['x-component-props']['pagination']) {
      state.props['x-component-props']['pagination']['total'] = total
    }
  })
  ctx.setFieldState('pagination', (state) => {
    //@ts-ignore
    state.props['x-component-props']['total'] = total
  })
}

// 获取 table DataSource，只是把loading 跟获取数据集合在一起
const getTableDataSource = async (ctx, params, service) => {
  setFormStatus(ctx, 'table', 'loading', true)
  const res = await service(params)
  setTableDataSource(ctx, { dataSource: res.data, total: res.totalCount })
}

interface IOption {
  value: number | string
  label: number | string
}

const sortedList = (start, end) => {
  let res: IOption[] = []
  for (let i = start; i < end; i++) {
    let data: IOption = {
      label: i,
      value: i,
    }
    res.push(data)
  }
  return res
}

// 内容管理 - 广告栏目
const ADVERTISE_WEB_COLUMN_TYPE = {
  '4': translate('web.resource.system.caigoushouyelunbo'),
  '5': translate('web.resource.system.caigoushouyedingbu'),
  '7': translate('web.resource.system.caigoushangjiyouce'),
}

const ADVERTISE_APP_COLUMN_TYPE = {
  '51': translate('web.resource.system.zhaodianpu'),
  '52': translate('web.resource.system.renqidianpu'),
  '53': translate('web.resource.system.shangpinxunjia'),
  '54': translate('web.resource.system.weikaitongdianziqianzhang'),
  '55': translate('web.resource.system.shouquanshenqingtuiguang'),
}

// 内容管理 - 公告栏目
const ANNOUNCE_COLUMN_TYPE = {
  // '1': '会员首页公告',
  // '2': '注册须知',
  '3': translate('web.resource.system.rukuxuzhi'),
}

// 内容管理 - 图片管理 - 使用场景
const SCENE = {
  '1': 'WEB',
  '2': 'APP',
}

// 内容管理 - 图片管理 - 所在位置
const POSITION = {
  '1': translate('web.resource.system.dengluyemian'),
  '2': translate('web.resource.system.pingtaihoutaidenglu'),
  '3': translate('web.resource.system.appyindaoye'),
  '4': translate('web.resource.system.appqidongye'),
}
/**
 * 将字典转换成 {label: 'xx', value: 1}
 * @param maps
 */
const transfer2Options = (maps) => {
  const res = Object.keys(maps).map((item) => {
    return {
      label: maps[item],
      value: parseInt(item),
    }
  })
  return res
}

export {
  tagColorStyle,
  setFormStatus,
  setTableDataSource,
  getTableDataSource,
  sortedList,
  ADVERTISE_WEB_COLUMN_TYPE,
  ADVERTISE_APP_COLUMN_TYPE,
  // ADVERTISE_COLUMN_TYPE,
  ANNOUNCE_COLUMN_TYPE,
  transfer2Options,
  SCENE,
  POSITION,
}
