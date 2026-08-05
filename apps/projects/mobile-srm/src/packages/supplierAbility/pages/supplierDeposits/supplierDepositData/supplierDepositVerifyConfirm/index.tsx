/*
 * @Description: 审核入库资料
 */
import React, { useEffect, useRef, useState } from 'react'
import { useRouter, showLoading, hideLoading, showToast, pxTransform } from '@apps/mobile-services/utils/taro'
import { View, Button } from '@apps/mobile-ui'
import Router from '@/utils/router'
import { themeLayout } from '@/constants/theme'
import { postMemberMobileDepositVerify } from '@apps/apis'
import NavBar from '@/components/NavBar'
import PageLayout from '@/components/PageLayout'
import VerifyPopup, { VerifySubmitValueType } from '@/components/VerifyPopup'
import {
  getDepositDetailsStorage,
  removeDepositDetailsStorage,
  setDepositsRefreshStorage,
} from '../../../../common/utils/pageStockRefreshUtil'
import {
  createMemberSchema,
  FormGroupsType,
  renderRegisterDataFields,
} from '../../../../common/utils/createMemberSchemaUtil'
import useVerifyAgree from '../../../../common/hooks/useVerifyAgree'
import Form from '../../../../components/Form'
import { validateFields } from '../../../../components/Form/utils/validateUtil'
import { RuleObject } from '../../../../components/Form/typings'
import SpaceshipWrap from '../../../../components/SpaceshipWrap'
import DepositQualitiesList, { DepositQualitiesValueType } from '../../../../components/DepositQualitiesList'
import './index.scss'

type SubmitValuesType = {
  /**
   * 资质证明
   */
  qualities?: DepositQualitiesValueType
} & Record<string, any>

type SupplierDepositVerifyConfirmRouteParams = {
  /**
   * 会员审核id
   */
  validateId?: string
}

const SupplierDepositVerifyConfirm: React.FC = () => {
  const router = useRouter<SupplierDepositVerifyConfirmRouteParams>()
  const {
    params: { validateId },
  } = router

  const [depositData, setDepositData] = useState<FormGroupsType>([])
  const [visibleVerfiyPopup, setVisibleVerfiyPopup] = useState(false)

  const [form] = Form.useForm()

  const rules = useRef<Map<string, RuleObject[]>>(new Map())

  const depositValue = useRef<SubmitValuesType | null>(null)

  const { agree, toggle } = useVerifyAgree()

  const getSupplierDepositDetails = () => {
    if (!validateId) {
      return
    }
    showLoading({ title: '正在加载...', mask: true })
    const depositCache = getDepositDetailsStorage()
    if (depositCache) {
      const depositDataGroups = createMemberSchema(depositCache.depositDetails)
      depositDataGroups.forEach((group) => {
        if (group.fields && group.fields.length) {
          group.fields.forEach((field) => {
            rules.current.set(field.fieldName, field.rules)
          })
        }
      })
      setDepositData(depositDataGroups)

      // 设置初始的资质证明
      if (depositCache.depositQualities) {
        form.setFieldsValue({
          qualities: depositCache.depositQualities,
        })
      }
    }
    hideLoading()
  }

  useEffect(() => {
    getSupplierDepositDetails()
  }, [])

  const handleVisibleVerfiyPopup = (flag?: boolean) => {
    setVisibleVerfiyPopup(!!flag)
  }

  const handleSubmit = () => {
    if (!validateId) {
      return
    }
    form.submit()
  }

  const handleFinish = async (values: SubmitValuesType) => {
    const valueErrors = await validateFields(values, rules.current)
    if (valueErrors.length) {
      showToast({ title: valueErrors[0].errors?.[0], icon: 'none' })
      return
    }
    depositValue.current = values
    handleVisibleVerfiyPopup(true)
  }

  const handleVerifyConfirm = (values: VerifySubmitValueType) => {
    if (!depositValue.current) {
      return
    }
    const { qualities, ...restValues } = depositValue.current
    handleVisibleVerfiyPopup(false)

    showLoading({ title: '正在提交...', mask: true })
    // 暂无渠道信息
    postMemberMobileDepositVerify({
      validateId: +validateId!,
      qualities,
      depositDetails: restValues,
      ...values,
    })
      .then((res) => {
        if (res.code === 1000) {
          removeDepositDetailsStorage()
          showToast({ title: '操作成功', icon: 'none' })
          // 设置列表刷新标识
          setDepositsRefreshStorage(true)
          setTimeout(() => {
            Router.navigateBack({ delta: 2 })
          }, 1000)
        }
      })
      .finally(() => {
        // 在真机如果出现了 Toast 会消失的很快
        // hideLoading();
      })
  }

  const handleVerify = (flag: boolean) => {
    toggle(flag)
    handleSubmit()
  }

  return (
    <PageLayout
      renderHeader={
        <>
          <NavBar title="审核入库资料" />
        </>
      }
    >
      <View className="supplier-deposit-confirm-section">
        <Form form={form} onFinish={handleFinish}>
          {/* 注册资料 */}
          {renderRegisterDataFields(depositData).map((item, index) => (
            <View style={{ marginBottom: pxTransform(themeLayout['margin-xs']) }} key={index}>
              {item}
            </View>
          ))}
          {/* 资质证明 */}
          <Form.Item
            name="qualities"
            customContentStyle={{
              padding: 0,
            }}
          >
            <DepositQualitiesList editable />
          </Form.Item>
        </Form>
      </View>
      <VerifyPopup
        visible={visibleVerfiyPopup}
        agree={agree}
        onClose={() => handleVisibleVerfiyPopup(false)}
        onConfirm={handleVerifyConfirm}
      />
      <SpaceshipWrap>
        <Button onClick={() => handleVerify(false)}>审核不通过</Button>
        <Button type="primary" onClick={() => handleVerify(true)}>
          审核通过
        </Button>
      </SpaceshipWrap>
    </PageLayout>
  )
}

export default SupplierDepositVerifyConfirm
