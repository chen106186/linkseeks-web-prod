import { useIntl } from '@linkseeks/i18n'
import React, { useContext } from 'react'
import { Input, Form, Popconfirm, Button } from 'antd'
import { EditableContext } from '@/pages/transaction/components/detailLayout/components/context'

const EditableCell = ({
  title,
  operation,
  editable,
  children,
  dataIndex,
  record,
  activities,
  handleSave,
  handleDelete,
  handleSetting,
  sumTotal,
  ...restProps
}) => {
  const form = useContext(EditableContext)
  let childNode = children
  const intl = useIntl()

  const save = async () => {
    try {
      const values = await form.validateFields()
      handleSave({ ...record, ...values })
    } catch (errInfo) {}
  }

  const rate = async () => {
    try {
      let values = null
      switch (Number(activities)) {
        case 2:
          values = await form.getFieldValue('plummetPrice')
          record.activityPrice = sumTotal(record.price, values)
          break
        case 3:
          values = await form.getFieldValue('discount')
          record.activityPrice = (Number(record.price) * Number(values)) / 100
          break
      }
      console.log(values)
      handleSave({ ...record, ...values })
    } catch (errInfo) {}
  }

  const handleValidator = async (_rule, value, dataIndex) => {
    const pattern = /^(\-)?\d+(\.\d{1,4})?$/
    const plummetPrice = await form.getFieldValue('plummetPrice')
    if (!value) {
      return Promise.reject(new Error(`${intl.formatMessage({ id: 'paltformSign.mandatory' })}`))
    }
    if (
      Number(activities) === 11 &&
      dataIndex === 'activityPrice' &&
      (!pattern.test(value) || Number(value) >= Number(plummetPrice))
    ) {
      return Promise.reject(new Error(intl.formatMessage({ id: 'paltformSign.greaterThan0' })))
    }
    if (!pattern.test(value) || Number(value) >= Number(record.price)) {
      return Promise.reject(new Error(intl.formatMessage({ id: 'paltformSign.greaterThan0LessThanProductPrice' })))
    }
    return Promise.resolve()
  }

  /** 编辑按钮 */
  if (editable) {
    switch (dataIndex) {
      case 'activityPrice':
      case 'plummetPrice':
        childNode = (
          <Form.Item
            style={{
              margin: 0,
            }}
            name={dataIndex}
            initialValue={record[dataIndex]}
            rules={[
              {
                required: true,
                validator: (_rule, value) => handleValidator(_rule, value, dataIndex),
              },
            ]}
          >
            <Input
              style={{ width: '112px' }}
              addonBefore={intl.formatMessage({ id: 'common.money' })}
              onPressEnter={rate}
              onBlur={rate}
            />
          </Form.Item>
        )
        break
      case 'restrictNum':
        childNode = (
          <Form.Item
            style={{
              margin: 0,
            }}
            name={dataIndex}
            initialValue={record[dataIndex]}
            rules={[
              {
                required: true,
                validator: async (_rule, value) => {
                  const pattern = /^(\-)?\d+(\.\d{1,3})?$/
                  const restrictTotalNum = await form.getFieldValue('restrictTotalNum')
                  if (!value) {
                    return Promise.reject(new Error(`${intl.formatMessage({ id: 'paltformSign.mandatory' })}`))
                  }
                  if (!pattern.test(value) || !(Number(value) <= Number(restrictTotalNum))) {
                    return Promise.reject(new Error(intl.formatMessage({ id: 'paltformSign.personLimitAmount' })))
                  }
                  return Promise.resolve()
                },
              },
            ]}
          >
            <Input style={{ width: '112px' }} onPressEnter={save} onBlur={save} />
          </Form.Item>
        )
        break
      case 'restrictTotalNum':
        childNode = (
          <Form.Item
            style={{
              margin: 0,
            }}
            name={dataIndex}
            initialValue={record[dataIndex]}
            rules={[
              {
                required: true,
                validator: (_rule, value) => {
                  const pattern = /^(\-)?\d+(\.\d{1,3})?$/
                  if (!value) {
                    return Promise.reject(new Error(`${intl.formatMessage({ id: 'paltformSign.mandatory' })}`))
                  }
                  if (!pattern.test(value)) {
                    return Promise.reject(
                      new Error(intl.formatMessage({ id: 'paltformSign.totalNumberActivitiesGreaterThan0' })),
                    )
                  }
                  return Promise.resolve()
                },
              },
            ]}
          >
            <Input style={{ width: '112px' }} onPressEnter={save} onBlur={save} />
          </Form.Item>
        )
        break
      case 'discount':
        childNode = (
          <Form.Item
            style={{
              margin: 0,
            }}
            name={dataIndex}
            initialValue={record[dataIndex]}
            rules={[
              {
                required: true,
                validator: (_rule, value) => {
                  const pattern = /^(\-)?\d+(\.\d{1,2})?$/
                  if (!value) {
                    return Promise.reject(new Error(`${intl.formatMessage({ id: 'paltformSign.mandatory' })}`))
                  }
                  if (!pattern.test(value)) {
                    return Promise.reject(new Error(intl.formatMessage({ id: 'paltformSign.DiscountGreaterThan0' })))
                  }
                  return Promise.resolve()
                },
              },
            ]}
          >
            <Input
              style={{ width: '112px' }}
              addonBefore={intl.formatMessage({ id: 'paltformSign.fold' })}
              onPressEnter={rate}
              onBlur={rate}
            />
          </Form.Item>
        )
    }
  }
  /** 操作按钮 */
  if (operation) {
    switch (Number(activities)) {
      case 6:
        childNode = (
          <>
            <Button type="link" onClick={() => handleSetting(record)}>
              {intl.formatMessage({ id: 'paltformSign.setTheGift' })}
            </Button>
            <Popconfirm
              title={intl.formatMessage({ id: 'paltformSign.ifDelete' })}
              onConfirm={() => handleDelete(record.id)}
            >
              <Button type="link">{intl.formatMessage({ id: 'paltformSignelete' })}</Button>
            </Popconfirm>
          </>
        )
        break
      case 15:
        childNode = (
          <>
            <Button type="link" onClick={() => handleSetting(record)}>
              {intl.formatMessage({ id: 'paltformSign.setTheCollocation' })}
            </Button>
            <Popconfirm
              title={intl.formatMessage({ id: 'paltformSign.ifDelete' })}
              onConfirm={() => handleDelete(record.id)}
            >
              <Button type="link">{intl.formatMessage({ id: 'paltformSignelete' })}</Button>
            </Popconfirm>
          </>
        )
        break
      default:
        childNode = (
          <Popconfirm
            title={intl.formatMessage({ id: 'paltformSign.ifDelete' })}
            onConfirm={() => handleDelete(record.id)}
          >
            <a>{intl.formatMessage({ id: 'paltformSignelete' })}</a>
          </Popconfirm>
        )
        break
    }
  }

  return <td {...restProps}>{childNode}</td>
}
export default EditableCell
