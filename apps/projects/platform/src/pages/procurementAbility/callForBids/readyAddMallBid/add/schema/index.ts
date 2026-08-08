import { isEmpty } from 'lodash'
import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { GlobalConfig } from '@/global/config'
import moment from 'moment'
import { PURCHASE_TYPE } from '@/constants/procurement'
import { getIntl } from '@linkseeks/i18n'
import { getWebIntl } from '@apps/locales'
import { FILE_PREFIX_ENUM } from '@apps/constants/file'
const intl = getIntl()
const translate = getWebIntl()
export const tableListSchema: ISchema = {
  type: 'object',
  properties: {
    orderNo: {
      type: 'string',
      'x-component': 'SearchFilter',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'schma.purchase.orderNo' }),
        align: 'flex-end',
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        inline: true,
        colStyle: {
          marginLeft: 20,
        },
      },
      properties: {
        orderThe: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'schma.purchase.orderThe' }),
          },
        },
        supplyMembersName: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'schma.purchase.supplyMembersName' }),
          },
        },
        '[startCreateTime,endCreateTime]': {
          type: 'array',
          'x-component': 'DateRangePickerUnix',
          'x-component-props': {
            placeholder: [
              intl.formatMessage({ id: 'detail.purchase.startTime1' }),
              intl.formatMessage({ id: 'detail.purchase.endTime1' }),
            ],
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-component-props': {
            children: intl.formatMessage({ id: 'detail.purchase.search' }),
          },
        },
      },
    },
  },
}

