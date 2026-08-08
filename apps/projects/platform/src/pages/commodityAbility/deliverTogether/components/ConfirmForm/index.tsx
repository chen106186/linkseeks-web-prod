import { Form, Input, Radio, Row, Col } from 'antd'
import { DatePickerSelect } from '@/components/DatePickerSelect'
import AddressSelect from '@/components/AddressSelect'
import UploadFiles from '@/components/UploadFiles/UploadFiles'
import { PATTERN_MAPS } from '@/constants/regExp'
import styles from './index.less'
import SelectPersonModal from '../SelectPersonModal'
import { useIntl } from '@linkseeks/i18n'

const { Item: FormItem } = Form
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
}

const ConfirmForm = (props) => {
  const { onChangeRadio, form, radioValueList, radioValue, getAddressListApi, initialValues } = props
  const intl = useIntl()

  return (
    <Form form={form} initialValues={initialValues} {...formItemLayout} labelAlign="left">
      <FormItem
        label={intl.formatMessage({
          id: 'customerAbility.songyang.detail.anchor_8',
          defaultMessage: '寄样确认',
        })}
        name="agree"
        rules={[{ required: true }]}
      >
        <Radio.Group className={styles.resetRadio} onChange={onChangeRadio}>
          {radioValueList.map((item) => (
            <Radio key={item.value} value={item.value}>
              {item.text}
            </Radio>
          ))}
        </Radio.Group>
      </FormItem>
      {radioValue == 1 ? (
        <>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem
                label={intl.formatMessage({
                  id: 'customerAbility.songyang.detail.label.sender',
                  defaultMessage: '寄样人',
                })}
                name="name"
                rules={[{ required: true }]}
              >
                <SelectPersonModal
                  title={intl.formatMessage({
                    id: 'customerAbility.songyang.title.sender',
                    defaultMessage: '选择寄样人',
                  })}
                  value={initialValues.name}
                  onChangeSelect={(e) => {
                    form.setFieldsValue({
                      name: e.name,
                      phone: e.phone,
                    })
                  }}
                />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                label={intl.formatMessage({
                  id: 'customerAbility.songyang.detail.label.logisticsNo',
                  defaultMessage: '物流单号',
                })}
                name="logisticsNo"
              >
                <Input
                  placeholder={intl.formatMessage({
                    id: 'customerAbility.songyang.logisticsNo.placeholder',
                    defaultMessage: '最长30个字符',
                  })}
                  maxLength={30}
                />
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem
                label={intl.formatMessage({
                  id: 'customerAbility.songyang.detail.label.phone',
                  defaultMessage: '联系电话',
                })}
                name="phone"
                rules={[
                  { required: true },
                  {
                    pattern: PATTERN_MAPS.phone,
                    message: intl.formatMessage({
                      id: 'customerAbility.songyang.phone.rules',
                      defaultMessage: '手机号是否正确',
                    }),
                  },
                ]}
              >
                <Input />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                label={intl.formatMessage({
                  id: 'customerAbility.songyang.detail.label.remark',
                  defaultMessage: '备注',
                })}
                name="remark"
              >
                <Input.TextArea
                  placeholder={intl.formatMessage({
                    id: 'customerAbility.songyang.remark.placeholder',
                    defaultMessage: '最长200个汉字',
                  })}
                  maxLength={200}
                  rows={1}
                />
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem
                label={intl.formatMessage({
                  id: 'customerAbility.songyang.detail.label.estimatedDeliveryTime',
                  defaultMessage: '预计送达时间',
                })}
                name="estimatedDeliveryTime"
                rules={[{ required: true }]}
              >
                <DatePickerSelect formProp={form} defualtToday={true} className="w-full" />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                label={intl.formatMessage({
                  id: 'customerAbility.songyang.detail.label.file',
                  defaultMessage: '附件',
                })}
                name="attachmentsData"
              >
                <UploadFiles />
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem
                label={intl.formatMessage({
                  id: 'customerAbility.songyang.detail.label.sendAddress',
                  defaultMessage: '退样地址',
                })}
                name="address"
                rules={[{ required: true }]}
              >
                <AddressSelect
                  addressType={1}
                  onChange={(value) => {
                    form.setFieldsValue({ address: value })
                  }}
                  isDefaultAddress={true}
                  value={form.getFieldValue('address')}
                  editAddressFromType="modal"
                  getAddressListApi={getAddressListApi}
                  dreawTitleTextId="customerAbility.songyang.managementAddressTitle"
                  createTitleTextId="customerAbility.songyang.createAddress"
                  placeholder={intl.formatMessage({
                    id: 'customerAbility.songyang.address.placeholder',
                    defaultMessage: '选择退样地址',
                  })}
                />
              </FormItem>
            </Col>
          </Row>
        </>
      ) : (
        <Row>
          <Col span={16}>
            <FormItem
              label={intl.formatMessage({
                id: 'customerAbility.songyang.detail.label.reason',
                defaultMessage: '拒绝原因',
              })}
              name="reason"
              rules={[{ required: true }]}
            >
              <Input.TextArea
                placeholder={intl.formatMessage({
                  id: 'customerAbility.songyang.reason.placeholder',
                  defaultMessage: '最长300个汉字',
                })}
                maxLength={300}
                rows={1}
              />
            </FormItem>
          </Col>
        </Row>
      )}
    </Form>
  )
}

export default ConfirmForm
