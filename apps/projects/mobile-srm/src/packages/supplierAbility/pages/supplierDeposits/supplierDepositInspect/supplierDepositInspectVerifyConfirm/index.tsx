/*
 * @Description: 入库考察
 */
import React, { useRef, useState } from 'react'
import { useRouter, showLoading, showToast, pxTransform } from '@apps/mobile-services/utils/taro'
import { View, Button } from '@apps/mobile-ui'
import Router from '@/utils/router'
import { themeLayout } from '@/constants/theme'
import { PATTERN_MAPS } from '@/constants/regExp'
import { limitByte } from '@/utils'
import { postMemberMobileDepositInspect } from '@apps/apis'
import NavBar from '@/components/NavBar'
import PageLayout from '@/components/PageLayout'
import MellowCard from '@/components/MellowCard'
import VerifyPopup, { VerifySubmitValueType } from '@/components/VerifyPopup'
import { setDepositsRefreshStorage } from '../../../../common/utils/pageStockRefreshUtil'
import useVerifyAgree from '../../../../common/hooks/useVerifyAgree'
import Form from '../../../../components/Form'
import { validateFields } from '../../../../components/Form/utils/validateUtil'
import { RuleObject } from '../../../../components/Form/typings'
import SpaceshipWrap from '../../../../components/SpaceshipWrap'
import CustomDatePicker from '../../../../components/CustomDatePicker'
import CustomInput from '../../../../components/CustomInput'
import CustomUpload from '../../../../components/CustomUpload'
import './index.scss'

type SubmitValuesType = {
  /**
   * 考察日期
   */
  inspectDay: string
  /**
   * 考察评分
   */
  score: string
  /**
   * 考察结果
   */
  result: string
  /**
   * 考察报告
   */
  reports: string[]
}

type SupplierDepositInspectVerifyConfirmRouteParams = {
  /**
   * 会员审核id
   */
  validateId?: string
}

const SupplierDepositInspectVerifyConfirm: React.FC = () => {
  const router = useRouter<SupplierDepositInspectVerifyConfirmRouteParams>()
  const {
    params: { validateId },
  } = router

  const [visibleVerfiyPopup, setVisibleVerfiyPopup] = useState(false)

  const [form] = Form.useForm()

  const { agree, toggle } = useVerifyAgree()

  const rules = useRef<Map<string, RuleObject[]>>(
    new Map([
      [
        'inspectDay',
        [
          {
            required: true,
            message: '请选择考察日期',
          },
        ],
      ],
      [
        'score',
        [
          {
            required: true,
            message: '请输入考察评分',
          },
          {
            pattern: PATTERN_MAPS.money,
            message: '请输入两位小数或整数',
          },
        ],
      ],
      [
        'result',
        [
          {
            required: true,
            message: '请输入考察结果',
          },
          {
            validator: (_, value) => {
              const resMsg = limitByte(value || '', { maxByte: 60 })
              if (resMsg) {
                return Promise.reject(new Error(resMsg))
              }
              return Promise.resolve()
            },
          },
        ],
      ],
      [
        'reports',
        [
          {
            required: true,
            message: '请上传考察报告',
          },
        ],
      ],
    ]),
  )

  const inspectValue = useRef<SubmitValuesType | null>(null)

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
    inspectValue.current = values
    handleVisibleVerfiyPopup(true)
  }

  const handleVerifyConfirm = (values: VerifySubmitValueType) => {
    if (!inspectValue.current) {
      return
    }
    const { reports, score, ...restValues } = inspectValue.current
    handleVisibleVerfiyPopup(false)

    showLoading({ title: '正在提交...', mask: true })
    postMemberMobileDepositInspect({
      validateId: +validateId!,
      score: +score,
      reports: reports
        ? reports.map((item) => ({
            name: item ? item.split('/').slice(-1)[0] : '',
            url: item,
          }))
        : [],
      ...restValues,
      ...values,
    })
      .then((res) => {
        if (res.code === 1000) {
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
          <NavBar title="入库考察" />
        </>
      }
    >
      <View className="supplier-inspect-confirm-section">
        <Form form={form} onFinish={handleFinish}>
          <MellowCard
            title="考察信息"
            headStyle={{
              paddingRight: 0,
              paddingLeft: 0,
              marginRight: pxTransform(themeLayout['margin-s']),
              marginLeft: pxTransform(themeLayout['margin-s']),
            }}
            bodyStyle={{
              paddingTop: 0,
              paddingBottom: 0,
            }}
          >
            <Form.Item label="考察日期" name="inspectDay">
              <CustomDatePicker placeholder="请选择" contentAlign="right" />
            </Form.Item>
            <Form.Item label="考察评分" name="score">
              <CustomInput placeholder="点击输入" />
            </Form.Item>
            <Form.Item label="考察结果" name="result">
              <CustomInput placeholder="点击输入" />
            </Form.Item>
          </MellowCard>
          <MellowCard
            title="考察报告"
            style={{
              marginTop: pxTransform(themeLayout['padding-xs']),
            }}
            headStyle={{
              paddingRight: 0,
              paddingLeft: 0,
              marginRight: pxTransform(themeLayout['margin-s']),
              marginLeft: pxTransform(themeLayout['margin-s']),
            }}
            bodyStyle={{
              paddingTop: 0,
              paddingBottom: 0,
            }}
          >
            <Form.Item name="reports">
              <CustomUpload multiple />
            </Form.Item>
          </MellowCard>
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

export default SupplierDepositInspectVerifyConfirm
