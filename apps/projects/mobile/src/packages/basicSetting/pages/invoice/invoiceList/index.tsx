import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import {
  useRouter,
  setNavigationBarTitle,
  showLoading,
  hideLoading,
  preload,
  pxTransform,
  showToast,
} from '@apps/mobile-services/utils/taro'
import { View, Text, Image, ScrollView, Modal, SwipeAction, Toast } from '@apps/mobile-ui'
import { observer } from 'mobx-react-lite'
import { themeLayout } from '@/constants/theme'
import useStores from '@/store/useStores'
import { useSafeArea } from '@apps/mobile-services'
import Router from '@/utils/router'
import EmptyLayout from '@/components/Empty'
import { useIntl } from '@linkseeks/i18n'
import { getOssUrlPath } from '@apps/constants'
import {
  getSettlementMobileInvoiceMessageList,
  postSettlementMobileInvoiceMessageDelete,
  postOrderMobileBuyerInvoice,
} from '@apps/apis'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
const Icon = getOssUrlPath('/miniprogram/assets/edit.png')
const addIcon = getOssUrlPath('/miniprogram/assets/plus.svg')
const InvoiceList: React.FC = () => {
  const intl = useIntl()
  const {
    userStore: { setInvoiceInfo },
  } = useStores()
  const {
    params: { handleSelectInvoice, orderId },
  } = useRouter()
  const [data, setData] = useState<any>([])
  const [toggle, setToggle] = useState(false) // 控制显示弹出
  const [id, setId] = useState('') // 对应的id
  const [btnControl, setBtnControl] = useState<boolean>(false) // 对应的id
  const { safeBottomHeight } = useSafeArea()
  const list = () => {
    showLoading()
    getSettlementMobileInvoiceMessageList()
      .then((res: any) => {
        hideLoading()
        if (res.code === 1000) {
          setData(res.data)
        } else {
          showToast({
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
  usePageInit()
  useEffect(() => {
    list()
    // setNavigationBarTitle({ title: intl.formatMessage({ id: 'mine.fapiaoguanli', defaultMessage: '发票管理' }) })
    setBtnControl(handleSelectInvoice as unknown as boolean)
  }, [])
  const linkTo = (item: any) => {
    preload({
      id: item.id,
      Index: item.type === 1 ? 0 : 1,
      refresh: () => {
        list()
      },
    })
    Router.navigateTo('basicSetting/invoiceAdd')
  }

  /**
   * 临时方案
   * 这里逻辑要重写，应该单独或者写在某个mobx下，然后取，操作完后需要清空
   */
  const onsetItem = (item: any) => {
    if (handleSelectInvoice) {
      setInvoiceInfo(item)
      Router.navigateBack()
      return
    }
    if (orderId) {
      postOrderMobileBuyerInvoice({
        orderId: orderId as unknown as number,
        invoiceId: item.id,
        invoiceKind: item.kind,
        invoiceType: item.type,
        title: item.invoiceTitle,
        phone: item.tel,
        taxNo: item.taxNo,
        bank: item.bankOfDeposit,
        account: item.account,
        address: item.address,
      }).then((res) => {
        if (res.code === 1000) {
          Router.navigateBack()
        }
      })
      return
    }
    linkTo(item)
  }

  /* 个人发票 */
  const personal = (item: any) => (
    <View className={styles['box']}>
      <Text className={styles['invoice-text']}>
        {intl.formatMessage({
          id: 'invoice_payable',
          defaultMessage: '发票抬头',
        })}
        :
      </Text>
      <Text className={styles['name']}>{item.invoiceTitle}</Text>
    </View>
  )
  /* 企业 */
  const enterprise = (item: any) => (
    <View className={styles['warp']}>
      <View className={styles['box']}>
        <Text className={styles['invoice-text']}>
          {intl.formatMessage({
            id: 'invoice_type',
            defaultMessage: '发票种类',
          })}
          :
        </Text>
        <Text className={styles['name']}>
          {item.kind === 1
            ? intl.formatMessage({
                id: 'VAT_general_invoice',
                defaultMessage: '增值税普通发票',
              })
            : intl.formatMessage({
                id: 'VAT_special_invoice',
                defaultMessage: '增值税专用发票',
              })}
        </Text>
      </View>
      <View className={styles['box']}>
        <Text className={styles['invoice-text']}>
          {intl.formatMessage({
            id: 'invoice_payable',
            defaultMessage: '发票抬头',
          })}
          :
        </Text>
        <Text className={styles['name']}>{item.invoiceTitle}</Text>
      </View>
      <View className={styles['box']}>
        <Text className={styles['invoice-text']}>
          {intl.formatMessage({
            id: 'tax_id_code',
            defaultMessage: '纳税号',
          })}
          :
        </Text>
        <Text className={styles['name']}>{item.taxNo}</Text>
      </View>
    </View>
  )

  /* 删除 */
  const del = (Id: string) => {
    if (!toggle) {
      setToggle(!toggle)
    }
    setId(Id)
  }
  /* 删除接口 */
  const setConfirm = () => {
    const param: any = {
      id,
    }
    postSettlementMobileInvoiceMessageDelete(param).then((res: any) => {
      if (res.code === 1000) {
        setToggle(!toggle)
        Toast.show({
          title: intl.formatMessage({
            id: 'delete_success',
            defaultMessage: '删除成功',
          }),
        })
        list()
      } else {
        Toast.show({
          title: intl.formatMessage({
            id: `${res.code}`,
            defaultMessage: res.message,
          }),
        })
      }
    })
  }
  /* 返回上一个页面 */
  const navigationLink = () => {
    setInvoiceInfo(null)
    Router.navigateBack()
  }
  const renderItem = ({ item }: { item: any }) => (
    <View className={styles['item']} key={String(item.id)}>
      <SwipeAction
        customStyle={{
          width: '100%',
        }}
        options={[
          {
            text: intl.formatMessage({
              id: 'delete',
              defaultMessage: '删除',
            }),
            className: styles['delete-btn'],
          },
        ]}
        onClick={() => del(item.id)}
        maxDistance={100}
      >
        <View className={styles['invoice-item']}>
          {item.isDefault === 1 && (
            <View className={styles['flag']}>
              <Text className={styles['taginfo']}>
                {intl.formatMessage({
                  id: 'invoice_default',
                  defaultMessage: '默认',
                })}
              </Text>
            </View>
          )}
          <View className={styles['left']} onClick={() => onsetItem(item)}>
            <Text className={item.type === 2 ? styles['tagpersonal'] : styles['tag-active']}>
              {item.type === 2
                ? intl.formatMessage({
                    id: 'personal_invoice',
                    defaultMessage: '个人发票',
                  })
                : intl.formatMessage({
                    id: 'corporate_invoice',
                    defaultMessage: '企业发票',
                  })}
            </Text>
            {item.type === 2 ? personal(item) : enterprise(item)}
          </View>
          <View
            className={styles['right']}
            onClick={() => {
              linkTo(item)
            }}
          >
            <Image className={styles['icon']} src={Icon} />
          </View>
        </View>
      </SwipeAction>
    </View>
  )
  return (
    <View className={styles['invoice-container']}>
      <View className={styles['invoicebtn-scroll']}>
        <ScrollView
          className={styles['main']}
          data={data}
          renderItem={renderItem}
          horizontal={false}
          // onEndReached={() => handleLoadMore()}
          onEndReachedThreshold={0.05}
          enableFlex
          listEmptyComponent={<EmptyLayout />}
        />
      </View>
      <View
        className={cx(styles['invoice-btn-group'])}
        style={{
          paddingBottom: pxTransform(safeBottomHeight || themeLayout['padding-xs']),
        }}
      >
        {btnControl && (
          <View
            className={cx(styles['invoice-btn'], styles['invoice-btn-left'])}
            onClick={() => {
              navigationLink()
            }}
          >
            <Text>
              {intl.formatMessage({
                id: 'dismiss_invoice',
                defaultMessage: '本次不开发票',
              })}
            </Text>
          </View>
        )}
        <View
          className={cx(styles['invoice-btn'], styles['invoice-alone'])}
          onClick={() => {
            preload({
              refresh: () => {
                list()
              },
            })
            Router.navigateTo('basicSetting/invoiceAdd')
          }}
        >
          <Image className={styles['addicon-img']} src={addIcon} />
          <Text
            style={{
              color: '#fff',
            }}
          >
            {intl.formatMessage({
              id: 'add_invoice',
              defaultMessage: '新增发票',
            })}
          </Text>
        </View>
      </View>
      {/* 模态框 */}
      <Modal
        title={intl.formatMessage({
          id: 'invoice_deleted',
          defaultMessage: '是否删除发票？',
        })}
        isOpened={toggle}
        onConfirm={setConfirm}
        onCancel={() => {
          setToggle(false)
        }}
        cancelText={intl.formatMessage({
          id: 'mine.quxiao',
          defaultMessage: '取消',
        })}
        confirmText={intl.formatMessage({
          id: 'mine.queren',
          defaultMessage: '确认',
        })}
        className={styles['invoice-model']}
      />
    </View>
  )
}
export default GlobalWrapper(observer(InvoiceList))
