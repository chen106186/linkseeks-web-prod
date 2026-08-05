import { ISchema, Schema } from '@apps/formily'
import { message, Upload } from 'antd'
import { getIntl } from '@linkseeks/i18n'
import { getWebIntl } from '@apps/locales'
const translate = getWebIntl()
/**
 * 新增物料
 */
export const getSchema = (schema: ISchema | null): ISchema => {
  const compoundSchema: ISchema = {
    type: 'object',
    properties: {
      basic: {
        type: 'object',
        'x-component': 'MellowCard',
        'x-component-props': {
          id: 'basic',
          title: getIntl().formatMessage({ id: 'material.basic.title', defaultMessage: '基本信息' }),
        },
        properties: {
          layout: {
            type: 'object',
            'x-component': 'mega-layout',
            'x-component-props': {
              labelAlign: 'left',
              labelCol: 4,
              wrapperCol: 19,
              grid: true,
              autoRow: true,
              columns: 2,
              responsive: {
                lg: 2,
                m: 1,
                s: 1,
              },
            },
            properties: {
              code: {
                title: getIntl().formatMessage({ id: 'material.code', defaultMessage: '物料编号' }),
                type: 'string',
                'x-rules': [
                  {
                    required: true,
                    message: getIntl().formatMessage({
                      id: 'material.code.required',
                      defaultMessage: '请填写物料编号',
                    }),
                  },
                  {
                    limitByte: true,
                    maxByte: 20,
                    allowChineseTransform: false,
                  },
                  // {
                  //   pattern:/^[0-9A-Za-z]{6,24}|(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,24}|(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*-<>])[\da-zA-Z~!@#$%^&*-<>]{3,}/,
                  //   message: getIntl().formatMessage({ id: 'material.code.validate.add', defaultMessage: '编号由数字或字母或数字、字母或数字、字母、符号组成' })
                  // },
                ],
              },
              type: {
                title: getIntl().formatMessage({ id: 'material.type', defaultMessage: '规格型号' }),
                type: 'string',
                'x-rules': [
                  {
                    required: true,
                    message: getIntl().formatMessage({
                      id: 'material.type.required',
                      defaultMessage: '请填写规格型号',
                    }),
                  },
                  {
                    limitByte: true,
                    maxByte: 24,
                  },
                ],
              },
              unitId: {
                title: getIntl().formatMessage({ id: 'material.unit', defaultMessage: '单位' }),
                type: 'string',
                enum: [],
                'x-rules': [
                  {
                    required: true,
                    message: getIntl().formatMessage({ id: 'material.unit.required', defaultMessage: '单位' }),
                  },
                ],
                'x-component-props': {
                  showSearch: true,
                  defaultActiveFirstOption: false,
                  showArrow: false,
                  filterOption: false,
                  onSearch: '{{handleSearchUnit}}',
                },
              },
              name: {
                title: getIntl().formatMessage({ id: 'material.name', defaultMessage: '物料名称' }),
                type: 'string',
                'x-rules': [
                  {
                    required: true,
                    message: getIntl().formatMessage({
                      id: 'material.name.required',
                      defaultMessage: '请填写物料名称',
                    }),
                  },
                  {
                    limitByte: true,
                    maxByte: 40,
                  },
                ],
              },
              costPrice: {
                title: getIntl().formatMessage({ id: 'material.costPrice', defaultMessage: '目录价' }),
                type: 'string',
                'x-component-props': {
                  placeholder: getIntl().formatMessage({
                    id: 'material.costPrice.required',
                    defaultMessage: '请填写目录价',
                  }),
                  addonBefore: translate('web.common.currencySymbol'),
                },
                'x-rules': [
                  // {
                  //   required: true,
                  //   message: getIntl().formatMessage({ id: 'material.costPrice.required', defaultMessage: '请填写目录价' })
                  // },
                  {
                    pattern: /^[0-9]+(.[0-9]{0,4})?$/,
                    message: getIntl().formatMessage({
                      id: 'material.costPrice.pattern',
                      defaultMessage: '请填写数字且最多保留四位小数',
                    }),
                  },
                ],
              },
              materialGroup: {
                title: getIntl().formatMessage({ id: 'material.belong.materialGroup', defaultMessage: '所属物料组' }),
                type: 'string',
                'x-component': 'Cascader',
                'x-component-props': {
                  options: [],
                  showSearch: true,
                  fieldNames: { label: 'name', value: 'id', children: 'children' },
                },
              },
              brand: {
                title: getIntl().formatMessage({ id: 'material.brand', defaultMessage: '品牌' }),
                type: 'string',
                enum: [],
                'x-component-props': {
                  showSearch: true,
                  filterOption: (input, option) => (option!.children as unknown as string).includes(input),
                },
                description: `{{desc()}}`,
              },
              category: {
                title: getIntl().formatMessage({ id: 'material.category', defaultMessage: '品类' }),
                'x-component': 'Cascader',
                'x-component-props': {
                  options: [],
                  showSearch: true,
                  fieldNames: { label: 'name', value: 'id', children: 'children' },
                },
                'x-rules': [
                  {
                    required: true,
                    message: getIntl().formatMessage({
                      id: 'material.category.required',
                      defaultMessage: '请填写品类',
                    }),
                  },
                ],
              },
              remark: {
                title: getIntl().formatMessage({ id: 'material.remark', defaultMessage: '备注' }),
                type: 'string',
                'x-component-props': {
                  maxLength: 200,
                },
              },
            },
          },
        },
      },

      /** 根据品类动态获取schema */
      property: schema,
      /*产地与配送*/
      output: {
        type: 'object',
        'x-component': 'MellowCard',
        'x-component-props': {
          id: 'output',
          title: getIntl().formatMessage({ id: 'material.output.title', defaultMessage: '产地与配送' }),
        },
        properties: {
          layout: {
            type: 'object',
            'x-component': 'mega-layout',
            'x-component-props': {
              labelAlign: 'left',
              labelCol: 4,
              wrapperCol: 19,
              grid: true,
              autoRow: true,
              columns: 2,
              responsive: {
                lg: 2,
                m: 1,
                s: 1,
              },
            },
            properties: {
              materialsManufacturer: {
                title: getIntl().formatMessage({ id: 'material.materialsManufacturer', defaultMessage: '生产厂家' }),
                type: 'string',
                'x-rules': [
                  {
                    limitByte: true,
                    maxByte: 40,
                    allowChineseTransform: false,
                  },
                ],
              },
              materialsOrigin: {
                title: getIntl().formatMessage({ id: 'material.materialsOrigin', defaultMessage: '产地' }),
                type: 'string',
                'x-rules': [
                  {
                    limitByte: true,
                    maxByte: 24,
                  },
                ],
              },
              materialsDeparture: {
                title: getIntl().formatMessage({ id: 'material.materialsDeparture', defaultMessage: '起运地' }),
                type: 'string',
                'x-rules': [
                  {
                    limitByte: true,
                    maxByte: 40,
                  },
                ],
              },
              materialsDeliverPeriod: {
                title: getIntl().formatMessage({ id: 'material.materialsDeliverPeriod', defaultMessage: '到货周期' }),
                type: 'string',
                'x-rules': [
                  {
                    limitByte: true,
                    maxByte: 40,
                  },
                ],
              },
              materialsDeliveryMethod: {
                title: getIntl().formatMessage({ id: 'material.materialsDeliveryMethod', defaultMessage: '交货方式' }),
                type: 'string',
                'x-rules': [
                  {
                    limitByte: true,
                    maxByte: 40,
                  },
                ],
              },
            },
          },
        },
      },
      /*单位换算*/
      unitConversion: {
        type: 'object',
        'x-component': 'MellowCard',
        'x-component-props': {
          id: 'unitConversion',
          title: getIntl().formatMessage({ id: 'material.unitConversion.title', defaultMessage: '单位换算' }),
        },
        properties: {
          layout: {
            type: 'object',
            'x-component': 'mega-layout',
            'x-component-props': {
              labelAlign: 'left',
              labelCol: 4,
              wrapperCol: 19,
              grid: true,
              autoRow: true,
              columns: 2,
              responsive: {
                lg: 2,
                m: 1,
                s: 1,
              },
            },
            properties: {
              unitConversions: {
                // type: 'object',
                title: getIntl().formatMessage({ id: 'material.sourceList.column', defaultMessage: '最小单位' }),
                'x-component': 'MiniUnit',
                // default: { minUnit: 1, unitGroup: [{ amount: 20, unitId: 1 }] }
              },
            },
          },
        },
      },
      /*联系人与负责人*/
      contactInfo: {
        type: 'object',
        'x-component': 'MellowCard',
        'x-component-props': {
          id: 'contactInfo',
          title: getIntl().formatMessage({ id: 'material.contact.title', defaultMessage: '联系信息' }),
        },
        properties: {
          layout: {
            type: 'object',
            'x-component': 'mega-layout',
            'x-component-props': {
              labelAlign: 'left',
              labelCol: 4,
              wrapperCol: 19,
              grid: true,
              autoRow: true,
              columns: 2,
              responsive: {
                lg: 2,
                m: 1,
                s: 1,
              },
            },
            properties: {
              chargeName: {
                title: getIntl().formatMessage({ id: 'material.chargeName', defaultMessage: '负责人' }),
                type: 'string',
                'x-component-props': {
                  addonAfter: '{{Requisitioner}}',
                  showSearch: true,
                },
                'x-rules': [
                  {
                    required: true,
                    message: getIntl().formatMessage({ id: 'material.chargeName.required', defaultMessage: '请输入' }),
                  },
                ],
              },
              chargeUserId: {
                title: getIntl().formatMessage({ id: 'material.chargeUserId', defaultMessage: '负责人用户id' }),
                type: 'string',
                display: false,
              },
              chargeAccount: {
                title: getIntl().formatMessage({ id: 'material.chargeAccount', defaultMessage: '负责人账号' }),
                type: 'string',
                display: false,
              },
              chargeRoleName: {
                title: getIntl().formatMessage({ id: 'material.chargeRoleName', defaultMessage: '负责人所属角色' }),
                type: 'string',
                display: false,
              },
              // 占位
              occupy: {
                title: '',
                type: 'object',
              },
              contactMemberName: {
                title: getIntl().formatMessage({ id: 'material.contactMemberName', defaultMessage: '联系人' }),
                type: 'string',
                'x-rules': [{ limitByte: true, maxByte: 40 }],
              },
              //  占位
              occupy2: {
                title: '',
                type: 'object',
              },
              contactMemberPhone: {
                title: getIntl().formatMessage({ id: 'material.contactMemberPhone', defaultMessage: '联系人电话' }),
                type: 'string',
                'x-rules': [{ limitByte: true, maxByte: 40 }],
              },
            },
          },
        },
      },
      images: {
        type: 'object',
        'x-component': 'MellowCard',
        'x-component-props': {
          id: 'images',
          title: getIntl().formatMessage({ id: 'material.images.title', defaultMessage: '物料图片' }),
        },
        properties: {
          materielPic: {
            type: 'array',
            'x-component': 'FormilyUploadFiles',
            'x-component-props': {
              children: '{{uploadContainer}}',
              customizeItemRender: '{{customizeFileItemRender}}',
              containerStyle: {
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                flexWrap: 'wrap',
              },
              multiple: true,
              beforeUpload: (file) => {
                const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
                console.log(file, isJpgOrPng)

                if (!isJpgOrPng) {
                  message.error(
                    getIntl().formatMessage({
                      id: 'material.goodsPic.validate.format',
                      defaultMessage: '仅支持JPG/PNG/JPEG格式',
                    }),
                  )
                  return Upload.LIST_IGNORE
                  // message.error(getIntl().formatMessage({ id: 'commodity.products.addProductsItem.productDescFormDefault.error.1' }));
                }
                const isLessThan = file.size / 1024 < 600
                if (!isLessThan) {
                  message.error(
                    getIntl().formatMessage({
                      id: 'material.goodsPic.validate.size',
                      defaultMessage: '图片大小小于600KB',
                    }),
                  )
                  return Upload.LIST_IGNORE
                }
                return true
              },
            },
          },
          tips: {
            type: 'object',
            'x-component': 'UploadFileTip',
          },
        },
      },
      enclosureCard: {
        type: 'object',
        'x-component': 'MellowCard',
        'x-component-props': {
          id: 'enclosure',
          title: getIntl().formatMessage({ id: 'material.enclosure.title', defaultMessage: '附件' }),
        },
        properties: {
          urls: {
            type: 'array',
            'x-component': 'FormilyUploadEnclosure',
            'x-component-props': {
              // operations: false,
              renderAddition: '{{renderAddition}}',
              // renderRemove: '{{renderListTableRemove}}',
              operations: {
                title: getIntl().formatMessage({ id: 'material.operation', defaultMessage: '操作' }),
              },
            },
            items: {
              properties: {
                file: {
                  title: getIntl().formatMessage({ id: 'material.columns.file', defaultMessage: '文件' }),
                  type: 'string',
                  'x-component': 'FileItem',
                  'x-component-props': {},
                  editable: false,
                },
                description: {
                  title: getIntl().formatMessage({ id: 'material.columns.description', defaultMessage: '备注' }),
                  type: 'string',
                  'x-rules': [
                    {
                      limitByte: true,
                      maxByte: 200,
                    },
                  ],
                },
              },
            },
          },
        },
      },
      changeCard: {
        type: 'object',
        'x-component': 'MellowCard',
        'x-component-props': {
          id: 'change',
          title: getIntl().formatMessage({ id: 'material.change.title', defaultMessage: '变更备注' }),
        },
        visible: false,
        properties: {
          layout: {
            type: 'object',
            'x-component': 'mega-layout',
            'x-component-props': {
              labelAlign: 'left',
              labelCol: 4,
              wrapperCol: 19,
              grid: true,
              autoRow: true,
              columns: 2,
              responsive: {
                lg: 2,
                m: 1,
                s: 1,
              },
            },
            properties: {
              changeRemark: {
                title: getIntl().formatMessage({ id: 'material.change.content', defaultMessage: '变更内容' }),
                type: 'textarea',
                'x-rules': [
                  {
                    limitByte: true,
                    maxByte: 200,
                  },
                ],
              },
            },
          },
        },
      },
      sourceListCard: {
        type: 'object',
        'x-component': 'MellowCard',
        'x-component-props': {
          id: 'source',
          title: getIntl().formatMessage({ id: 'material.sourceList', defaultMessage: '货源清单' }),
        },
        visible: false,
        properties: {
          layout: {
            type: 'object',
            'x-component': 'mega-layout',
            'x-component-props': {
              labelAlign: 'left',
              labelCol: 4,
              wrapperCol: 19,
              grid: true,
              autoRow: true,
              columns: 2,
              responsive: {
                lg: 2,
                m: 1,
                s: 1,
              },
            },
            properties: {
              memberId: {
                title: getIntl().formatMessage({ id: 'material.sourceList.column.memberId', defaultMessage: '会员id' }),
                type: 'string',
                display: false,
              },
              memberName: {
                title: getIntl().formatMessage({
                  id: 'material.sourceList.column.memberName',
                  defaultMessage: '会员名称',
                }),
                type: 'string',
                editable: false,
              },
              memberRoleId: {
                title: getIntl().formatMessage({
                  id: 'material.sourceList.column.memberRoleId',
                  defaultMessage: '会员角色id',
                }),
                type: 'string',
                display: false,
              },
              memberRoleName: {
                title: getIntl().formatMessage({
                  id: 'material.sourceList.column.memberRoleName',
                  defaultMessage: '会员角色名',
                }),
                type: 'string',
                display: false,
              },
              materielNo: {
                title: getIntl().formatMessage({ id: 'material.supplier.code', defaultMessage: '供应商物料编号' }),
                type: 'string',
                'x-rules': [
                  {
                    limitByte: true,
                    maxByte: 20,
                  },
                  {
                    pattern: /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*-<>])[\da-zA-Z~!@#$%^&*-<>]{3,}$/,
                    message: getIntl().formatMessage({
                      id: 'material.code.validate',
                      defaultMessage: '编号由英文（不分大小写）、数字、特殊字符组成',
                    }),
                  },
                ],
              },
              userName: {
                title: getIntl().formatMessage({ id: 'material.supplier.userName', defaultMessage: '联系人' }),
                type: 'string',
                'x-rules': [
                  {
                    limitByte: true,
                    maxByte: 24,
                  },
                ],
              },
              phone: {
                title: getIntl().formatMessage({ id: 'material.supplier.phone', defaultMessage: '联系电话' }),
                type: 'string',
                'x-rules': [
                  {
                    limitByte: true,
                    maxByte: 40,
                  },
                ],
              },
              manufacturer: {
                title: getIntl().formatMessage({ id: 'material.manufacturer', defaultMessage: '生产厂家' }),
                type: 'string',
                'x-rules': [
                  {
                    limitByte: true,
                    maxByte: 40,
                  },
                ],
              },
              origin: {
                title: getIntl().formatMessage({ id: 'material.origin', defaultMessage: '产地' }),
                type: 'string',
                'x-rules': [
                  {
                    limitByte: true,
                    maxByte: 24,
                  },
                ],
              },
              departure: {
                title: getIntl().formatMessage({ id: 'material.departure', defaultMessage: '起运地' }),
                type: 'string',
                'x-rules': [
                  {
                    limitByte: true,
                    maxByte: 40,
                  },
                ],
              },
              deliveryCycle: {
                title: getIntl().formatMessage({ id: 'material.deliveryCycle', defaultMessage: '到货周期' }),
                type: 'string',
                'x-rules': [
                  {
                    limitByte: true,
                    maxByte: 40,
                  },
                ],
              },
              deliveryMethod: {
                title: getIntl().formatMessage({ id: 'material.deliveryMethod', defaultMessage: '交货方式' }),
                type: 'string',
              },
            },
          },
        },
      },
    },
  }
  if (!schema) {
    delete compoundSchema.properties.property
  }
  return compoundSchema
}

export const propsCardSchema = (schema: ISchema): ISchema => {
  return {
    type: 'object',
    'x-component': 'MellowCard',
    'x-component-props': {
      id: 'type',
      title: getIntl().formatMessage({ id: 'material.props.title', defaultMessage: '属性信息' }),
    },
    properties: {
      layout: {
        type: 'object',
        'x-component': 'mega-layout',
        'x-component-props': {
          labelAlign: 'left',
          labelCol: 4,
          wrapperCol: 19,
          grid: true,
          autoRow: true,
          columns: 2,
          responsive: {
            lg: 2,
            m: 1,
            s: 1,
          },
        },
        properties: schema as any,
      },
    },
  }
}
