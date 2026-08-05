import { ExpertTypeMap, SpecialityTypeMap } from '@/constants/procurement'
import { formatTimeString } from '@/utils'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()
/** 编辑组件条件 转换地区字段函数
 * @type: submit(提交给后台转换) render(编辑的时候前端回显)
 */
type IType = 'submit' | 'render'
export const transformAreaField = (value, type: IType) => {
  if (type === 'submit') {
    if (value?.excludeArea.length) {
      value.excludeProvinceCode = value.excludeArea[0].provinceCode || null
      value.excludeProvinceName = value.excludeArea[0].province || null
      value.excludeCityCode = value.excludeArea[0].cityCode || null
      value.excludeCityName = value.excludeArea[0].city || null
      value.excludeAreaCode = value.excludeArea[0].areaCode || null
      value.excludeAreaName = value.excludeArea[0].area || null
    }
    if (value?.needArea.length) {
      value.provinceCode = value.needArea[0].provinceCode || null
      value.provinceName = value.needArea[0].province || null
      value.cityCode = value.needArea[0].cityCode || null
      value.cityName = value.needArea[0].city || null
      value.areaCode = value.needArea[0].areaCode || null
      value.areaName = value.needArea[0].area || null
    }
  } else if (type === 'render') {
    value.expertExtractQueryList = value.expertExtractQueryList.map((item) => ({
      ...item,
      needArea: [
        {
          provinceCode: item.provinceCode,
          province: item.provinceName,
          cityCode: item.cityCode,
          city: item.cityName,
          areaCode: item.areaCode,
          area: item.areaName,
        },
      ],
      excludeArea: [
        {
          provinceCode: item.excludeProvinceCode,
          province: item.excludeProvinceName,
          cityCode: item.excludeCityCode,
          city: item.excludeCityName,
          areaCode: item.excludeAreaCode,
          area: item.excludeAreaName,
        },
      ],
    }))
  }
  console.log(value, 'transform')
  return value
}

/** 条件抽取，选择专家，字段组合嵌套转换 */
export const transformSelectExpertField = (value) => {
  if (value?.length) {
    return value.map((item) => ({
      expert: { ...item },
      source: 2,
      status: 1,
    }))
  } else {
    return []
  }
}

/** 选择商品和会员弹框的列 */
export const columnsSetMember: any[] = [
  {
    title: 'ID',
    dataIndex: 'memberId',
    align: 'center',
    key: 'memberId',
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.huiyuanmingcheng' }),
    dataIndex: 'name',
    align: 'center',
    key: 'name',
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.huiyuanleixing' }),
    dataIndex: 'memberTypeName',
    align: 'center',
    key: 'memberTypeName',
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.huiyuanjuese' }),
    dataIndex: 'roleName',
    align: 'center',
    key: 'roleName',
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.huiyuandengji' }),
    dataIndex: 'levelTag',
    align: 'center',
    key: 'levelTag',
  },
]

/** 初始抽取条件表格数据 */
export const initConditionData: any[] = [
  {
    currentIndex: 0,
    type: 1,
    speciality: null,
    qualification: null,
    title: null,
    years: null,
    trade: null,
    provinceName: null,
    needArea: [{ provinceCode: null, province: null, cityCode: null, city: null, areaCode: null, area: null }],
    excludeArea: [{ provinceCode: null, province: null, cityCode: null, city: null, areaCode: null, area: null }],
    unit: null,
    count: null,
  },
  {
    currentIndex: 1,
    type: 2,
    speciality: null,
    qualification: null,
    title: null,
    years: null,
    trade: null,
    provinceName: null,
    needArea: [{ provinceCode: null, province: null, cityCode: null, city: null, areaCode: null, area: null }],
    excludeArea: [{ provinceCode: null, province: null, cityCode: null, city: null, areaCode: null, area: null }],
    unit: null,
    count: null,
  },
  {
    currentIndex: 2,
    type: 3,
    speciality: null,
    qualification: null,
    title: null,
    years: null,
    trade: null,
    provinceName: null,
    needArea: [{ provinceCode: null, province: null, cityCode: null, city: null, areaCode: null, area: null }],
    excludeArea: [{ provinceCode: null, province: null, cityCode: null, city: null, areaCode: null, area: null }],
    unit: null,
    count: null,
  },
  {
    currentIndex: 3,
    type: 4,
    speciality: null,
    qualification: null,
    title: null,
    years: null,
    trade: null,
    provinceName: null,
    needArea: [{ provinceCode: null, province: null, cityCode: null, city: null, areaCode: null, area: null }],
    excludeArea: [{ provinceCode: null, province: null, cityCode: null, city: null, areaCode: null, area: null }],
    unit: null,
    count: null,
  },
]

