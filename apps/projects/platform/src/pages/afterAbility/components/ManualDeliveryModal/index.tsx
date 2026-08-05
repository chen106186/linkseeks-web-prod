/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-09 10:48:12
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 19:32:38
 * @Description: 手动发货弹窗
 */
import React from 'react'
import { getIntl } from '@linkseeks/i18n'
import { Modal } from 'antd'
import { createFormActions, FormEffectHooks, FormPath } from '@apps/formily'
import { DatePicker } from '@apps/formily'
import moment from 'moment'
import NiceForm from '@/components/NiceForm'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { getLogisticsSelectListCompany, getLogisticsSelectListShipperAddress } from '@apps/apis'
import { useLinkageUtils } from '@/utils/formEffectUtils'
import { schema } from './schema'
import styles from './index.less'

const intl = getIntl()

const modalFormActions = createFormActions()
const { onFieldValueChange$, onFieldInputChange$, onFormInit$ } = FormEffectHooks

interface VerifyModalProps {
  visible: boolean
  confirmLoading: boolean
  onSubmit: (values: { [key: string]: any }) => void
  onVisible: (flag: boolean) => void
  // 是否编辑的
  isEdit?: boolean
  title?: string
  value?: { [key: string]: any }
}

const VerifyModal: React.FC<VerifyModalProps> = ({
  visible,
  confirmLoading,
  onSubmit,
  onVisible,
  isEdit = true,
  title = intl.formatMessage({
    id: 'afterService.components.ManualDeliveryModal.title',
    defaultMessage: '换货发货处理',
  }),
  value = {},
}) => {
  const handleSubmit = (values) => {
    const { deliveryAddress, deliveryAddressTxt, logisticsName, logisticsNameTxt, ...rest } = values
    if (onSubmit) {
      onSubmit(
        isEdit
          ? {
              deliveryAddress: deliveryAddressTxt,
              logisticsName: logisticsNameTxt,
              ...rest,
            }
          : null,
      )
    }
  }

  // 获取发货地址
  const fetchShipperAddress = (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      getLogisticsSelectListShipperAddress()
        .then((res) => {
          if (res.code === 1000) {
            const options = res.data
              ? res.data.map((item) => ({
                  label: `${item.fullAddress}/${item.shipperName}/${item.phone}`,
                  value: item.id,
                  ...item,
                }))
              : []
            resolve(options)
          }
          reject()
        })
        .catch(() => {
          reject()
        })
    })
  }

  // 获取物流公司
  const fetchLogisticsCompany = (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      getLogisticsSelectListCompany({
        cooperateType: '2', // 1-平台物流服务商，2-商户合作物流公司
      })
        .then((res) => {
          if (res.code === 1000) {
            const options = res.data
              ? res.data.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))
              : []
            resolve(options)
          }
          reject()
        })
        .catch(() => {
          reject()
        })
    })
  }

  const LogisticsOrderNo = (
    <a href={`https://www.kuaidi100.com/chaxun?nu=${value.logisticsOrderNo}`} target="_blank">
      {value.logisticsOrderNo}
    </a>
  )

  return (
    <Modal
      title={title}
      visible={visible}
      confirmLoading={confirmLoading}
      onOk={() => modalFormActions.submit()}
      onCancel={() => onVisible(false)}
      wrapClassName={styles.modalWrap}
      destroyOnClose
    >
      <NiceForm
        effects={($, { setFieldState, setFieldValue }) => {
          const linkage = useLinkageUtils()

          useAsyncSelect('deliveryAddress', fetchShipperAddress, ['label', 'value'])
          useAsyncSelect('logisticsName', fetchLogisticsCompany, ['label', 'value'])

          onFieldInputChange$('deliveryAddress').subscribe((state) => {
            const { originAsyncData, value } = state
            const current = originAsyncData.find((item) => item.value === value)
            if (current) {
              setFieldValue('deliveryAddressTxt', current.fullAddress)
            }
          })
          onFieldInputChange$('logisticsName').subscribe((state) => {
            const { originAsyncData, value } = state
            const current = originAsyncData.find((item) => item.value === value)
            if (current) {
              setFieldValue('logisticsNameTxt', current.label)
            }
          })

          onFormInit$().subscribe(() => {
            if (!isEdit) {
              linkage.hide('*(deliveryAddress,logisticsName,logisticsOrderNo)')
              linkage.show('*(logisticsOrderNoTxt)')
              setFieldState('*(deliveryAddressTxt,logisticsNameTxt)', (state) => {
                state.display = true
              })
            }
          })
        }}
        initialValues={{
          deliveryTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          ...value,
        }}
        components={{
          DatePicker,
        }}
        expressionScope={{
          LogisticsOrderNo,
        }}
        editable={isEdit}
        actions={modalFormActions}
        schema={schema}
        onSubmit={handleSubmit}
      />
    </Modal>
  )
}

export default VerifyModal
