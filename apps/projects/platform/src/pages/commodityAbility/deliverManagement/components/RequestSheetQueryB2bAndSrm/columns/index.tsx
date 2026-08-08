import { getIntl } from '@linkseeks/i18n'
import { EditOutlined } from '@ant-design/icons'

const validatorNumber = (rule, value, callback) => {
  try {
    if (value === '' || value === void 0) {
      throw new Error(
        getIntl().formatMessage({ id: 'commodity.deliverManagement.qingshurushuliang', defaultMessage: '请输入数量' }),
      )
    }
    if (Number(value) <= 0) {
      throw new Error(
        getIntl().formatMessage({
          id: 'commodity.deliverManagement.shuliangbixudayu0',
          defaultMessage: '数量必须大于0',
        }),
      )
    }
    if (!/^\d+(\.\d{1,3})?$/.test(value)) {
      throw new Error(
        getIntl().formatMessage({
          id: 'commodity.deliverManagement.shuliangjinxiansanweixiaoshu',
          defaultMessage: '数量仅限三位小数',
        }),
      )
    }
    callback()
  } catch (error) {
    callback(error)
  }
}

// B2B供应会员列表列
export const supplierB2bColumns = [
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.huiyuanID', defaultMessage: '会员ID' }),
    dataIndex: 'memberId',
    align: 'center',
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.huiyuanmingcheng', defaultMessage: '会员名称' }),
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.huiyuanleixing', defaultMessage: '会员类型' }),
    dataIndex: 'memberTypeName',
    align: 'center',
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.huiyuanjuese', defaultMessage: '会员角色' }),
    dataIndex: 'roleName',
    align: 'center',
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.huiyuandengji', defaultMessage: '会员等级' }),
    dataIndex: 'levelTag',
    align: 'center',
  },
]

// SRM供应会员列表列
export const supplierSrmColumns = [
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.huiyuanID', defaultMessage: '会员ID' }),
    dataIndex: 'memberId',
    align: 'center',
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.huiyuanmingcheng', defaultMessage: '会员名称' }),
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: getIntl().formatMessage({
      id: 'commodity.deliverManagement.shengmingzhouqijieduan',
      defaultMessage: '生命周期阶段',
    }),
    dataIndex: 'lifeCycleStageName',
    align: 'center',
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.rukushijian', defaultMessage: '入库时间' }),
    dataIndex: 'depositTime',
    align: 'center',
  },
]

// 需求人列表
export const neederColumns = [
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.xuhao', defaultMessage: '序号' }),
    dataIndex: 'index',
    align: 'center',
    render: (value) => value + 1,
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.xingming', defaultMessage: '姓名' }),
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.shoujihao', defaultMessage: '手机号' }),
    dataIndex: 'phone',
    align: 'center',
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.suoshujigou', defaultMessage: '所属机构' }),
    dataIndex: 'orgName',
    align: 'center',
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.zhiwei', defaultMessage: '职位' }),
    dataIndex: 'jobTitle',
    align: 'center',
  },
]

