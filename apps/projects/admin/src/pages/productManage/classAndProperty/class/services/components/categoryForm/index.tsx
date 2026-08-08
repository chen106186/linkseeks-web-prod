import React, { Fragment } from 'react'
import { Form, Input, Select } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { useCategoryContext } from '../../context'
import { validatorByte } from '@/utils/regExp'
import { SingleCardUpload } from '@apps/components'

const CategoryForm: React.FC = () => {
  const { categoryForm } = useCategoryContext()
  const intl = useIntl()

  return (
    <Fragment>
      <Form.Item
        name="name"
        label={intl.formatMessage({
          id: 'classAndProperty.class.classSchema.name',
          defaultMessage: '品类名称',
        })}
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'classAndProperty.class.classSchema.name.placeholde',
              defaultMessage: '请输入品类名称',
            }),
          },
          {
            pattern: /^(?![0-9])/,
            message: intl.formatMessage({
              id: 'classAndProperty.class.classSchema.name.placeholder.error1',
              defaultMessage: '不能数字开头',
            }),
          },
          // {
          //   pattern: /^[^`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]*$/,
          //   message: intl.formatMessage({
          //     id: 'classAndProperty.class.classSchema.name.placeholder.error2',
          //     defaultMessage: '不能包含特殊字符',
          //   }),
          // },
          {
            validator: (r, v, c) => validatorByte(r, v, c, 36),
          },
        ]}
      >
        <Input
          placeholder={intl.formatMessage({
            id: 'classAndProperty.class.classSchema.name.placeholder',
            defaultMessage: '请输入品类名称',
          })}
        />
      </Form.Item>
      <Form.Item
        name="type"
        label={intl.formatMessage({ id: 'classAndProperty.class.classSchema.type', defaultMessage: '品类类型' })}
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'classAndProperty.class.classSchema.type.placeholder',
              defaultMessage: '请选择品类类型',
            }),
          },
        ]}
      >
        <Select
          options={[
            {
              label: intl.formatMessage({
                id: 'classAndProperty.class.classSchema.type.value.1',
                defaultMessage: '实物商品',
              }),
              value: 1,
            },
            {
              label: intl.formatMessage({
                id: 'classAndProperty.class.classSchema.type.value.2',
                defaultMessage: '虚拟商品',
              }),
              value: 2,
            },
            {
              label: intl.formatMessage({
                id: 'classAndProperty.class.classSchema.type.value.3',
                defaultMessage: '服务商品',
              }),
              value: 3,
            },
            {
              label: intl.formatMessage({
                id: 'classAndProperty.class.classSchema.type.value.4',
                defaultMessage: '积分兑换商品',
              }),
              value: 4,
            },
          ]}
        />
      </Form.Item>
      <Form.Item
        name="imageUrl"
        label={intl.formatMessage({ id: 'classAndProperty.class.classSchema.imageUrl', defaultMessage: '品类图片' })}
      >
        <SingleCardUpload />
      </Form.Item>
      <Form.Item name={['category', 'id']} hidden>
        <Input />
      </Form.Item>
    </Fragment>
  )
}

export default CategoryForm
