import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
import moment from 'moment'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { supplierColumns } from '../columns'
import styles from '../index.less'

const intl = getIntl()

const validatorNumber = (value: string) => {
  if (value === '' || value === void 0) {
    return intl.formatMessage({ id: 'eightD.qingshurushuliang', defaultMessage: '请输入数量' })
  }
  if (Number(value) <= 0) {
    return intl.formatMessage({ id: 'eightD.shuliangbixudayu0', defaultMessage: '数量必须大于0' })
  }
  if (!/^\d+(\.\d{1,3})?$/.test(value)) {
    return intl.formatMessage({ id: 'eightD.shuliangjinxiansanweixiaoshu', defaultMessage: '数量仅限三位小数' })
  }
  return ''
}

export const supplierSchema: ISchema = {
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
            placeholder: intl.formatMessage({
              id: 'afterService.apply.supplier.name.placeholder',
              defaultMessage: '搜索',
            }),
            align: 'flex-start',
            advanced: 'false',
            tip: intl.formatMessage({
              id: 'afterService.apply.supplier.name.tip',
              defaultMessage: '输入 会员名称 进行搜索',
            }),
          },
        },
      },
    },
  },
}
export const temaSearchSchema: ISchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      'x-component': 'Search',
      'x-mega-props': {
        wrapperCol: 12,
      },
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'eightD.xingming', defaultMessage: '姓名' }),
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
        columns: 5,
      },
      properties: {
        phone: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'eightD.dianhua', defaultMessage: '电话' }),
            allowClear: true,
          },
        },
        org: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'eightD.bumen', defaultMessage: '部门' }),
            allowClear: true,
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: intl.formatMessage({ id: 'member.management.maintain.query.query' }),
          },
        },
      },
    },
  },
}

export const teamSchema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'Mega-Layout',
      properties: {
        name: {
          type: 'string',
          'x-component': 'Search',
          'x-mega-props': {},
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'eightD.mingcheng', defaultMessage: '名称' }),
            align: 'flex-start',
            advanced: 'false',
            tip: intl.formatMessage({
              id: 'afterService.apply.supplier.name.tip',
              defaultMessage: '输入 会员名称 进行搜索',
            }),
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            grid: true,
            full: true,
            autoRow: true,
            columns: 6,
          },
          properties: {
            applyAbstract: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'eightD.shenqingdanzhaiyao', defaultMessage: '申请单摘要' }),
                allowClear: true,
              },
            },
            supplierName: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'eightD.gongyinghuiyuan', defaultMessage: '供应会员' }),
                allowClear: true,
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: intl.formatMessage({ id: 'afterService.common.query.submit', defaultMessage: '查询' }),
              },
            },
          },
        },
      },
    },
  },
}

