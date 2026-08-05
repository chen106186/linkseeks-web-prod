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
  const res: IOption[] = []
  for (let i = start; i < end; i++) {
    const data: IOption = {
      label: i,
      value: i,
    }
    res.push(data)
  }
  return res
}

// 内容管理 - 广告栏目
const ADVERTISE_WEB_COLUMN_TYPE = {
  '1': '会员首页-活动广告',
  // '2': '会员首页-活动广告2',
  // '3': '会员首页-活动广告3',
  // '4': '企业采购首页--轮播广告',
  // '5': '企业采购首页--顶部广告栏',
  // '6': '企业门户首页--轮播广告',
  // '7': '采购商机页--右侧广告栏',
  // '8': '渠道服务首页--轮播广告',
  // '9': '物流服务首页--轮播广告',
  // '10': '加工服务首页--轮播广告',
}

const ADVERTISE_APP_COLUMN_TYPE = {
  '51': '找店铺--广告',
  '52': '人气店铺--广告',
  '53': '商品询价--广告',
  '54': '未开通电子签章推广页--广告',
  '55': '授信申请推广页广告',
}

// 内容管理 - 公告栏目
const ANNOUNCE_COLUMN_TYPE = {
  '1': '会员首页公告',
  '2': '注册须知',
  '3': '入库须知',
  '4': '会员服务协议',
  '5': '商城账号注销协议',
  '6': '隐私政策',
}

// 内容管理 - 图片管理 - 使用场景
const SCENE = {
  '1': 'WEB',
  '2': 'APP',
}

// 内容管理 - 图片管理 - 所在位置
const POSITION = {
  '1': 'WEB登录页面',
  '2': '平台后台登录页面',
  '3': 'APP引导页',
  '4': 'APP启动页',
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
