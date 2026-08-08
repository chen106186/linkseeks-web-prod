import type { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
import moment from 'moment'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { PATTERN_MAPS } from '@/constants/regExp'
import { supplierB2bColumns, supplierSrmColumns, neederColumns } from '../columns'
import styles from '../index.less'
import { dateLocale } from '@/components/NiceForm/utils/locale'

export const supplierSrmSchema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'Mega-Layout',
      properties: {
        memberName: {
          type: 'string',
          'x-component': 'Search',
          'x-mega-props': {},
          'x-component-props': {
            placeholder: getIntl().formatMessage({
              id: 'commodity.deliverManagement.qingshurugongyingshangmingcheng',
              defaultMessage: '请输入供应商名称',
            }),
            align: 'flex-start',
            advanced: 'false',
            tip: getIntl().formatMessage({
              id: 'commodity.deliverManagement.shurugongyingshangmingchengjin',
              defaultMessage: '输入供应商名称进行搜索',
            }),
          },
        },
      },
    },
  },
}
export const supplierB2bSchema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'Mega-Layout',
      properties: {
        memberName: {
          type: 'string',
          'x-component': 'Search',
          'x-mega-props': {},
          'x-component-props': {
            placeholder: getIntl().formatMessage({
              id: 'commodity.deliverManagement.qingshuruhuiyuanmingcheng',
              defaultMessage: '请输入会员名称',
            }),
            align: 'flex-start',
            advanced: 'false',
            tip: getIntl().formatMessage({
              id: 'commodity.deliverManagement.shuruhuiyuanmingchengjinhang',
              defaultMessage: '输入会员名称进行搜索',
            }),
          },
        },
      },
    },
  },
}

export const neederSchema: ISchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      'x-component': 'Search',
      'x-mega-props': {
        wrapperCol: 12,
      },
      'x-component-props': {
        placeholder: getIntl().formatMessage({ id: 'commodity.deliverManagement.xingming', defaultMessage: '姓名' }),
        align: 'flex-start',
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        grid: true,
        full: true,
        autoRow: true,
        columns: 3,
      },
      properties: {
        org: {
          type: 'string',
          'x-component-props': {
            placeholder: getIntl().formatMessage({
              id: 'commodity.deliverManagement.suoshujigou',
              defaultMessage: '所属机构',
            }),
            allowClear: true,
          },
        },
        jobTitle: {
          type: 'string',
          'x-component-props': {
            placeholder: getIntl().formatMessage({ id: 'commodity.deliverManagement.zhiwei', defaultMessage: '职位' }),
            allowClear: true,
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: getIntl().formatMessage({ id: 'commodity.deliverManagement.chaxun', defaultMessage: '查询' }),
          },
        },
      },
    },
  },
}