/** 组件条件列表 @又名组建条件 */
export const buildColumns: any[] = [
  {
    dataIndex: 'id',
    title: intl.formatMessage({ id: 'table.purchase.xuhao' }),
    align: 'center',
    render: (t, r, i) => ++i,
  },
  {
    dataIndex: 'currentIndex',
    title: intl.formatMessage({ id: 'table.purchase.suoyin' }),
    align: 'center',
    key: 'currentIndex',
    className: 'commonHide',
  },
  {
    dataIndex: 'type',
    align: 'center',
    title: intl.formatMessage({ id: 'table.purchase.zhuanjialeixing' }),
    key: 'type',
    render: (t, r) => ExpertTypeMap[t],
  },
  {
    dataIndex: 'speciality',
    title: intl.formatMessage({ id: 'table.purchase.zhuanjiazhuanyelei' }),
    align: 'center',
    key: 'speciality',
    render: (t, r) => SpecialityTypeMap[t],
  },
  {
    dataIndex: 'qualification',
    title: intl.formatMessage({ id: 'table.purchase.zhuanjiazigezheng' }),
    align: 'center',
    key: 'qualification',
  },
  {
    dataIndex: 'title',
    title: intl.formatMessage({ id: 'table.purchase.zhuanjiazhuanyezhi' }),
    align: 'center',
    key: 'title',
  },
  {
    dataIndex: 'years',
    title: intl.formatMessage({ id: 'table.purchase.congshinianxian' }),
    align: 'center',
    key: 'years',
  },
  {
    dataIndex: 'trade',
    title: intl.formatMessage({ id: 'table.purchase.suoshuhangye' }),
    align: 'center',
    key: 'trade',
  },
  // {
  //   dataIndex: 'needArea',
  //   title: '要求地区地址数组（不显示）',
  //   align: 'center',
  //   key: 'needArea',
  //   className: 'commonHide'
  // },
  {
    dataIndex: 'provinceName',
    title: intl.formatMessage({ id: 'table.purchase.yaoqiudiqu' }),
    align: 'center',
    key: 'provinceName',
  },
  // {
  //   dataIndex: 'excludeProivce',
  //   title: '排除地区地址数组（不显示）',
  //   align: 'center',
  //   key: 'excludeArea',
  //   className: 'commonHide'
  // },
  {
    dataIndex: 'excludeProvinceName',
    title: intl.formatMessage({ id: 'table.purchase.paichudiqu' }),
    align: 'center',
    key: 'excludeProvinceName',
  },
  {
    dataIndex: 'unit',
    title: intl.formatMessage({ id: 'table.purchase.gongzuodanwei' }),
    align: 'center',
    key: 'unit',
  },
  {
    dataIndex: 'count',
    title: intl.formatMessage({ id: 'table.purchase.chouqurenshu' }),
    align: 'center',
    key: 'count',
  },
]

/** 委员会成员 @又名专家抽取列表 */
export const expertColumns: any[] = [
  {
    dataIndex: 'id',
    title: intl.formatMessage({ id: 'table.purchase.pingbiaozhuanjiabian' }),
    align: 'center',
    key: 'id',
  },
  {
    dataIndex: ['expert', 'phone'],
    align: 'center',
    title: intl.formatMessage({ id: 'table.purchase.lianxidianhua' }),
    key: ['expert', 'phone'],
  },
  {
    dataIndex: ['expert', 'speciality'],
    title: intl.formatMessage({ id: 'table.purchase.zhuanjiazhuanyelei' }),
    align: 'center',
    key: ['expert', 'speciality'],
    render: (t, r) => SpecialityTypeMap[t],
  },
  {
    dataIndex: ['expert', 'qualification'],
    title: intl.formatMessage({ id: 'table.purchase.zhuanjiazigezheng' }),
    align: 'center',
    key: ['expert', 'qualification'],
  },
  {
    dataIndex: ['expert', 'title'],
    title: intl.formatMessage({ id: 'table.purchase.zhuanjiazhuanyezhi' }),
    align: 'center',
    key: ['expert', 'title'],
  },
  {
    dataIndex: ['expert', 'years'],
    title: intl.formatMessage({ id: 'table.purchase.congshinianxian' }),
    align: 'center',
    key: ['expert', 'years'],
  },
  {
    dataIndex: ['expert', 'trade'],
    title: intl.formatMessage({ id: 'table.purchase.suoshuhangye' }),
    align: 'center',
    key: ['expert', 'trade'],
  },
  {
    dataIndex: ['expert', 'provinceName'],
    title: intl.formatMessage({ id: 'table.purchase.diqu' }),
    align: 'center',
    key: ['expert', 'provinceName'],
  },
  {
    dataIndex: ['expert', 'unit'],
    title: intl.formatMessage({ id: 'table.purchase.gongzuodanwei' }),
    align: 'center',
    key: ['expert', 'unit'],
  },
  {
    dataIndex: ['expert', 'type'],
    align: 'center',
    title: intl.formatMessage({ id: 'table.purchase.zhuanjialeixing' }),
    key: ['expert', 'type'],
    render: (t, r) => ExpertTypeMap[t],
  },
  {
    dataIndex: 'source',
    title: intl.formatMessage({ id: 'table.purchase.laiyuan' }),
    align: 'center',
    key: 'source',
    // 1-系统抽取;2-人工抽取
    render: (t, r) =>
      t === 1
        ? intl.formatMessage({ id: 'table.purchase.xitongchouqu' })
        : intl.formatMessage({ id: 'table.purchase.rengongchouqu' }),
  },
  {
    dataIndex: 'status',
    title: intl.formatMessage({ id: 'table.purchase.zhuangtai' }),
    align: 'center',
    key: 'status',
    render: (t, r) => {
      // 状态:1-待发送;2-待确认;3-已确认;4-已拒绝;5-已评标;
      if (t === 1) return intl.formatMessage({ id: 'table.purchase.daifasong' })
      else if (t === 2) return intl.formatMessage({ id: 'table.purchase.daiqueren' })
      else if (t === 3) return intl.formatMessage({ id: 'table.purchase.yiqueren' })
      else if (t === 4) return intl.formatMessage({ id: 'table.purchase.yijujue' })
      else if (t === 5) return intl.formatMessage({ id: 'table.purchase.yipingbiao' })
    },
  },
]