// 基本信息
const basicInfo: ISchema = {
  'x-index': 0,
  type: 'object',
  'x-component': 'MellowCard',
  'x-component-props': {
    title: intl.formatMessage({ id: 'eightD.jibenxinxi', defaultMessage: '基本信息' }),
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
          title: intl.formatMessage({ id: 'eightD.zhaiyao', defaultMessage: '摘要' }),
          'x-component-props': {},
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'eightD.qingshuruzhaiyao', defaultMessage: '请输入摘要' }),
            },
            {
              limitByte: true,
              maxByte: 60,
            },
          ],
        },
        sourceType: {
          type: 'string',
          title: intl.formatMessage({ id: 'eightD.laiyuanleixing', defaultMessage: '来源类型' }),
          enum: [],
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'eightD.qingxuanzeshujulaiyuan', defaultMessage: '请选择数据来源' }),
            showArrow: true,
            allowClear: true,
            defaultActiveFirstOption: false,
            filterOption: false,
          },
        },
        icaReplyTime: {
          type: 'string',
          'x-component': 'date',
          title: intl.formatMessage({ id: 'eightD.ICAyaoqiuriqi', defaultMessage: 'ICA要求日期' }),
          'x-component-props': {
            style: { width: 400 },
            placeholder: intl.formatMessage({ id: 'eightD.qingxuanzeriqi', defaultMessage: '请选择日期' }),
            disabledDate: (data: moment.Moment) => {
              return data && data < moment().startOf('day')
            },
          },
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'eightD.qingxuanzeriqi', defaultMessage: '请选择日期' }),
            },
          ],
          default: moment().format('YYYY-MM-DD'),
        },
        qualityType: {
          type: 'number',
          'x-component': 'Radio',
          'x-component-props': {
            style: {
              marginTop: 4,
            },
            className: styles.resetRadio,
          },
          default: 1,
          enum: [
            { label: intl.formatMessage({ id: 'eightD.shouhuodan', defaultMessage: '收货单' }), value: 1 },
            { label: intl.formatMessage({ id: 'eightD.zhijiandan', defaultMessage: '质检单' }), value: 2 },
            { label: intl.formatMessage({ id: 'eightD.dingdan', defaultMessage: '订单' }), value: 3 },
          ],
          title: intl.formatMessage({ id: 'eightD.laiyuandanju', defaultMessage: '来源单据' }),
        },
        pcaReplyTime: {
          type: 'string',
          'x-component': 'date',
          title: intl.formatMessage({ id: 'eightD.PCAyaoqiuriqi', defaultMessage: 'PCA要求日期' }),
          'x-component-props': {
            style: { width: 400 },
            placeholder: intl.formatMessage({ id: 'eightD.qingxuanzeriqi', defaultMessage: '请选择日期' }),
            disabledDate: (data: moment.Moment) => {
              return data && data < moment().startOf('day')
            },
          },
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'eightD.qingxuanzeriqi', defaultMessage: '请选择日期' }),
            },
            {
              validator: '{{checkPcaDate}}',
              message: intl.formatMessage({
                id: 'eightD.PCAyaoqiuriqidayuhuo',
                defaultMessage: 'PCA要求日期大于或等于ICA要求日期',
              }),
            },
          ],
          default: moment().format('YYYY-MM-DD'),
        },
        orderNo: {
          type: 'string',
          title: intl.formatMessage({ id: 'eightD.laiyuandanhao', defaultMessage: '来源单号' }),
          'x-component-props': {},
        },
        supplierMember: {
          type: 'string',
          title: intl.formatMessage({ id: 'afterService.apply.supplierMember', defaultMessage: '供应会员' }),
          'x-component': 'DrawerSearchTable',
          'x-component-props': {
            title: ' ',
            modalProps: {
              title: intl.formatMessage({
                id: 'afterService.apply.supplierMember.placeholder',
                defaultMessage: '选择会员',
              }),
              keepAlive: false,
            },
            columns: supplierColumns,
            fetchTableData: '{{fetchSupplierList}}',
            formilyProps: {
              ctx: {
                schema: supplierSchema,
              },
            },
            tableProps: {
              rowKey: 'id',
              lableKey: 'name',
            },
            layoutClassName: styles.resetCustomRelevance,
            cancelTip: intl.formatMessage({ id: 'eightD.weixuanzehuiyuan', defaultMessage: '未选择会员' }),
          },
          'x-mega-props': {
            wrapperCol: 16,
          },
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({
                id: 'afterService.apply.supplierMember.required',
                defaultMessage: '请选择供应会员',
              }),
            },
          ],
        },
        remark: {
          type: 'string',
          title: intl.formatMessage({ id: 'logistics.beizhu' }),
          'x-component': 'TextArea',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'eightD.zuichang150gezifu', defaultMessage: '最长150个汉字' }),
          },
          'x-rules': [
            {
              limitByte: true,
              maxByte: 300,
            },
          ],
        },
        materialsInformation: {
          type: 'string',
          title: intl.formatMessage({ id: 'eightD.wuliaoxinxi', defaultMessage: '物料信息' }),
          'x-component-props': {
            disabled: true,
            className: styles.resetBtnStyle,
            addonAfter: '{{materialBtn}}',
          },
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'eightD.qingxuanzewuliaoxinxi', defaultMessage: '请选择物料信息' }),
            },
          ],
        },
      },
    },
  },
}