// 送样商品列表
export const deliverShopColumns = [
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.shangpinID', defaultMessage: '商品ID' }),
    dataIndex: 'skuId',
    key: 'skuId',
    width: 150,
    editable: true,
    component: 'Input',
    editProps: {
      placeholder: getIntl().formatMessage({
        id: 'commodity.deliverManagement.qingshurushangpinid',
        defaultMessage: '请输入商品id',
      }),
    },
    rules: [
      {
        required: true,
        message: getIntl().formatMessage({
          id: 'commodity.deliverManagement.qingshurushangpinid',
          defaultMessage: '请输入商品id',
        }),
      },
      {
        max: 20,
        message: getIntl().formatMessage({
          id: 'commodity.deliverManagement.zuichang20zifuhuoshuzi',
          defaultMessage: '最长20字符或数字',
        }),
      },
    ],
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.shangpinmingcheng', defaultMessage: '商品名称' }),
    dataIndex: 'name',
    key: 'name',
    width: 150,
    editable: true,
    component: 'Input',
    editProps: {
      placeholder: getIntl().formatMessage({
        id: 'commodity.deliverManagement.qingshurushangpinmingcheng',
        defaultMessage: '请输入商品名称',
      }),
    },
    rules: [
      {
        required: true,
        message: getIntl().formatMessage({
          id: 'commodity.deliverManagement.qingshurushangpinmingcheng',
          defaultMessage: '请输入商品名称',
        }),
      },
      {
        max: 80,
        message: getIntl().formatMessage({
          id: 'commodity.deliverManagement.zuichang40gehanzihuozi',
          defaultMessage: '最长40个汉字或字符',
        }),
      },
    ],
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.pinlei', defaultMessage: '品类' }),
    dataIndex: 'category',
    key: 'category',
    width: 150,
    editable: true,
    component: 'Input',
    editProps: {
      placeholder: getIntl().formatMessage({
        id: 'commodity.deliverManagement.qingshurupinlei',
        defaultMessage: '请输入品类',
      }),
    },
    rules: [
      {
        required: true,
        message: getIntl().formatMessage({
          id: 'commodity.deliverManagement.qingshurupinlei',
          defaultMessage: '请输入品类',
        }),
      },
      {
        max: 40,
        message: getIntl().formatMessage({
          id: 'commodity.deliverManagement.zuichang20gehanzihuozi',
          defaultMessage: '最长20个汉字或字符',
        }),
      },
    ],
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.pinpai', defaultMessage: '品牌' }),
    dataIndex: 'brand',
    key: 'brand',
    width: 150,
    editable: true,
    component: 'Input',
    editProps: {
      placeholder: getIntl().formatMessage({
        id: 'commodity.deliverManagement.qingshurupinpai',
        defaultMessage: '请输入品牌',
      }),
    },
    rules: [
      {
        max: 40,
        message: getIntl().formatMessage({
          id: 'commodity.deliverManagement.zuichang20gehanzihuozi',
          defaultMessage: '最长20个汉字或字符',
        }),
      },
    ],
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.danwei', defaultMessage: '单位' }),
    dataIndex: 'unit',
    key: 'unit',
    width: 150,
    component: 'Select',
    editable: true,
    editProps: {
      defaultActiveFirstOption: false,
      filterOption: false,
      notFoundContent: null,
      showSearch: true,
      placeholder: getIntl().formatMessage({
        id: 'commodity.deliverManagement.qingxuanzedanwei',
        defaultMessage: '请选择单位',
      }),
    },
    format: (value, enums) => {
      const findVlue = enums?.find((item) => item.label === value)
      if (findVlue) {
        return findVlue.value
      }
      return value || ''
    },
    rules: [
      {
        required: true,
        message: getIntl().formatMessage({
          id: 'commodity.deliverManagement.qingxuanzedanwei',
          defaultMessage: '请选择单位',
        }),
      },
    ],
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.xuqiushuliang', defaultMessage: '需求数量' }),
    dataIndex: 'demandQuantity',
    key: 'demandQuantity',
    width: 120,
    editable: true,
    component: 'Input',
    editProps: {
      placeholder: getIntl().formatMessage({
        id: 'commodity.deliverManagement.qingshurushuliang',
        defaultMessage: '请输入数量',
      }),
      type: 'number',
    },
    rules: [
      {
        required: true,
        validator: validatorNumber,
      },
    ],
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.xuqiushijian', defaultMessage: '需求时间' }),
    dataIndex: 'demandTime',
    key: 'demandTime',
    width: 180,
    editable: true,
    component: 'DatePicker',
    editProps: {
      placeholder: getIntl().formatMessage({
        id: 'commodity.deliverManagement.qingxuanzexuqiushijian',
        defaultMessage: '请选择需求时间',
      }),
    },
    format: 'YYYY-MM-DD HH:mm',
    rules: [
      {
        required: true,
        message: getIntl().formatMessage({
          id: 'commodity.deliverManagement.qingxuanzexuqiushijian',
          defaultMessage: '请选择需求时间',
        }),
      },
    ],
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.xuqiuren', defaultMessage: '需求人' }),
    dataIndex: 'demandPerson',
    key: 'demandPerson',
    width: 200,
    editable: true,
    readOnly: false,
    component: 'CustomInput',
    editProps: {
      placeholder: getIntl().formatMessage({
        id: 'commodity.deliverManagement.qingxuanzexuqiuren',
        defaultMessage: '请选择需求人',
      }),
      prefix: <EditOutlined />,
      handleClick: true,
      readonlyInput: true,
    },
    rules: [
      {
        required: true,
        message: getIntl().formatMessage({
          id: 'commodity.deliverManagement.qingxuanzexuqiuren',
          defaultMessage: '请选择需求人',
        }),
      },
    ],
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.xuqiubumen', defaultMessage: '需求部门' }),
    dataIndex: 'demandDepartment',
    key: 'demandDepartment',
    width: 120,
    render: (value) => (value ? value : '--'),
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.fujian', defaultMessage: '附件' }),
    dataIndex: 'attachment',
    key: 'attachment',
    width: 150,
    component: 'File',
    editable: true,
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.caozuo', defaultMessage: '操作' }),
    dataIndex: 'operation',
    key: 'operation',
    width: 100,
    fixed: 'right',
    component: 'Button',
    editable: true,
    visible: true,
    editProps: {
      type: 'link',
      title: getIntl().formatMessage({ id: 'commodity.deliverManagement.shanchu', defaultMessage: '删除' }),
      disabled: false,
    },
  },
]
// 送样物料列表
export const deliverMaterialColumns = [
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.wuliaobianhao', defaultMessage: '物料编号' }),
    dataIndex: 'skuId',
    key: 'skuId',
    width: 150,
    editable: true,
    component: 'Input',
    editProps: {
      placeholder: getIntl().formatMessage({
        id: 'commodity.deliverManagement.qingshuruwuliaobianhao',
        defaultMessage: '请输入物料编号',
      }),
    },
    rules: [
      {
        required: true,
        message: getIntl().formatMessage({
          id: 'commodity.deliverManagement.qingshuruwuliaobianhao',
          defaultMessage: '请输入物料编号',
        }),
      },
      {
        max: 20,
        message: getIntl().formatMessage({
          id: 'commodity.deliverManagement.zuichang20zifuhuoshuzi',
          defaultMessage: '最长20字符或数字',
        }),
      },
    ],
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.wuliaomingcheng', defaultMessage: '物料名称' }),
    dataIndex: 'name',
    key: 'name',
    width: 150,
    editable: true,
    component: 'Input',
    editProps: {
      placeholder: getIntl().formatMessage({
        id: 'commodity.deliverManagement.qingshuruwuliaomingcheng',
        defaultMessage: '请输入物料名称',
      }),
    },
    rules: [
      {
        required: true,
        message: getIntl().formatMessage({
          id: 'commodity.deliverManagement.qingshuruwuliaomingcheng',
          defaultMessage: '请输入物料名称',
        }),
      },
      {
        max: 80,
        message: getIntl().formatMessage({
          id: 'commodity.deliverManagement.zuichang40gehanzihuozi',
          defaultMessage: '最长40个汉字或字符',
        }),
      },
    ],
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.guigexinghao', defaultMessage: '规格型号' }),
    dataIndex: 'spec',
    key: 'spec',
    width: 150,
    editable: true,
    component: 'Input',
    editProps: {
      placeholder: getIntl().formatMessage({
        id: 'commodity.deliverManagement.qingshuruguigexinghao',
        defaultMessage: '请输入规格型号',
      }),
    },
    rules: [
      {
        required: true,
        message: getIntl().formatMessage({
          id: 'commodity.deliverManagement.qingshuruguigexinghao',
          defaultMessage: '请输入规格型号',
        }),
      },
      {
        max: 40,
        message: getIntl().formatMessage({
          id: 'commodity.deliverManagement.zuichang20gehanzihuozi',
          defaultMessage: '最长20个汉字或字符',
        }),
      },
    ],
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.pinlei', defaultMessage: '品类' }),
    dataIndex: 'category',
    key: 'category',
    width: 150,
    editable: true,
    component: 'Input',
    editProps: {
      placeholder: getIntl().formatMessage({
        id: 'commodity.deliverManagement.qingshurupinlei',
        defaultMessage: '请输入品类',
      }),
    },
    rules: [
      {
        required: true,
        message: getIntl().formatMessage({
          id: 'commodity.deliverManagement.qingshurupinlei',
          defaultMessage: '请输入品类',
        }),
      },
      {
        max: 40,
        message: getIntl().formatMessage({
          id: 'commodity.deliverManagement.zuichang20gehanzihuozi',
          defaultMessage: '最长20个汉字或字符',
        }),
      },
    ],
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.pinpai', defaultMessage: '品牌' }),
    dataIndex: 'brand',
    key: 'brand',
    width: 150,
    editable: true,
    component: 'Input',
    editProps: {
      placeholder: getIntl().formatMessage({
        id: 'commodity.deliverManagement.qingshurupinpai',
        defaultMessage: '请输入品牌',
      }),
    },
    rules: [
      {
        max: 40,
        message: getIntl().formatMessage({
          id: 'commodity.deliverManagement.zuichang20gehanzihuozi',
          defaultMessage: '最长20个汉字或字符',
        }),
      },
    ],
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.danwei', defaultMessage: '单位' }),
    dataIndex: 'unit',
    key: 'unit',
    width: 150,
    component: 'Select',
    editable: true,
    editProps: {
      defaultActiveFirstOption: false,
      filterOption: false,
      notFoundContent: null,
      showSearch: true,
      placeholder: getIntl().formatMessage({
        id: 'commodity.deliverManagement.qingxuanzedanwei',
        defaultMessage: '请选择单位',
      }),
    },
    format: (value, enums) => {
      const findVlue = enums?.find((item) => item.label === value)
      if (findVlue) {
        return findVlue.value
      }
      return value || ''
    },
    rules: [
      {
        required: true,
        message: getIntl().formatMessage({
          id: 'commodity.deliverManagement.qingxuanzedanwei',
          defaultMessage: '请选择单位',
        }),
      },
    ],
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.xuqiushuliang', defaultMessage: '需求数量' }),
    dataIndex: 'demandQuantity',
    key: 'demandQuantity',
    width: 120,
    editable: true,
    component: 'Input',
    editProps: {
      placeholder: getIntl().formatMessage({
        id: 'commodity.deliverManagement.qingshurushuliang',
        defaultMessage: '请输入数量',
      }),
      type: 'number',
    },
    rules: [
      {
        required: true,
        validator: validatorNumber,
      },
    ],
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.xuqiushijian', defaultMessage: '需求时间' }),
    dataIndex: 'demandTime',
    key: 'demandTime',
    width: 180,
    editable: true,
    component: 'DatePicker',
    editProps: {
      placeholder: getIntl().formatMessage({
        id: 'commodity.deliverManagement.qingxuanzexuqiushijian',
        defaultMessage: '请选择需求时间',
      }),
    },
    format: 'YYYY-MM-DD HH:mm',
    rules: [
      {
        required: true,
        message: getIntl().formatMessage({
          id: 'commodity.deliverManagement.qingxuanzexuqiushijian',
          defaultMessage: '请选择需求时间',
        }),
      },
    ],
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.xuqiuren', defaultMessage: '需求人' }),
    dataIndex: 'demandPerson',
    key: 'demandPerson',
    width: 200,
    editable: true,
    readOnly: false,
    component: 'CustomInput',
    editProps: {
      placeholder: getIntl().formatMessage({
        id: 'commodity.deliverManagement.qingxuanzexuqiuren',
        defaultMessage: '请选择需求人',
      }),
      prefix: <EditOutlined />,
      handleClick: true,
      readonlyInput: true,
    },
    rules: [
      {
        required: true,
        message: getIntl().formatMessage({
          id: 'commodity.deliverManagement.qingxuanzexuqiuren',
          defaultMessage: '请选择需求人',
        }),
      },
    ],
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.xuqiubumen', defaultMessage: '需求部门' }),
    dataIndex: 'demandDepartment',
    key: 'demandDepartment',
    width: 120,
    render: (value) => (value ? value : '--'),
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.fujian', defaultMessage: '附件' }),
    dataIndex: 'attachment',
    key: 'attachment',
    width: 150,
    component: 'File',
    editable: true,
    editProps: {
      disabled: false,
    },
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.caozuo', defaultMessage: '操作' }),
    dataIndex: 'operation',
    key: 'operation',
    width: 100,
    fixed: 'right',
    component: 'Button',
    editable: true,
    visible: true,
    editProps: {
      type: 'link',
      title: getIntl().formatMessage({ id: 'commodity.deliverManagement.shanchu', defaultMessage: '删除' }),
      disabled: false,
    },
  },
]