/** 选择评标项目弹框列 */
export const selectItemColumns: any[] = [
  {
    title: intl.formatMessage({ id: 'table.purchase.xuhao' }),
    dataIndex: 'id',
    key: 'id',
    render: (t, r, i) => ++i,
  },

  {
    title: intl.formatMessage({ id: 'table.purchase.zhaobiaobianhao' }),
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.zhaobiaoxiangmu' }),
    dataIndex: 'projectName',
    key: 'projectName',
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.kaibiaoshijian' }),
    dataIndex: 'openTenderTime',
    key: 'openTenderTime',
    render: (text, record) => formatTimeString(text),
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.pingbiaokaishishi' }),
    dataIndex: 'evaluationStartTime',
    key: 'evaluationStartTime',
    render: (text, record) => formatTimeString(text),
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.pingbiaojiezhishi' }),
    dataIndex: 'evaluationEndTime',
    key: 'evaluationEndTime',
    render: (text, record) => formatTimeString(text),
  },
]

/** 选择评标专家弹框列 */
export const selectExpertColumns: any[] = [
  {
    dataIndex: 'id',
    title: intl.formatMessage({ id: 'table.purchase.xuhao' }),
    align: 'center',
    render: (t, r, i) => ++i,
  },
  {
    dataIndex: 'name',
    align: 'center',
    title: intl.formatMessage({ id: 'table.purchase.zhuanjiamingcheng' }),
    key: 'name',
  },
  {
    dataIndex: 'userOrgName',
    align: 'center',
    title: intl.formatMessage({ id: 'table.purchase.jigou' }),
    key: 'userOrgName',
  },
  {
    dataIndex: 'userJobTitle',
    align: 'center',
    title: intl.formatMessage({ id: 'table.purchase.zhiwei' }),
    key: 'userJobTitle',
  },
  {
    dataIndex: 'speciality',
    title: intl.formatMessage({ id: 'table.purchase.zhuanjiazhuanyelei' }),
    align: 'center',
    key: 'speciality',
    render: (t, r) => SpecialityTypeMap[t],
  },
  {
    dataIndex: 'qualification',
    title: intl.formatMessage({ id: 'table.purchase.zhuanjiazigezheng' }),
    align: 'center',
    key: 'qualification',
  },
  {
    dataIndex: 'title',
    align: 'center',
    title: intl.formatMessage({ id: 'table.purchase.zhuanjiazhicheng' }),
    key: 'title',
  },
  {
    dataIndex: 'years',
    title: intl.formatMessage({ id: 'table.purchase.congshinianxian' }),
    align: 'center',
    key: 'years',
  },
  {
    dataIndex: 'trade',
    title: intl.formatMessage({ id: 'table.purchase.suoshuhangye' }),
    align: 'center',
    key: 'trade',
  },
  {
    dataIndex: 'provinceName',
    title: intl.formatMessage({ id: 'table.purchase.suozaidiqu' }),
    align: 'center',
    key: 'provinceName',
  },
  {
    dataIndex: 'unit',
    title: intl.formatMessage({ id: 'table.purchase.gongzuodanwei' }),
    align: 'center',
    key: 'unit',
  },
  {
    dataIndex: 'type',
    align: 'center',
    title: intl.formatMessage({ id: 'table.purchase.zhuanjialeixing' }),
    key: 'type',
    render: (t, r) => ExpertTypeMap[t],
  },
  {
    dataIndex: 'createTime',
    align: 'center',
    title: intl.formatMessage({ id: 'table.purchase.jiaruriqi' }),
    key: 'createTime',
    render: (t, r) => formatTimeString(t),
  },
]