// 基本信息
const basicInfo: ISchema = {
  type: 'object',
  'x-component': 'tabpane',
  'x-component-props': {
    tab: intl.formatMessage({ id: 'detail.purchase.basicLayout' }),
    className: 'useConnectBtnWrapper',
  },
  properties: {
    NO_SUBMIT_LAYOUT_0: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 4,
        labelAlign: 'left',
        wrapperCol: 10,
      },
      properties: {
        purchaseType: {
          type: 'string',
          enum: Object.values(PURCHASE_TYPE).map((item, index) => ({ label: item, value: ++index })),
          title: `{{help('${getIntl().formatMessage({
            id: 'schma.purchase.purchaseType.help',
            defaultMessage: '采购类型',
          })}', '${getIntl().formatMessage({
            id: 'schma.purchase.purchaseType.help.text',
            defaultMessage:
              '有固定采购金额：采购金额固定，合同期内不可超过采购金额，无固定采购金额：采购金额不固定，可在合同期内按需采购',
          })}')}}`,
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'schma.purchase.purchaseType' }),
          },
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'common.bitian' }),
            },
          ],
        },
        projectName: {
          type: 'string',
          title: intl.formatMessage({ id: 'table.purchase.projectName' }),
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'schma.purchase.projectName' }),
            },
            {
              limitByte: true,
              maxByte: 60,
            },
          ],
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'detail.purchase.placeholder4' }),
          },
        },
        remark: {
          type: 'string',
          title: intl.formatMessage({ id: 'schma.purchase.remark' }),
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'schma.purchase.remarkMessage' }),
            },
            {
              limitByte: true,
              maxByte: 100,
            },
          ],
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'detail.purchase.placeholder5' }),
          },
        },
        budget: {
          type: 'number',
          // title: '{{help("预算金额", "针对于项目可使用的预算金额")}}',
          title: `{{help("${intl.formatMessage({ id: 'purchase.yusuanjine' })}", "${intl.formatMessage({
            id: 'purchase.zhenduiyuxiangmukeshiyong',
          })}")}}`,
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'schma.purchase.budgetPlaceholder' }),
            style: {
              width: '100%',
            },
          },
          'x-rules': [
            // {
            //   required: true,
            //   message: '请输入预算金额'
            // },
            {
              validator: (value) => {
                return value > Number.MAX_SAFE_INTEGER
              },
              message: intl.formatMessage({ id: 'schma.purchase.budgetMessage' }),
            },
            {
              pattern: /^\d+(\.\d{1,2})?$/,
              message: intl.formatMessage({ id: 'schma.purchase.budgetMessage1' }),
            },
          ],
        },
        inviteTenderAreaList: {
          type: 'array',
          // title: '{{help("适用地市", "置了归属地市后，此招标可根据地市进行筛选，未设置时默认为所有地市")}}',
          title: `{{help("${intl.formatMessage({ id: 'detail.purchase.areas' })}", "${intl.formatMessage({
            id: 'purchase.zhileguishudishihou',
          })}")}}`,
          'x-component': 'MultAddress',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'detail.purchase.placeholder13' }),
            warningText: intl.formatMessage({ id: 'detail.purchase.placeholder14' }),
          },
          // default: [{ provinceCode: null, province: null, cityCode: null, city: null }],
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'common.bitian' }),
            },
          ],
        },
        memberName: {
          type: 'string',
          title: intl.formatMessage({ id: 'table.purchase.memberName' }),
          readOnly: true,
          visible: false,
        },
        inviteTenderInStatus: {
          type: 'string',
          title: intl.formatMessage({ id: 'detail.purchase.innerStatus' }),
          readOnly: true,
          visible: false,
        },
        inviteTenderOutStatus: {
          type: 'string',
          title: intl.formatMessage({ id: 'table.purchase.externalStatus' }),
          readOnly: true,
          visible: false,
        },
        createTime: {
          type: 'string',
          title: intl.formatMessage({ id: 'table.purchase.bidCreateTime' }),
          readOnly: true,
          visible: false,
        },
        isEdit: {
          type: 'boolean',
          title: intl.formatMessage({ id: 'schma.purchase.isEdit' }),
          visible: false,
        },
      },
    },
  },
}
// 招标物料
const bidMaterial: ISchema = {
  type: 'object',
  'x-component': 'tabpane',
  'x-component-props': {
    tab: intl.formatMessage({ id: 'schma.purchase.bidMaterial' }),
  },
  properties: {
    NO_SUBMIT_LAYOUT_1: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 4,
        labelAlign: 'left',
        wrapperCol: 10,
      },
      properties: {
        addMode: {
          type: 'radio',
          title: intl.formatMessage({ id: 'detail.purchase.modalTitle3' }),
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'common.bitian' }),
            },
          ],
          enum: [
            {
              label: intl.formatMessage({ id: 'detail.purchase.modalTitle27' }),
              value: 1,
            },
            // {
            //   label: '导入货品生成',
            //   value: 2
            // }
          ],
          default: 1,
        },
      },
    },
    materielList: {
      type: 'array',
      'x-component': 'MultTable',
      'x-component-props': {
        prefix: '{{materialAddButton}}',
        rowKey: 'code',
        columns: '{{materialColumns}}',
        components: '{{materialComponents}}',
      },
      'x-rules': [
        {
          required: true,
          message: intl.formatMessage({ id: 'detail.purchase.message7' }),
        },
      ],
    },
  },
}
// 招标需求
const bidRequestInfo: ISchema = {
  type: 'object',
  'x-component': 'tabpane',
  'x-component-props': {
    tab: intl.formatMessage({ id: 'schma.purchase.bidRequestInfo' }),
  },
  properties: {
    NO_SUBMIT_LAYOUT_2: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 4,
        labelAlign: 'left',
        wrapperCol: 10,
      },
      properties: {
        '[inviteTenderStartTime, inviteTenderEndTime]': {
          type: 'string',
          'x-component': 'daterange',
          title: intl.formatMessage({ id: 'schma.purchase.inviteTenderStartTime' }),
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'common.bitian' }),
            },
          ],
          'x-component-props': {
            placeholder: [
              intl.formatMessage({ id: 'detail.purchase.startTime1' }),
              intl.formatMessage({ id: 'detail.purchase.endTime1' }),
            ],
            disabledDate: (current) => {
              return current && current < moment().startOf('second')
            },
            showTime: true,
            style: { width: '100%' },
          },
        },
        openTenderTime: {
          type: 'string',
          'x-component': 'date',
          title: intl.formatMessage({ id: 'table.purchase.openTenderTime' }),
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'common.bitian' }),
            },
          ],
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.openTenderTime' }),
            disabledDate: (current) => {
              return current && current < moment().startOf('second')
            },
            showTime: true,
            style: { width: '100%' },
          },
        },
        hopeDate: {
          type: 'string',
          'x-component': 'date',
          title: intl.formatMessage({ id: 'table.purchase.deliveryTime' }),
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'common.bitian' }),
            },
          ],
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.deliveryTime' }),
            disabledDate: (current) => {
              return current && current < moment().startOf('second')
            },
            showTime: false,
            style: { width: '100%' },
          },
        },
        hasAimPrice: {
          // type: 'boolean',
          'x-component': 'CheckboxSingle',
          'x-component-props': {
            children: intl.formatMessage({ id: 'detail.purchase.isStartingPrice1' }),
            style: {
              marginTop: 4,
            },
          },
          // title: '{{help("目标价", "招标项目期望成交价格")}}',
          title: `{{help("${intl.formatMessage({ id: 'detail.purchase.targetPrice' })}", "${intl.formatMessage({
            id: 'purchase.zhaobiaoxiagmuqiwnag',
          })}")}}`,
          default: true,
          'x-linkages': [
            {
              type: 'value:visible',
              target: 'targetPrice',
              condition: '{{!!$value}}',
            },
          ],
        },
        targetPrice: {
          type: 'string',
          title: ' ',
          'x-component-props': {
            prefix: translate('web.common.currencySymbol'),
            style: { width: '100%' },
          },
          'x-rules': [
            {
              validator: (value) => {
                return value > Number.MAX_SAFE_INTEGER
              },
              message: intl.formatMessage({ id: 'schma.purchase.targetPriceMessage' }),
            },
            {
              pattern: /^\d+(\.\d{1,2})?$/,
              message: intl.formatMessage({ id: 'schma.purchase.targetPriceMessage1' }),
            },
          ],
        },
        inviteTenderRequirement: {
          type: 'textarea',
          title: intl.formatMessage({ id: 'schma.purchase.inviteTenderRequirement' }),
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'detail.purchase.placeholder8' }),
          },
          'x-rules': [
            {
              limitByte: true,
              maxByte: 200,
            },
          ],
        },
        inviteTenderFile: {
          title: intl.formatMessage({ id: 'schma.purchase.inviteTenderFile' }),
          'x-component': 'FixUpload',
          'x-component-props': {
            action: '/api/support/file/upload/prefix',
            data: {
              fileType: 1,
              prefix: FILE_PREFIX_ENUM.PURCHASE_SERVICE,
            },
            beforeUpload: '{{beforeUpload}}',
            accept: '.xls, .xlsx, .doc, .docx, .wps, .pdf, .jpg, .png, .jpeg',
          },
          'x-rules': [
            {
              required: false,
              message: intl.formatMessage({ id: 'detail.purchase.message57' }),
            },
          ],
          description: intl.formatMessage({ id: 'detail.purchase.message74' }),
        },
      },
    },
  },
}
// 报名要求
const enterRequestInfo: ISchema = {
  type: 'object',
  'x-component': 'tabpane',
  'x-component-props': {
    tab: intl.formatMessage({ id: 'detail.purchase.signUpLayout' }),
  },
  properties: {
    NO_SUBMIT_LAYOUT_3: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 4,
        labelAlign: 'left',
        wrapperCol: 10,
      },
      properties: {
        '[registerStartTime, registerEndTime]': {
          type: 'string',
          'x-component': 'daterange',
          title: intl.formatMessage({ id: 'detail.purchase.startSignUp' }),
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'common.bitian' }),
            },
          ],
          'x-component-props': {
            disabledDate: (current) => {
              return current && current < moment().startOf('second')
            },
            showTime: true,
            style: { width: '100%' },
          },
        },
        registerRequirement: {
          type: 'textarea',
          title: intl.formatMessage({ id: 'detail.purchase.signUpLayout' }),
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'detail.purchase.placeholder8' }),
          },
          'x-rules': [
            {
              limitByte: true,
              maxByte: 200,
            },
          ],
        },
        registerFile: {
          title: intl.formatMessage({ id: 'detail.purchase.demandUrls' }),
          'x-component': 'FixUpload',
          'x-component-props': {
            action: '/api/support/file/upload/prefix',
            data: {
              fileType: 1,
              prefix: FILE_PREFIX_ENUM.PURCHASE_SERVICE,
            },
            beforeUpload: '{{beforeUpload}}',
            accept: '.xls, .xlsx, .doc, .docx, .wps, .pdf, .jpg, .png, .jpeg',
          },
          'x-rules': [
            {
              required: false,
              message: intl.formatMessage({ id: 'detail.purchase.message57' }),
            },
          ],
          description: intl.formatMessage({ id: 'detail.purchase.placeholder2' }),
        },
      },
    },
  },
}
// 资格预审要求
const qualificationNeedInfo: ISchema = {
  type: 'object',
  'x-component': 'tabpane',
  'x-component-props': {
    tab: intl.formatMessage({ id: 'table.purchase.zigeyushenyao' }),
  },
  properties: {
    NO_SUBMIT_LAYOUT_ORTHER: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelAlign: 'left',
        labelCol: 4,
        wrapperCol: 10,
      },
      properties: {
        isQualificationCheck: {
          // type: 'boolean',
          'x-component': 'CheckboxSingle',
          'x-component-props': {
            children: intl.formatMessage({ id: 'table.purchase.xuyaozigeyu' }),
            style: {
              marginTop: 4,
            },
          },
          title: intl.formatMessage({ id: 'table.purchase.zigeyushen' }),
          default: true,
          'x-linkages': [
            {
              type: 'value:visible',
              target: '[preCheckStartTime, preCheckEndTime]',
              condition: '{{!!$value}}',
            },
          ],
        },
        '[preCheckStartTime, preCheckEndTime]': {
          type: 'string',
          title: intl.formatMessage({ id: 'table.purchase.zigeyushenshi' }),
          'x-component': 'daterange',
          'x-component-props': {
            disabledDate: (current) => {
              return current && current < moment().startOf('second')
            },
            showTime: true,
            style: { width: '100%' },
          },
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'common.bitian' }),
            },
          ],
        },
        preCheckRequirement: {
          type: 'string',
          'x-component': 'textarea',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'detail.purchase.placeholder8' }),
          },
          title: intl.formatMessage({ id: 'table.purchase.zigeyushenyao' }),
          'x-rules': [
            {
              limitByte: true,
              maxByte: 100,
            },
          ],
        },
        preCheckFile: {
          title: intl.formatMessage({ id: 'table.purchase.zigeyushenyao' }),
          'x-component': 'FixUpload',
          'x-component-props': {
            action: '/api/support/file/upload/prefix',
            data: {
              fileType: 1,
              prefix: FILE_PREFIX_ENUM.PURCHASE_SERVICE,
            },
            beforeUpload: '{{beforeUpload}}',
            accept: '.xls, .xlsx, .doc, .docx, .wps, .pdf, .jpg, .png, .jpeg',
          },
          'x-rules': [
            {
              required: false,
              message: intl.formatMessage({ id: 'detail.purchase.message57' }),
            },
          ],
          description: intl.formatMessage({ id: 'detail.purchase.placeholder2' }),
        },
      },
    },
  },
}
// 评标要求
const evaluationNeedInfo: ISchema = {
  type: 'object',
  'x-component': 'tabpane',
  'x-component-props': {
    tab: intl.formatMessage({ id: 'table.purchase.pingbiaoyaoqiu' }),
  },
  properties: {
    NO_SUBMIT_LAYOUT_ORTHER: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelAlign: 'left',
        labelCol: 4,
        wrapperCol: 10,
      },
      properties: {
        '[evaluationStartTime, evaluationEndTime]': {
          type: 'string',
          title: intl.formatMessage({ id: 'table.purchase.pingbiaoyaoqiushi' }),
          'x-component': 'daterange',
          'x-component-props': {
            disabledDate: (current) => {
              return current && current < moment().startOf('second')
            },
            showTime: true,
            style: { width: '100%' },
          },
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'common.bitian' }),
            },
          ],
        },
        evaluationRequirement: {
          type: 'string',
          'x-component': 'textarea',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.zuichang100zifu' }),
          },
          title: intl.formatMessage({ id: 'table.purchase.pingbiaoyaoqiu' }),
          'x-rules': [
            {
              limitByte: true,
              maxByte: 100,
            },
          ],
        },
        evaluationFile: {
          title: intl.formatMessage({ id: 'table.purchase.pingbiaoyaoqiufu' }),
          'x-component': 'FixUpload',
          'x-component-props': {
            action: '/api/support/file/upload/prefix',
            data: {
              fileType: 1,
              prefix: FILE_PREFIX_ENUM.PURCHASE_SERVICE,
            },
            beforeUpload: '{{beforeUpload}}',
            accept: '.xls, .xlsx, .doc, .docx, .wps, .pdf, .jpg, .png, .jpeg',
          },
          'x-rules': [
            {
              required: false,
              message: intl.formatMessage({ id: 'detail.purchase.message57' }),
            },
          ],
          description: intl.formatMessage({ id: 'detail.purchase.placeholder2' }),
        },
        isOnlineEvaluation: {
          // type: 'boolean',
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'common.bitian' }),
            },
          ],
          'x-component': 'CheckboxSingle',
          'x-component-props': {
            children: intl.formatMessage({ id: 'table.purchase.zaixianpingbiao' }),
            style: {
              marginTop: 4,
            },
          },
          title: `{{help("${intl.formatMessage({ id: 'table.purchase.shifouzaixianping' })}", "${intl.formatMessage({
            id: 'purchase.zaixianpingbiaodafen',
          })}")}}`,
          default: true,
          // "x-linkages": [
          //   {
          //     type: 'value:visible',
          //     target: 'templateId',
          //     condition: "{{!!$value}}"
          //   }
          // ]
        },
        templateId: {
          type: 'number',
          title: intl.formatMessage({ id: 'table.purchase.pingbiaoxiangmuban' }),
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'common.bitian' }),
            },
          ],
          enum: [],
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.qingxuanzepingbiao' }),
          },
        },
      },
    },
  },
}
// 其他要求
const otherRequset: ISchema = {
  type: 'object',
  'x-component': 'tabpane',
  'x-component-props': {
    tab: intl.formatMessage({ id: 'table.purchase.qitayaoqiu' }),
  },
  properties: {
    NO_SUBMIT_LAYOUT_ORTHER: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelAlign: 'left',
        labelCol: 4,
        wrapperCol: 10,
      },
      properties: {
        deliverAddressId: {
          type: 'number',
          title: intl.formatMessage({ id: 'table.purchase.jiaofudizhi' }),
          enum: [],
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.qingxuanzejiaofu' }),
          },
          'x-rules': [
            {
              limitByte: true,
              maxByte: 100,
            },
          ],
        },
        payType: {
          type: 'string',
          title: intl.formatMessage({ id: 'table.purchase.fukuanfangshi' }),
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.zuichang100zifu' }),
          },
        },
        deliverRequirement: {
          type: 'string',
          'x-component': 'textarea',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.zuichang100zifu' }),
          },
          title: intl.formatMessage({ id: 'table.purchase.jiaofuyaoqiu' }),
          'x-rules': [
            {
              limitByte: true,
              maxByte: 100,
            },
          ],
        },
        taxationRequirement: {
          type: 'string',
          'x-component': 'textarea',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.zuichang100zifu' }),
          },
          title: intl.formatMessage({ id: 'table.purchase.shuifeiyaoqiu' }),
          'x-rules': [
            {
              limitByte: true,
              maxByte: 100,
            },
          ],
        },
        logisticsRequirement: {
          type: 'string',
          'x-component': 'textarea',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.zuichang100zifu' }),
          },
          title: intl.formatMessage({ id: 'table.purchase.wuliuyaoqiu' }),
          'x-rules': [
            {
              limitByte: true,
              maxByte: 100,
            },
          ],
        },
        packingRequirement: {
          type: 'string',
          'x-component': 'textarea',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.zuichang100zifu' }),
          },
          title: intl.formatMessage({ id: 'table.purchase.baozhuangyaoqiu' }),
          'x-rules': [
            {
              limitByte: true,
              maxByte: 100,
            },
          ],
        },
        otherRequirement: {
          type: 'string',
          'x-component': 'textarea',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.zuichang100zifu' }),
          },
          title: intl.formatMessage({ id: 'table.purchase.qitayaoqiu' }),
          'x-rules': [
            {
              limitByte: true,
              maxByte: 100,
            },
          ],
        },
      },
    },
  },
}
// 招标方式
const bidPattern: ISchema = {
  type: 'object',
  'x-component': 'tabpane',
  'x-component-props': {
    tab: intl.formatMessage({ id: 'table.purchase.zhaobiaofangshi' }),
  },
  properties: {
    NO_SUBMIT_LAYOUT_1: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 4,
        labelAlign: 'left',
        wrapperCol: 10,
      },
      properties: {
        inviteTenderType: {
          type: 'radio',
          title: intl.formatMessage({ id: 'table.purchase.zhaobiaofangshi' }),
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'common.bitian' }),
            },
          ],
          enum: [
            {
              // label: '{{help("公开招标", "将招标项目发布至平台门户，登录平台门户的供应商都能向您投标")}}',
              label: `{{help("${intl.formatMessage({ id: 'detail.purchase.modalTitle' })}", "${intl.formatMessage({
                id: 'purchase.zhaobiaofabuzhicaigoumen',
              })}")}}`,
              value: 1,
            },
            // {
            //   label: '{{help("系统匹配", "系统通过招标品类、商品属性、适用地市与平台会员发布的商品品类、商品属性、归属地区进行匹配，推荐满足条件的平台会员")}}',
            //   value: 2
            // },
            {
              // label: '{{help("邀请招标", "只将招标项目发送给您指定的供应商，收到您的招标项目的供应商才能向您投标，要求您的供应商先申请成为您的会员")}}',
              label: `{{help("${intl.formatMessage({ id: 'purchase.yaoqingzhaobiao' })}", "${intl.formatMessage({
                id: 'purchase.xuanzeyudangqianhuiyuanxia',
              })}")}}`,
              value: 3,
            },
          ],
          'x-linkages': [
            {
              type: 'value:visible',
              target: 'memberList',
              condition: '{{$value===3}}',
            },
          ],
        },
      },
    },
    // 招标发布商城
    inviteTenderShopList: {
      type: 'array',
      title: intl.formatMessage({ id: 'table.purchase.zhaobiaofabushang' }),
      visible: false,
    },
    memberList: {
      type: 'array:number',
      'x-component': 'MultTable',
      'x-component-props': {
        rowKey: 'memberId',
        columns: '{{memberColumn}}',
        prefix: '{{inviteAddButton}}',
      },
      'x-rules': [
        {
          required: true,
          message: intl.formatMessage({ id: 'detail.purchase.message41' }),
        },
      ],
      visible: false,
    },
  },
}

// 新增招标
export const addNewBidSchema: ISchema = {
  type: 'object',
  properties: {
    NO_SUBMIT_TABS: {
      type: 'object',
      'x-component': 'tab',
      'x-component-props': {
        type: 'card',
      },
      properties: {
        basicInfo,
        bidMaterial,
        enterRequestInfo,
        qualificationNeedInfo,
        bidRequestInfo,
        evaluationNeedInfo,
        otherRequset,
        bidPattern,
      },
    },
  },
}

// 传参与schema映射
export const mergeAllSchemas = {
  // 新增招标
  '0': addNewBidSchema,
}