// 问题描述
const description: ISchema = {
  'x-index': 1,
  type: 'object',
  'x-component': 'MellowCard',
  'x-component-props': {
    title: intl.formatMessage({ id: 'eightD.wentimiaoshu', defaultMessage: '问题描述' }),
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
        inspectionType: {
          title: intl.formatMessage({ id: 'eightD.jianchafangshi', defaultMessage: '检查方式' }),
          type: 'radio',
          default: 2,
          enum: [
            { label: intl.formatMessage({ id: 'eightD.quanjian', defaultMessage: '全检' }), value: 2 },
            { label: intl.formatMessage({ id: 'eightD.choujian', defaultMessage: '抽检' }), value: 3 },
          ],
          required: true,
          'x-component-props': {
            className: styles.resetRadio,
          },
        },
        problemDegreeType: {
          title: intl.formatMessage({ id: 'eightD.wentijinjichengdu', defaultMessage: '问题紧急程度' }),
          type: 'radio',
          enum: [],
          default: 1,
          required: true,
          'x-component-props': {
            className: styles.resetRadio,
          },
        },
        qualityQuantity: {
          type: 'string',
          title: intl.formatMessage({ id: 'eightD.zhijianshuliang', defaultMessage: '质检数量' }),
          required: true,
          'x-component-props': {
            type: 'number',
          },
          'x-rules': [
            {
              validator: validatorNumber,
            },
          ],
        },
        batchJudgmentType: {
          type: 'string',
          title: intl.formatMessage({ id: 'eightD.jianyanjieguo', defaultMessage: '检验结果' }),
          enum: [],
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'eightD.qingxuanzejianyanjieguo', defaultMessage: '请选择检验结果' }),
            showArrow: true,
            allowClear: true,
            defaultActiveFirstOption: false,
            filterOption: false,
          },
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'eightD.qingxuanzejianyanjieguo', defaultMessage: '请选择检验结果' }),
            },
          ],
        },
        defectiveQuantity: {
          type: 'string',
          title: intl.formatMessage({ id: 'eightD.buliangpinshuliang', defaultMessage: '不良品数量' }),
          required: true,
          'x-props': {
            extra: '',
          },
          'x-component-props': {
            type: 'number',
          },
          'x-rules': [
            {
              validator: validatorNumber,
            },
          ],
        },
        problemDescription: {
          type: 'string',
          title: intl.formatMessage({ id: 'eightD.wentimiaoshu', defaultMessage: '问题描述' }),
          'x-component': 'TextArea',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'eightD.zuichang500gehanzi', defaultMessage: '最长500个汉字' }),
          },
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'eightD.qingshuruwentimiaoshu', defaultMessage: '请输入问题描述' }),
            },
            {
              limitByte: true,
              maxByte: 1000,
            },
          ],
        },
      },
    },
  },
}

// 附件
const attachment: ISchema = {
  'x-index': 2,
  type: 'object',
  'x-component': 'MellowCard',
  'x-component-props': {
    title: intl.formatMessage({ id: 'member.memberVisitManage.files', defaultMessage: '附件' }),
    id: 'attachment',
    className: styles.uploadFile,
  },
  properties: {
    MEGA_LADYOUT_1: {
      type: 'object',
      'x-component': 'Mega-Layout',
      'x-component-props': {
        grid: true,
        full: true,
        columns: 2,
        autoRow: true,
        labelCol: 6,
        labelAlign: 'left',
      },
      properties: {
        urls: {
          type: 'string',
          'x-component': 'FormilyUploadFiles',
          'x-component-props': {
            buttonText: intl.formatMessage({ id: 'eightD.shangchuan', defaultMessage: '上传' }),
            fileContainerClassName: 'uploadFilesList',
            canDownload: true,
          },
          description: intl.formatMessage({
            id: 'member.memberVisitManage.files.description',
            defaultMessage: '一次上传一个文件，每个附件大小不能超过 20M',
          }),
        },
      },
    },
  },
}

// 小组成员
const teamMembers: ISchema = {
  'x-index': 3,
  type: 'object',
  'x-component': 'MellowCard',
  'x-component-props': {
    title: intl.formatMessage({ id: 'eightD.xiaozuchengyuan', defaultMessage: '小组成员' }),
    id: 'teamMembers',
  },
  properties: {
    teamMembersList: {
      type: 'array',
      'x-component': 'AddTemaTableModal',
      'x-component-props': {
        rowKey: 'index',
        showAddTeamBtn: '{{showAddTeamBtn}}',
        columns: '{{newTeamColumns}}',
        confirm: '{{addMemberHandler}}',
        handleChange: '{{temaHandleChange}}',
        showWarning: true,
        scroll: { x: 1200 },
        formilyProps: {
          ctx: {
            schema: temaSearchSchema,
            effects: '{{effects}}',
          },
        },
        default: [],
      },
    },
  },
}

export const orderAddSchema: ISchema = {
  type: 'object',
  properties: {
    basicInfo,
    description,
    attachment,
    teamMembers,
  },
}

export const mergeAllSchemas = {
  ...orderAddSchema,
}
