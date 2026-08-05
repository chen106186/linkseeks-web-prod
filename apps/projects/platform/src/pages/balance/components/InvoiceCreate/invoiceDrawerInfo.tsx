import { createFormActions, FormMegaLayout, SchemaForm, SchemaMarkupField as Field } from '@apps/formily'
import { Button, Drawer } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { useWebIntl } from '@apps/locales'
import ArrayList from './arrayList'
import { Input, DatePicker } from '@apps/formily'
import styles from './invoiceDrawerInfo.less'
import InvoiceInfo from './invoice'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()
const formActions = createFormActions()

interface Iprops {
  visible: boolean
  onCancel: () => void
  onSubmitLoading?: boolean
  onSubmit?: (values: any) => void
  mode?: 'edit' | 'view'
  invoiceInfoData: any
}

type ProveListType = {
  number: string
  invoiceDate: string
  invoiceAmount: number
  remark: string
}

const InvoiceDrawerInfo: React.FC<Iprops> = (props: Iprops) => {
  const { visible, onCancel, invoiceInfoData, onSubmit, mode, onSubmitLoading = false } = props
  const [initialValue, setInitialValue] = useState<{ [key: string]: ProveListType }>({})
  const disabled = useMemo(() => mode === 'view', [mode])
  const translate = useWebIntl()

  const handleCancel = () => {
    onCancel?.()
  }

  const renderFooter = () => {
    return disabled ? null : (
      <div style={{ textAlign: 'right' }}>
        <Button onClick={handleCancel} style={{ marginRight: 8 }}>
          {intl.formatMessage({ id: 'balance.components.invoiceCreate.invoiceDrawer.renderFooter.button.1' })}
        </Button>
        <Button onClick={() => formActions.submit()} loading={onSubmitLoading} type="primary">
          {intl.formatMessage({ id: 'balance.components.invoiceCreate.invoiceDrawer.renderFooter.button.2' })}
        </Button>
      </div>
    )
  }

  const handleSubmit = (values) => {
    console.log(values)
    onSubmit?.(values)
  }

  useEffect(() => {
    if (invoiceInfoData) {
      const data = {}
      invoiceInfoData?.forEach((_item, index) => {
        const { proveList } = _item
        data[`list-${index}`] = proveList
      })
      setInitialValue(data)
    }
  }, [mode, invoiceInfoData])

  return (
    <Drawer
      open={visible}
      width={820}
      title={
        disabled ? translate('web.resource.balance.chakanfapiao') : intl.formatMessage({ id: 'balance.kaijufapiao' })
      }
      onClose={handleCancel}
      footer={renderFooter()}
    >
      <SchemaForm
        value={initialValue}
        onSubmit={handleSubmit}
        components={{ ArrayCustom: ArrayList, Input: Input, DatePicker, InvoiceInfo }}
        actions={formActions}
        // editable={disabled}
      >
        {invoiceInfoData?.map((_item, key) => {
          return (
            <div key={key} style={{ display: 'flex', flexDirection: 'column' }}>
              <Field
                type="object"
                x-component="InvoiceInfo"
                x-component-props={{
                  infos: _item,
                }}
              />
              <Field
                name={`list-${key}`}
                type="array"
                x-component="ArrayCustom"
                x-component-props={{
                  header: (
                    <div className={styles.header}>
                      <div className={styles['header-item']}>
                        {disabled ? (
                          translate('web.resource.balance.yuandingdanfapiaohaoma')
                        ) : (
                          <>
                            {intl.formatMessage({ id: 'balance.fapiaohaoma' })}
                            <span className={styles.required}>*</span>
                          </>
                        )}
                      </div>
                      <div className={styles['header-item']}>
                        {disabled ? (
                          translate('web.resource.balance.yuandingdankaipiaoriqi')
                        ) : (
                          <>
                            {intl.formatMessage({ id: 'balance.kaipiaoriqi' })}
                            <span className={styles.required}>*</span>
                          </>
                        )}
                      </div>
                      <div className={styles['header-item']}>
                        {disabled ? (
                          translate('web.resource.balance.yuandingdankaipiaojine')
                        ) : (
                          <>
                            {translate('web.common.currencySymbol')}
                            <span className={styles.required}>*</span>
                          </>
                        )}
                      </div>
                      <div className={styles['header-item']}>{intl.formatMessage({ id: 'balance.beizhu' })}</div>
                    </div>
                  ),
                  disabled: disabled,
                }}
              >
                <Field type="object">
                  <FormMegaLayout inline>
                    <Field
                      name="number"
                      x-component="Input"
                      x-component-props={{
                        style: {
                          width: '128px',
                        },
                        disabled: disabled,
                      }}
                      x-rules={[
                        { required: true, message: intl.formatMessage({ id: 'balance.qingtianxiefapiaohaoma' }) },
                      ]}
                    />
                    <Field
                      name="invoiceDate"
                      x-component="DatePicker"
                      x-component-props={{
                        disabled: disabled,
                        style: {
                          width: '128px',
                        },
                      }}
                      x-rules={[
                        { required: true, message: intl.formatMessage({ id: 'balance.qingtianxiekaipiaoriqi' }) },
                      ]}
                    />
                    <Field
                      name="invoiceAmount"
                      x-component="Input"
                      x-component-props={{
                        style: {
                          width: '128px',
                        },
                        disabled: disabled,
                      }}
                      x-rules={[
                        { required: true, message: intl.formatMessage({ id: 'balance.qingtianxiekaipiaojine' }) },
                      ]}
                    />
                    <Field
                      name="remark"
                      x-component="Input"
                      x-component-props={{
                        style: {
                          width: '250px',
                        },
                        disabled: disabled,
                      }}
                    />
                  </FormMegaLayout>
                </Field>
              </Field>
            </div>
          )
        })}
      </SchemaForm>
    </Drawer>
  )
}

export default InvoiceDrawerInfo