// 基本信息
const basicInfo = (roleType: number | string): ISchema => ({
  'x-index': 0,
  type: 'object',
  'x-component': 'MellowCard',
  'x-component-props': {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.jibenxinxi', defaultMessage: '基本信息' }),
    id: 'basicInfo',
  },
  properties: {
    baseInfo: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 6,
        wrapperCol: 16,
        labelAlign: 'left',
        grid: true,
        full: true,
        autoRow: true,
        columns: 2,
      },
      properties: {
        summary: {
          type: 'string',
          title: getIntl().formatMessage({
            id: 'commodity.deliverManagement.songyangxuqiudanzhaiyao',
            defaultMessage: '送样需求单摘要',
          }),
          'x-component-props': {
            placeholder: getIntl().formatMessage({
              id: 'commodity.deliverManagement.qingshuruzhaiyao',
              defaultMessage: '请输入摘要',
            }),
          },
          'x-rules': [
            {
              required: true,
              message: getIntl().formatMessage({
                id: 'commodity.deliverManagement.qingshuruzhaiyao',
                defaultMessage: '请输入摘要',
              }),
            },
            {
              limitByte: true,
              maxByte: 80,
            },
          ],
        },
        demandDate: {
          type: 'string',
          'x-component': 'date',
          title: getIntl().formatMessage({ id: 'commodity.deliverManagement.xuqiuriqi', defaultMessage: '需求日期' }),
          'x-component-props': {
            style: { width: 400 },
            locale: dateLocale(),
            placeholder: getIntl().formatMessage({
              id: 'commodity.deliverManagement.qingxuanzexuqiuriqi',
              defaultMessage: '请选择需求日期',
            }),
          },
          'x-rules': [
            {
              required: true,
              message: getIntl().formatMessage({
                id: 'commodity.deliverManagement.qingxuanzexuqiuriqi',
                defaultMessage: '请选择需求日期',
              }),
            },
          ],
          default: moment(),
        },
        type: {
          type: 'string',
          title: getIntl().formatMessage({
            id: 'commodity.deliverManagement.songyangleixing',
            defaultMessage: '送样类型',
          }),
          enum: [],
          default: 1,
          required: true,
          'x-component-props': {
            placeholder: getIntl().formatMessage({
              id: 'commodity.deliverManagement.qingxuanzesongyangleixing',
              defaultMessage: '请选择送样类型',
            }),
            showArrow: true,
            allowClear: true,
            defaultActiveFirstOption: false,
            filterOption: false,
          },
        },
        supplierMember: {
          type: 'string',
          title: getIntl().formatMessage({ id: 'commodity.deliverManagement.gongyingshang', defaultMessage: '供应商' }),
          'x-component': 'DrawerSearchTable',
          'x-component-props': {
            title: ' ',
            modalProps: {
              title: getIntl().formatMessage({
                id: 'commodity.deliverManagement.xuanzegongyingshang',
                defaultMessage: '选择供应商',
              }),
              keepAlive: false,
            },
            columns: roleType == 2 ? supplierB2bColumns : supplierSrmColumns,
            fetchTableData: '{{fetchSupplierList}}',
            formilyProps: {
              ctx: {
                schema: roleType == 2 ? supplierB2bSchema : supplierSrmSchema,
              },
            },
            tableProps: {
              rowKey: roleType == 2 ? 'id' : 'validateId',
              lableKey: 'name',
            },
            layoutClassName: styles.resetCustomRelevance,
            cancelTip: getIntl().formatMessage({
              id: 'commodity.deliverManagement.weixuanzegongyingshang',
              defaultMessage: '未选择供应商',
            }),
          },
          'x-mega-props': {
            wrapperCol: 16,
          },
          'x-rules': [
            {
              required: true,
              message: getIntl().formatMessage({
                id: 'commodity.deliverManagement.qingxuanzegongyingshang',
                defaultMessage: '请选择供应商',
              }),
            },
          ],
        },
        emergencyLevel: {
          title: getIntl().formatMessage({
            id: 'commodity.deliverManagement.jinjichengdu',
            defaultMessage: '紧急程度',
          }),
          type: 'number',
          'x-component': 'Radio',
          'x-component-props': {
            style: {
              marginTop: 4,
            },
            className: styles.resetRadio,
          },
          default: 1,
          required: true,
          enum: [],
        },
      },
    },
  },
})

// 送样信息
const description: ISchema = {
  'x-index': 1,
  type: 'object',
  'x-component': 'MellowCard',
  'x-component-props': {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.songyangxinxi', defaultMessage: '送样信息' }),
    id: 'description',
  },
  properties: {
    NO_SUBMIT_LAYOUT_2: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 6,
        wrapperCol: 16,
        labelAlign: 'left',
        grid: true,
        full: true,
        autoRow: true,
        columns: 2,
      },
      properties: {
        receiver: {
          type: 'string',
          title: getIntl().formatMessage({ id: 'commodity.deliverManagement.jieshouren', defaultMessage: '接收人' }),
          'x-component': 'DrawerSearchTable',
          'x-component-props': {
            title: ' ',
            modalProps: {
              title: getIntl().formatMessage({
                id: 'commodity.deliverManagement.xuanzexuqiuren',
                defaultMessage: '选择需求人',
              }),
              keepAlive: false,
            },
            columns: neederColumns,
            fetchTableData: '{{fetchNeederList}}',
            formilyProps: {
              ctx: {
                schema: neederSchema,
                effects: '{{neederSearchEffects}}',
              },
            },
            tableProps: {
              rowKey: 'userId',
              lableKey: 'name',
            },
            layoutClassName: styles.resetCustomRelevance,
            cancelTip: getIntl().formatMessage({
              id: 'commodity.deliverManagement.weixuanzejieshouren',
              defaultMessage: '未选择接收人',
            }),
            showScreen: true,
          },
          'x-mega-props': {
            wrapperCol: 16,
          },
          'x-rules': [
            {
              required: true,
              message: getIntl().formatMessage({
                id: 'commodity.deliverManagement.qingxuanzejieshouren',
                defaultMessage: '请选择接收人',
              }),
            },
          ],
        },
        remark: {
          type: 'string',
          title: getIntl().formatMessage({ id: 'commodity.deliverManagement.beizhu', defaultMessage: '备注' }),
          'x-component': 'TextArea',
          'x-component-props': {
            placeholder: getIntl().formatMessage({
              id: 'commodity.deliverManagement.zuichang150gehanzi',
              defaultMessage: '最长150个汉字',
            }),
          },
          'x-rules': [
            {
              limitByte: true,
              maxByte: 300,
            },
          ],
        },
        phone: {
          title: getIntl().formatMessage({
            id: 'commodity.deliverManagement.lianxidianhua',
            defaultMessage: '联系电话',
          }),
          type: 'string',
          required: true,
          'x-component-props': {
            placeholder: getIntl().formatMessage({
              id: 'commodity.deliverManagement.qingshurunideshoujihao',
              defaultMessage: '请输入你的手机号码',
            }),
            maxLength: 11,
          },
          // 'x-rules': [
          //   {
          //     pattern: PATTERN_MAPS.phone,
          //     message: getIntl().formatMessage({
          //       id: 'commodity.deliverManagement.qingshuruzhengquegeshide',
          //       defaultMessage: '请输入正确格式的手机号',
          //     }),
          //   },
          // ],
        },
        receiveDepartment: {
          type: 'string',
          title: getIntl().formatMessage({
            id: 'commodity.deliverManagement.jieshoubumen',
            defaultMessage: '接收部门',
          }),
          required: true,
          'x-component-props': {},
          readOnly: true,
          default: '',
        },
        address: {
          type: 'string',
          title: getIntl().formatMessage({
            id: 'commodity.deliverManagement.songyangdizhi',
            defaultMessage: '送样地址',
          }),
          'x-component': 'CustomAddressSelect',
          'x-component-props': {
            isDefaultAddress: true,
            addressType: 1,
            suffixTextId: 'commodity.deliverManagement.genggaisongyangdizhi',
            dreawTitleTextId: 'commodity.deliverManagement.genggaisongyangdizhixinxi',
            editAddressFromType: 'modal',
            getAddressListApi: '{{getAddressListApi}}',
            placeholder: getIntl().formatMessage({
              id: 'commodity.deliverManagement.xuanzesongyangdizhi',
              defaultMessage: '选择送样地址',
            }),
          },
        },
      },
    },
  },
}

