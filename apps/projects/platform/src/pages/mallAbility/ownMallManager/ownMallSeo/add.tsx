/*
 * @Author: Crayon
 * @Date: 2021-09-28 13:55:40
 * @LastEditTime: 2021-10-19 14:30:13
 * @LastEditors: Crayon
 * @Description: 自营商城seo信息新增/修改
 * @FilePath: \lingxi-business-paltform\src\pages\ownMall\ownMallManager\ownMallSeo\add.tsx
 */
import { useEffect, useState } from 'react'
import { Form, Button, Select, Input, Tooltip, Typography, Row, Col } from 'antd'
import { Card } from '@linkseeks/ui'
import { RequireItem } from '@apps/components'
import { usePageStatus } from '@/hooks/usePageStatus'
import { history } from '@linkseeks/router-manager'
import { usePrompt, useLocation } from '@linkseeks/router-core'
import { useIntl, getIntl } from '@linkseeks/i18n'
import { QuestionCircleOutlined, SaveOutlined } from '@ant-design/icons'
import { validatorByte } from '@/utils/regExp'
import { PageHeaderWrapper } from '@apps/components'
import { PAGE_TYPE, PAGE_TYPE_OPTIONS } from './constant'
import { DOORTYPE } from '@/constants/procurement'
import { getCommodityWebSeoWebGet, postCommodityWebSeoWebAdd, postCommodityWebSeoWebUpdate } from '@apps/apis'
import styles from './index.less'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'

const layout: any = {
  colon: false,
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
  labelAlign: 'left',
}

const tabLink = [
  { key: '1', label: getIntl().formatMessage({ id: 'shop.seo.tab.basic' }) },
  { key: '2', label: getIntl().formatMessage({ id: 'shop.seo.tab.seo' }) },
]

