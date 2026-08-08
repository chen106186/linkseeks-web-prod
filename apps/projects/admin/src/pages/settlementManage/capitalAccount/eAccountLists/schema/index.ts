import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'

export const searchSchema: ISchema = {
  type: 'object',
  properties: {
    mageLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        topLayout: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            grid: true,
          },
          properties: {
            memberName: {
              type: 'string',
              'x-component': 'Search',
              'x-component-props': {
                placeholder: '会员名称',
                align: 'flex-left',
              },
            },
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-component-props': {
            rowStyle: {
              flexWrap: 'nowrap',
              justifyContent: 'flex-start',
            },
            colStyle: {
              marginRight: 20,
            },
          },
          properties: {
            memberType: {
              type: 'string',
              enum: [],
              'x-component-props': {
                placeholder: '请选择会员类型',
                style: {
                  width: 174,
                },
              },
            },
            memberRoleId: {
              type: 'string',
              enum: [],
              'x-component-props': {
                placeholder: '请选择会员角色',
                style: {
                  width: 174,
                },
              },
            },
            // memberLevel: {
            //   type: 'string',
            //   enum: [],
            //   "x-component-props": {
            //     placeholder: '请选择会员等级',
            //     style: {
            //       width: 174
            //     }
            //   }
            // },
            memberStatus: {
              type: 'string',
              'x-component-props': {
                placeholder: '会员状态',
                style: { width: '174px' },
              },
              enum: [
                {
                  label: '正常',
                  value: 1,
                },
                {
                  label: '已冻结',
                  value: 2,
                },
              ],
            },
            accountStatus: {
              type: 'string',
              'x-component-props': {
                placeholder: '账户状态',
                style: { width: '174px' },
              },
              enum: [
                {
                  label: '正常',
                  value: 1,
                },
                {
                  label: '已冻结',
                  value: 2,
                },
              ],
            },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: '查询',
              },
            },
          },
        },
      },
    },
  },
}

export const rechargeSchema: ISchema = {
  type: 'object',
  properties: {
    NO_SUBMIT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelAlign: 'left',
        labelCol: 24,
        wrapperCol: 24,
      },
      properties: {
        money: {
          type: 'string',
          title: '充值金额',
          'x-component-props': {
            addonBefore: '￥',
          },
          'x-rules': [
            {
              required: true,
              message: '请输入充值金额',
            },
          ],
        },

        type: {
          type: 'array:number',
          'x-component': 'CardCheckBox',
          'x-component-props': {
            dataSource: [],
            type: 'radio', // CardCheckBox 单选模式
          },
          title: '充值方式',
          'x-rules': [
            {
              required: true,
              message: '请选择充值方式',
            },
          ],
        },
      },
    },
  },
}
