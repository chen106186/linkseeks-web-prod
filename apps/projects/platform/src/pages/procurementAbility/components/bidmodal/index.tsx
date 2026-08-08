import React, { useEffect, useRef } from 'react'
import ModalForm from '@/components/ModalForm'
import style from './index.less'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { createAsyncFormActions } from '@apps/formily'
import { postPurchaseConfirmQuotedPriceStayConfirmAwardResult } from '@apps/apis'

const schemaActions = createAsyncFormActions()

const intl = getIntl()

export interface BidProps {
  bid: any
  visible: boolean
  cancel?()
}

const Bidmodal: React.FC<BidProps> = (props: any) => {
  const { bid, visible, cancel } = props

  const ref = useRef<any>({})
  const [confirmLoading, setConfirmLoading] = React.useState(false)
  const handleConfirm = () => {
    schemaActions.submit()
  }

  const handleSubmit = (value) => {
    // 提交重置
    const params: any = {
      id: bid.id,
      state: 1,
      prizeNotice: value.prizeNotice ? 1 : 0,
      thank: value.thank ? 1 : 0,
      notice: value.notice ? 1 : 0,
    }
    if (value.prizeNotice || value.notice) {
      params.awardResults = value.awardResults
    }
    if (value.thank) {
      params.content = value.content
    }
    setConfirmLoading(true)
    postPurchaseConfirmQuotedPriceStayConfirmAwardResult({ ...params })
      .then((res) => {
        if (res.code !== 1000) {
          setConfirmLoading(false)
          return
        }
        history.goBack()
      })
      .catch((error) => {
        setConfirmLoading(false)
        console.warn(error)
      })
  }

  useEffect(() => {
    if (visible) {
      ref.current.setVisible(true)
      bid.awardResults && schemaActions.setFieldValue('awardResults', bid.awardResults)
      bid.content && schemaActions.setFieldValue('content', bid.content)
    }
  }, [visible, bid])

  const handleCancel = () => {
    ref.current.setVisible(false)
    cancel()
  }

  return (
    <ModalForm
      width={800}
      modalTitle={intl.formatMessage({ id: 'table.purchase.result' })}
      actions={schemaActions}
      currentRef={ref}
      modalProps={{
        className: style.wrap,
        confirmLoading: confirmLoading,
      }}
      schema={{
        type: 'object',
        properties: {
          LAYOUT_WRAP: {
            type: 'object',
            'x-component': 'mega-layout',
            'x-component-props': {
              labelAlign: 'top',
            },
            properties: {
              tabs: {
                type: 'object',
                'x-component': 'tab',
                'x-component-props': {
                  tabPosition: 'left',
                },
                properties: {
                  tab1: {
                    type: 'object',
                    'x-component': 'tabpane',
                    'x-component-props': {
                      tab: intl.formatMessage({ id: 'detail.purchase.awardResults' }),
                    },
                    properties: {
                      LAYOUT_TABPANE: {
                        type: 'object',
                        'x-component': 'mega-layout',
                        'x-component-props': {
                          grid: true,
                          enableSafeWidth: false,
                        },
                        properties: {
                          prizeNotice: {
                            type: 'number',
                            'x-component-props': {
                              children: `${intl.formatMessage({ id: 'detail.purchase.send' })}${intl.formatMessage({
                                id: 'detail.purchase.awardResults',
                              })}`,
                            },
                            'x-component': 'checkboxsingle',
                            default: true,
                          },
                          notice: {
                            type: 'number',
                            'x-component-props': {
                              children: `${intl.formatMessage({ id: 'detail.purchase.send' })}${intl.formatMessage({
                                id: 'detail.purchase.bidLayout1',
                              })}`,
                            },
                            'x-component': 'checkboxsingle',
                            default: true,
                          },
                        },
                      },
                      awardResults: {
                        type: 'string',
                        'x-component': 'TextArea',
                        'x-component-props': {
                          rows: 4,
                        },
                      },
                    },
                  },
                  tab2: {
                    type: 'object',
                    'x-component': 'tabpane',
                    'x-component-props': {
                      tab: intl.formatMessage({ id: 'detail.purchase.thanks' }),
                    },
                    properties: {
                      LAYOUT_TABPANE: {
                        type: 'object',
                        'x-component': 'mega-layout',
                        'x-component-props': {
                          grid: true,
                          enableSafeWidth: false,
                        },
                        properties: {
                          thank: {
                            type: 'number',
                            'x-component-props': {
                              children: `${intl.formatMessage({ id: 'detail.purchase.send' })}${intl.formatMessage({
                                id: 'detail.purchase.thanks',
                              })}`,
                            },
                            'x-component': 'checkboxsingle',
                            default: true,
                          },
                        },
                      },
                      content: {
                        type: 'string',
                        'x-component': 'TextArea',
                        'x-component-props': {
                          rows: 4,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }}
      cancel={handleCancel}
      confirm={handleConfirm}
      onSubmit={handleSubmit}
    />
  )
}
export default Bidmodal