// 送样物料
const deliverMaterial = (roleType: string | number): ISchema => ({
  'x-index': 2,
  type: 'object',
  'x-component': 'MellowCard',
  'x-component-props': {
    title:
      roleType == 1
        ? getIntl().formatMessage({ id: 'commodity.deliverManagement.songyangwuliao', defaultMessage: '送样物料' })
        : getIntl().formatMessage({ id: 'commodity.deliverManagement.songyangshangpin', defaultMessage: '送样商品' }),
    id: 'deliverMaterial',
  },
  properties: {
    products: {
      type: 'array',
      'x-component': 'DeliverMaterialTable',
      'x-component-props': {
        rowKey: 'index',
        showSelectModalBtn: '{{showSelectModalBtn}}',
        showAddBtn: '{{showSelectModalBtn}}',
        addHandle: '{{addHandle}}',
        columns: '{{deliverColumns}}',
        confirm: '{{addMemberHandler}}',
        handleChange: '{{DeliverMaterialChange}}',
        tableFromRefList: '{{tableFromRef}}',
        supplier: '{{supplier}}',
        selectUnit: '{{selectUnit}}',
        roleType: roleType,
        showWarning: true,
        scroll: { x: 1200 },
        formilyProps: {
          ctx: {},
        },
        recipientDrawer: {
          modalProps: {
            title: getIntl().formatMessage({
              id: 'commodity.deliverManagement.xuanzexuqiuren',
              defaultMessage: '选择需求人',
            }),
            keepAlive: false,
          },
          columns: neederColumns,
          fetchTableData: '{{fetchNeederList}}',
          formilyProps: {
            ctx: {
              schema: neederSchema,
              effects: '{{neederSearchEffects}}',
            },
          },
          neederRef: '{{neederRef}}',
          tableProps: {
            rowKey: 'userId',
            lableKey: 'name',
          },
          cancelTip: getIntl().formatMessage({
            id: 'commodity.deliverManagement.weixuanzejieshouren',
            defaultMessage: '未选择接收人',
          }),
        },
        tableProps: {
          rowKey: 'userId',
          lableKey: 'name',
        },
        cancelTip: getIntl().formatMessage({
          id: 'commodity.deliverManagement.weixuanzejieshouren',
          defaultMessage: '未选择接收人',
        }),
      },
      default: [],
    },
  },
})

export const mergeAllSchemas = (roleType: string | number): ISchema => ({
  type: 'object',
  properties: {
    basicInfo: basicInfo(roleType),
    description,
    deliverMaterial: deliverMaterial(roleType),
  },
})
