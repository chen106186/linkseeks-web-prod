import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { getCurrentInstance, showLoading, hideLoading, setNavigationBarTitle } from '@apps/mobile-services/utils/taro'
import { View, Button, Text, Input, ScrollView, Switch, Form, Toast } from '@apps/mobile-ui'
import { getAsyncStorage } from '@apps/mobile-services/utils/storage'
import { USER_INFO } from '@/constants/storage'
import { PATTERN_MAPS } from '@/constants/regExp'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import { useMobileIntl } from '@apps/locales'
import {
  getSettlementMobileInvoiceMessageDetails,
  postSettlementMobileInvoiceMessageAdd,
  postSettlementMobileInvoiceMessageUpdate,
} from '@apps/apis'
import styles from './index.module.scss'
interface formItemsProps {
  invoiceTitle: string // 发票抬头
  taxNo: string // 纳税号
  bankOfDeposit: string // 开户行
  account: string // 账号
  tel: string // 电话号码
  address: string // 地址
}
const InvoiceAdd = (props: any) => {
  const route = {
    params: getCurrentInstance().preloadData || {},
  }
  const { refresh } = route.params
  const intl = useIntl()
  const translate = useMobileIntl()

  const tag = [
    intl.formatMessage({
      id: 'invoice_company',
      defaultMessage: '企业',
    }),
    intl.formatMessage({
      id: 'invoice_person',
      defaultMessage: '个人',
    }),
  ]
  const tag1 = [
    intl.formatMessage({
      id: 'VAT_general_invoice',
      defaultMessage: '增值税普通发票',
    }),
    intl.formatMessage({
      id: 'VAT_special_invoice',
      defaultMessage: '增值税专用发票',
    }),
  ]
  const [Index, setIndex] = useState<number>(0)
  const [Index1, setIndex1] = useState<number>(0)
  const [formItems, setFormItems] = useState<formItemsProps>({
    invoiceTitle: '',
    // 发票抬头
    taxNo: '',
    // 纳税号
    bankOfDeposit: '',
    // 开户行
    account: '',
    // 账号
    tel: '',
    // 电话号码
    address: '', // 地址
  })
  const [isSwitch, setIsSwitch] = useState(false)
  const enterprise = () => {
    const required = Index1 === 1 && Index === 0
    return (
      <>
        <View className={styles['form-item']}>
          <Text className={cx(styles['title'], styles['margin'])}>
            {intl.formatMessage({
              id: 'invoice_bank',
              defaultMessage: '开户行',
            })}
            {required && <Text className={styles.required}>*</Text>}
          </Text>
          <Input
            placeholder={intl.formatMessage({
              id: 'invoice_bank_please',
              defaultMessage: '请填写开户行',
            })}
            placeholderTextColor="#C8CACD"
            name="bankOfDeposit"
            maxlength={40}
            value={formItems.bankOfDeposit}
            className={cx(styles['title'], styles['input-wrap'])}
            style={{
              borderBottomColor: '#F4F5F7',
            }}
            onChange={(e) => changeInputValue('bankOfDeposit', e)}
          />
        </View>
        <View className={styles['form-item']}>
          <Text className={cx(styles['title'], styles['margin'])}>
            {intl.formatMessage({
              id: 'invoice_account',
              defaultMessage: '账号',
            })}
            {required && <Text className={styles.required}>*</Text>}
          </Text>
          <Input
            placeholder={intl.formatMessage({
              id: 'invoice_account_please',
              defaultMessage: '请填写对应的银行卡号',
            })}
            placeholderTextColor="#C8CACD"
            name="account"
            maxlength={20}
            value={formItems.account}
            className={cx(styles['title'], styles['input-wrap'])}
            style={{
              borderBottomColor: '#F4F5F7',
            }}
            onChange={(e) => changeInputValue('account', e)}
          />
        </View>
        <View className={styles['form-item']}>
          <Text className={cx(styles['title'], styles['margin'])}>
            {intl.formatMessage({
              id: 'invoice_address',
              defaultMessage: '地址',
            })}
            {required && <Text className={styles.required}>*</Text>}
          </Text>
          <Input
            placeholder={intl.formatMessage({
              id: 'invoice_address_please',
              defaultMessage: '请填写收取发票的地址',
            })}
            placeholderTextColor="#C8CACD"
            name="address"
            className={cx(styles['title'], styles['input-wrap'])}
            maxlength={80}
            value={formItems.address}
            style={{
              borderBottomColor: '#F4F5F7',
            }}
            onChange={(e) => changeInputValue('address', e)}
          />
        </View>
        <View className={styles['form-item']}>
          <Text className={cx(styles['title'], styles['margin'])}>
            {intl.formatMessage({
              id: 'invoice_tel',
              defaultMessage: '电话号码',
            })}
            {required && <Text className={styles.required}>*</Text>}
          </Text>
          <Input
            placeholder={intl.formatMessage({
              id: 'invoice_tel_please',
              defaultMessage: '请填写收取发票的电话号码',
            })}
            placeholderTextColor="#C8CACD"
            name="tel"
            value={formItems.tel}
            className={cx(styles['title'], styles['input-wrap'])}
            style={{
              borderBottomColor: '#F4F5F7',
            }}
            onChange={(e) => changeInputValue('tel', e)}
          />
        </View>
      </>
    )
  }
  /* 添加 */
  const add = (GetData: any) => {
    showLoading({
      title: '',
      mask: true,
    })
    postSettlementMobileInvoiceMessageAdd(GetData)
      .then((res: any) => {
        hideLoading()
        if (res.code === 1000) {
          Toast.show({
            title: intl.formatMessage({
              id: 'create_success',
              defaultMessage: '新增成功',
            }),
          })
          Router.navigateBack()
          if (refresh) {
            refresh()
          }
        } else {
          Toast.show({
            title: intl.formatMessage({
              id: `${res.code}`,
              defaultMessage: res.message,
            }),
          })
        }
      })
      .catch(() => {
        hideLoading()
      })
  }
  /* 修改 */
  const update = (GetData: any) => {
    showLoading({
      title: '',
      mask: true,
    })
    postSettlementMobileInvoiceMessageUpdate(GetData)
      .then((res: any) => {
        hideLoading()
        if (res.code === 1000) {
          Toast.show({
            title: intl.formatMessage({
              id: 'edit_success',
              defaultMessage: '修改成功',
            }),
          })
          Router.navigateBack()
          if (refresh) {
            refresh()
          }
        } else {
          Toast.show({
            title: intl.formatMessage({
              id: `${res.code}`,
              defaultMessage: res.message,
            }),
          })
        }
      })
      .catch(() => {
        hideLoading()
      })
  }
  /* 提交 */
  const handleSubmit = () => {
    const param = formItems
    let GetData: any
    if (!param.invoiceTitle || (param.invoiceTitle && param.invoiceTitle.replace(/\s/g, '') === '')) {
      Toast.show({
        title: intl.formatMessage({
          id: 'invoiceTitle_please',
          defaultMessage: '请输入填写发票抬头',
        }),
        icon: 'none',
      })
      return
    }
    if (Index === 0 && (!param.taxNo || (param.taxNo && param.taxNo.replace(/\s/g, '') === ''))) {
      Toast.show({
        title: intl.formatMessage({
          id: 'taxNo_please',
          defaultMessage: '请输入纳税号',
        }),
        icon: 'none',
      })
      return
    }

    if (Index1 === 1 && Index === 0) {
      if (!param.bankOfDeposit) {
        Toast.show({
          title: translate('mobile.resource.user.qingshurukaihuhang'),
          icon: 'none',
        })
        return
      }

      if (!param.account) {
        Toast.show({
          title: translate('mobile.resource.user.qingshuruzhanghao'),
          icon: 'none',
        })
        return
      }

      if (!param.address) {
        Toast.show({
          title: translate('mobile.resource.user.qingshurudizhi'),
          icon: 'none',
        })
        return
      }

      if (!param.tel) {
        Toast.show({
          title: translate('mobile.resource.user.qingshurudianhuahaoma'),
          icon: 'none',
        })
        return
      }
    }

    if (param.tel && !PATTERN_MAPS.tel.test(param.tel)) {
      Toast.show({
        title: intl.formatMessage({
          id: 'tel_please',
          defaultMessage: '请输入正常电话号码,格式为:020-12345678',
        }),
        icon: 'none',
      })
    } else {
      const ResData = {
        type: Index === 0 ? 1 : 2,
        kind: Index1 === 0 ? 1 : 2,
        isDefault: isSwitch ? 1 : 0,
      }

      // return;
      if (route.params.id) {
        GetData = Object.assign(formItems, ResData)
        GetData.id = route.params.id
        update(GetData)
      } else {
        GetData = Object.assign(formItems, ResData)
        add(GetData)
      }
    }
  }
  /* details */
  const details = (id: string) => {
    getSettlementMobileInvoiceMessageDetails({
      id,
    }).then((res: any) => {
      if (res.code === 1000) {
        setIndex(res.data.type === 1 ? 0 : 1)
        setIndex1(res.data.kind === 1 ? 0 : 1)
        setFormItems(res.data)
        const flag: boolean = !!res.data.isDefault
        setIsSwitch(!!flag)
      }
    })
  }
  const setKey = (index: any) => {
    setIndex(index)
    if (index != 1 && route.params.id) {
      getSettlementMobileInvoiceMessageDetails({
        id: route.params.id,
      }).then((res: any) => {
        if (res.code === 1000) {
          setIndex1(res.data.kind === 1 ? 0 : 1)
          setFormItems(res.data)
          const flag: boolean = !!res.data.isDefault
          setIsSwitch(!!flag)
        }
      })
    }
  }
  const mold = () => (
    <View className={styles['inner']}>
      <Text className={styles['title']}>
        {intl.formatMessage({
          id: 'invoice_type',
          defaultMessage: '开具类型',
        })}
      </Text>
      <View className={styles['invoice-type']}>
        {tag1.map((item: any, index: number) => {
          return (
            <View
              key={String(index)}
              onClick={() => setIndex1(index)}
              className={cx(styles['tag-item'], Index1 === index ? styles['tag-active'] : styles['tag-bg'])}
            >
              <Text
                className={cx(
                  styles['tag-item-text'],
                  Index1 === index ? styles['tag-active-text'] : styles['tag-bg-text'],
                )}
              >
                {item}
              </Text>
            </View>
          )
        })}
      </View>
    </View>
  )
  /* 获取用户信息 */
  const getUserInfo = async () => {
    await getAsyncStorage(USER_INFO).then((res: any) => {
      if (res == null) {
        Router.navigateTo('user/login')
      }
      setFormItems({
        ...formItems,
        invoiceTitle: res.company,
      })
    })
  }

  // input 输入写入
  const changeInputValue = (key: string, value: any) => {
    setFormItems({
      ...formItems,
      [key]: value,
    })
  }
  useEffect(() => {
    if (route.params.id) {
      details(route.params.id) // 查询详情接
    } else {
      getUserInfo()
    }
    setNavigationBarTitle({
      title: `${
        route.params.id
          ? intl.formatMessage({
              id: 'invoice_edit',
              defaultMessage: '修改发票',
            })
          : intl.formatMessage({
              id: 'invoice_create',
              defaultMessage: '新增发票',
            })
      }`,
    })
  }, [])
  return (
    <View className={styles['invoice-container']}>
      <ScrollView className={styles['main']}>
        <Form className={styles['warp']}>
          {/* 发票类型 */}
          <View className={styles['inner']}>
            <Text className={styles['title']}>
              {intl.formatMessage({
                id: 'issuance_type',
                defaultMessage: '开具类型',
              })}
            </Text>
            <View className={styles['invoice-type']}>
              {tag.map((item: any, index: number) => {
                return (
                  <View
                    key={String(index)}
                    onClick={() => setKey(index)}
                    className={cx(styles['tag-item'], Index === index ? styles['tag-active'] : styles['tag-bg'])}
                  >
                    <Text
                      className={cx(
                        styles['tag-item-text'],
                        Index === index ? styles['tag-active-text'] : styles['tag-bg-text'],
                      )}
                    >
                      {item}
                    </Text>
                  </View>
                )
              })}
            </View>
          </View>
          {/* 种类 */}
          {Index === 0 ? mold() : <></>}
          <View className={styles['form-item']}>
            <Text className={cx(styles['title'], styles['margin'])}>
              {intl.formatMessage({
                id: 'invoiceTitle',
                defaultMessage: '发票抬头',
              })}
              <Text className={styles.required}>*</Text>
            </Text>
            <Input
              placeholder={intl.formatMessage({
                id: 'invoiceTitle_please',
                defaultMessage: '请输入填写发票抬头',
              })}
              placeholderTextColor="#C8CACD"
              className={cx(styles['title'], styles['input-wrap'])}
              name="invoiceTitle"
              maxlength={40}
              value={formItems.invoiceTitle}
              style={{
                borderBottomColor: '#F4F5F7',
              }}
              onChange={(e) => changeInputValue('invoiceTitle', e)}
            />
          </View>
          <View className={styles['form-item']}>
            <Text className={cx(styles['title'], styles['margin'])}>
              {intl.formatMessage({
                id: 'taxNo',
                defaultMessage: '纳税号',
              })}
              {Index === 0 && <Text className={styles.required}>*</Text>}
            </Text>
            <Input
              placeholder={intl.formatMessage({
                id: 'taxNo_please',
                defaultMessage: '请输入纳税号',
              })}
              placeholderTextColor="#C8CACD"
              name="taxNo"
              maxlength={20}
              value={formItems.taxNo}
              className={cx(styles['title'], styles['input-wrap'])}
              style={{
                borderBottomColor: '#F4F5F7',
              }}
              onChange={(e) => changeInputValue('taxNo', e)}
            />
          </View>
          {enterprise()}
          <View className={cx(styles['from-item'], styles['justify-content'], styles['clear'], styles['set-defulet'])}>
            <Text className={cx(styles['title'], styles['margin'])}>
              {intl.formatMessage({
                id: 'set_default',
                defaultMessage: '设为默认',
              })}
            </Text>
            <View className={cx(styles['switch-btn'], styles['fl-right'])}>
              <Switch color="#00A98F" checked={isSwitch} onChange={() => setIsSwitch(!isSwitch)} />
            </View>
          </View>
        </Form>
      </ScrollView>
      <View className={styles['invoicebtn-group']}>
        <Button onClick={handleSubmit} className={styles['button']}>
          <Text
            style={{
              color: '#fff',
            }}
          >
            {intl.formatMessage({
              id: 'save',
              defaultMessage: '保存',
            })}
          </Text>
        </Button>
      </View>
    </View>
  )
}
export default GlobalWrapper(InvoiceAdd)