const SeoAdd = () => {
  const { pathname } = useLocation()
  const { id } = usePageStatus()
  const intl = useIntl()

  const isView = pathname.indexOf('detail') > 0

  const title = id
    ? isView
      ? getIntl().formatMessage({ id: 'own.seo.check' })
      : getIntl().formatMessage({ id: 'own.seo.edit' })
    : getIntl().formatMessage({ id: 'own.seo.add' })

  const [form] = Form.useForm()

  const [saveLoading, setSaveLoading] = useState<boolean>(false)
  const [isFormChange, setIsFormChange] = useState<boolean>(false)

  usePrompt({
    when: isFormChange,
    message: intl.formatMessage({
      id: 'common.tip.save.confirm',
      defaultMessage: '您还有未保存的内容，是否确定要离开？',
    }),
  })

  // 提交
  const onSave = () => {
    form.validateFields().then((values) => {
      const params = {
        id,
        name: PAGE_TYPE[values.type],
        doorType: DOORTYPE.OWN_DOORTYPE, // 门户类型：1-店铺门户  2-渠道门户  3-采购门户  4-自营门户
        ...values,
      }
      setSaveLoading(true)
      const requestApi = id ? postCommodityWebSeoWebUpdate : postCommodityWebSeoWebAdd
      requestApi(params)
        .then((res) => {
          if (res.code === 1000) {
            setIsFormChange(false)
            setTimeout(() => {
              history.goBack()
            }, 500)
          } else {
            setSaveLoading(false)
          }
        })
        .catch(() => {
          setSaveLoading(false)
        })
    })
  }

  useEffect(() => {
    if (id) {
      getCommodityWebSeoWebGet({ id }).then((res) => {
        if (res.code === 1000) {
          form.setFieldsValue(res.data)
        }
      })
    }
  }, [])

  return (
    <PageHeaderWrapper
      items={tabLink}
      extra={
        !isView
          ? [
              // <AuthButton type="custom" code={id ? 'edit' : 'add'}>
              <Button key="1" type="primary" icon={<SaveOutlined />} onClick={onSave} loading={saveLoading}>
                {intl.formatMessage({ id: 'common.button.save' })}
              </Button>,
              // </AuthButton>,
            ]
          : null
      }
    >
      <Form {...layout} form={form} onValuesChange={() => setIsFormChange(true)}>
        <Card
          id="1"
          title={intl.formatMessage({ id: 'shop.seo.tab.basic' })}
          style={{ marginBottom: 16, marginTop: 16 }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label={
                  <RequireItem style={{ width: 'auto ' }} label={intl.formatMessage({ id: 'own.seo.form.type' })} />
                }
                rules={[{ required: true, message: intl.formatMessage({ id: 'own.seo.form.type.required' }) }]}
              >
                <Select options={PAGE_TYPE_OPTIONS} disabled={isView} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="link"
                label={
                  <RequireItem
                    style={{ width: 'auto ' }}
                    label={intl.formatMessage({ id: 'shop.seo.table.link' })}
                    brief={
                      <Tooltip placement="top" title={intl.formatMessage({ id: 'shop.seo.table.link.tip' })}>
                        <QuestionCircleOutlined />
                      </Tooltip>
                    }
                  />
                }
              >
                <Input addonBefore={<Typography.Text type="secondary">http://</Typography.Text>} disabled={isView} />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Card id="2" title={intl.formatMessage({ id: 'shop.seo.tab.seo' })}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label={
                  <RequireItem
                    style={{ width: 'auto ' }}
                    label={intl.formatMessage({ id: 'shop.seo.table.title' })}
                    brief={
                      <Tooltip placement="top" title={intl.formatMessage({ id: 'shop.seo.table.title.tip' })}>
                        <QuestionCircleOutlined />
                      </Tooltip>
                    }
                  />
                }
                rules={[
                  { required: true, message: intl.formatMessage({ id: 'shop.seo.form.title.required' }) },
                  { validator: (r, v, c) => validatorByte(r, v, c, 100) },
                ]}
              >
                <Input
                  placeholder={`${intl.formatMessage({ id: 'common.text.longest' })}100${intl.formatMessage({
                    id: 'common.unit.individual.character',
                  })}, 50${intl.formatMessage({ id: 'common.unit.individual.chinese' })}`}
                  disabled={isView}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="description"
                label={
                  <RequireItem
                    style={{ width: 'auto ' }}
                    label={intl.formatMessage({ id: 'shop.seo.table.description' })}
                    brief={
                      <Tooltip placement="top" title={intl.formatMessage({ id: 'shop.seo.table.description.tip' })}>
                        <QuestionCircleOutlined />
                      </Tooltip>
                    }
                  />
                }
                rules={[
                  { required: true, message: intl.formatMessage({ id: 'shop.seo.form.description.required' }) },
                  { validator: (r, v, c) => validatorByte(r, v, c, 400) },
                ]}
              >
                <Input.TextArea
                  rows={1}
                  placeholder={`${intl.formatMessage({ id: 'common.text.longest' })}400${intl.formatMessage({
                    id: 'common.unit.individual.character',
                  })}, 200${intl.formatMessage({ id: 'common.unit.individual.chinese' })}`}
                  disabled={isView}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="keywords"
                label={
                  <RequireItem
                    style={{ width: 'auto ' }}
                    label={intl.formatMessage({ id: 'shop.seo.table.keywords' })}
                    brief={
                      <Tooltip placement="top" title={intl.formatMessage({ id: 'shop.seo.table.keywords.tip' })}>
                        <QuestionCircleOutlined />
                      </Tooltip>
                    }
                  />
                }
                rules={[
                  { required: true, message: intl.formatMessage({ id: 'shop.seo.form.keywords.required' }) },
                  { validator: (r, v, c) => validatorByte(r, v, c, 200) },
                ]}
              >
                <Input.TextArea
                  rows={1}
                  placeholder={intl.formatMessage({ id: 'handling.zuichang200gezifu100ge' })}
                  disabled={isView}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
    </PageHeaderWrapper>
  )
}

export default SeoAdd
