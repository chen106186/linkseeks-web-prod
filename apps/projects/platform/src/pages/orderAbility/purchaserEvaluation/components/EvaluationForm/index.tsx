/**
 * @Description 评价表单
 */
import React, { useState, useEffect, useImperativeHandle } from 'react'
import { Row, Col, Upload, message } from 'antd'
import { createFormActions, FormEffectHooks, Form, FormItem, InternalFieldList as FieldList } from '@apps/formily'
import { Input, Rating } from '@apps/formily'
import { usePrompt } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { FileData } from '@/utils/index'
import { UPLOAD_TYPE } from '@/constants'
import themeConfig from '@apps/config/lingxi.theme.config'
import { createEffects } from './effects'
import MellowCard from '@/components/MellowCard'
import SmilingFace from '@/components/NiceForm/components/SmilingFace'
import AntUpload from '@/components/NiceForm/components/AntUpload'
import EtProductInfo, { EtProductInfoType } from '../EtProductInfo'
import { getWebIntl } from '@apps/locales'
import styles from './index.less'
import { FILE_PREFIX_ENUM } from '@apps/constants/file'

const formActions = createFormActions()
const { onFormInputChange$ } = FormEffectHooks
const translate = getWebIntl()

export type CommentsItem = {
  /**
   *
   * 商品信息
   */
  good: EtProductInfoType
  /**
   * 笑脸
   */
  smile: number
  /**
   * 星星数
   */
  star: number
  /**
   * 评价
   */
  comment?: string
  /**
   * 图片
   */
  picture?: FileData[]
  /**
   * 是否已评价0-否1-是
   */
  commentStatus?: number
  /**
   * 解释时间
   */
  replyTime?: string
  /**
   * 解释内容
   */
  replyContent?: string
}

export type EvaluationFormValue = {
  /**
   * 评价
   */
  comments: CommentsItem[]
}

interface EvaluationFormProps {
  /**
   * 是否可编辑
   */
  ediabled: boolean
  /**
   * 表单值
   */
  value?: EvaluationFormValue
  /**
   * 表单submit触发事件
   */
  onSubmit?: (value: EvaluationFormValue) => void
  /**
   * 是否显示解释，默认 false
   */
  interpretation?: boolean
  /**
   * 订单类型
   */
  orderType: number
}

export interface EvaluationFormRefHandle {
  /**
   * 触发提交时间，如果需要拿到 value
   * 则需要配合 onSubmit 一起使用
   */
  submit: () => void
}

const EvaluationForm: React.ForwardRefRenderFunction<EvaluationFormRefHandle, EvaluationFormProps> = (
  props: EvaluationFormProps,
  ref,
) => {
  const { ediabled, value, onSubmit, interpretation = false, orderType } = props

  const [unsaved, setUnsaved] = useState(false)

  const intl = useIntl()

  usePrompt({ when: unsaved, message: intl.formatMessage({ id: 'supplierEvaluation.ninhaiyouweibaocunde' }) })

  useEffect(() => {
    if (value && value.comments.length) {
      value.comments.forEach((item, index) => {
        if (item.commentStatus) {
          formActions.setFieldState(`comments.${index}.*`, (fieldState) => {
            fieldState.editable = false
          })
        }
      })
    }
  }, [value.comments])

  const beforeUpload = (file) => {
    if (file.size / 1024 / 1024 > 10) {
      message.warning(intl.formatMessage({ id: 'supplierEvaluation.tupiandaxiaochaoguo10M' }))
      return Upload.LIST_IGNORE
    }
    return Promise.resolve()
  }

  const UploadTip = () => (
    <div className={styles['evaluation-form-picture-tip']}>
      {intl.formatMessage({ id: 'supplierEvaluation.zhichiJPGPNGJPEG' })} <br />
      {intl.formatMessage({ id: 'supplierEvaluation.meizhangzuidabuchaoguo' })} <br />
      {intl.formatMessage({ id: 'supplierEvaluation.zuidashuliangxianzhi4' })}
    </div>
  )

  const handleFormSubmit = (value: any) => {
    onSubmit?.(value)
    setUnsaved(false)
  }

  useImperativeHandle(ref, () => ({
    submit: () => formActions.submit(),
  }))

  return (
    <Form
      value={value}
      layout="vertical"
      actions={formActions}
      previewPlaceholder=" "
      effects={($, actions) => {
        createEffects($, actions)

        onFormInputChange$().subscribe(() => {
          if (!unsaved) {
            setUnsaved(true)
          }
        })
      }}
      onSubmit={handleFormSubmit}
      editable={ediabled}
    >
      <div className={styles['evaluation-form-wrap']}>
        <FieldList name="comments">
          {({ state, mutators }) => {
            return (
              <div style={{ width: '100%' }}>
                {state.value.map((item: CommentsItem, index) => (
                  <MellowCard
                    key={index}
                    style={{ marginBottom: 16 }}
                    bodyStyle={{
                      paddingBottom: 0,
                    }}
                  >
                    <Row>
                      <Col flex={1}>
                        <FormItem name={`comments.${index}.good`} component={EtProductInfo} orderType={orderType} />
                      </Col>
                      <Col>
                        <FormItem name={`comments.${index}.smile`} component={SmilingFace} />
                      </Col>
                    </Row>
                    <FormItem
                      name={`comments.${index}.star`}
                      component={Rating}
                      title={intl.formatMessage({
                        id: 'purchaserEvaluation.manyichengdu',
                        defaultMessage: '满意程度',
                      })}
                      rules={[
                        {
                          required: true,
                          message: translate('web.resource.order.qingxuanzemanyichengdu'),
                        },
                      ]}
                      allowHalf={false}
                      allowClear={false}
                    />
                    <FormItem
                      name={`comments.${index}.comment`}
                      component={Input.TextArea}
                      title={intl.formatMessage({ id: 'purchaserEvaluation.pingjia', defaultMessage: '评价' })}
                      rules={[
                        {
                          max: 200,
                          message: translate('web.common.zuiduoshurugezi', { length: 200 }),
                        },
                      ]}
                      rows={1}
                      style={{
                        width: '60%',
                      }}
                    />
                    <Row gutter={parseInt(themeConfig['@padding-md'])} align="middle">
                      <Col>
                        <FormItem
                          name={`comments.${index}.picture`}
                          component={AntUpload}
                          title={intl.formatMessage({ id: 'purchaserEvaluation.tupian', defaultMessage: '图片' })}
                          itemStyle={
                            index === state.value.length - 1
                              ? {
                                  marginBottom: 0,
                                }
                              : {}
                          }
                          rules={[
                            {
                              max: 4,
                              message: intl.formatMessage({ id: 'purchaserEvaluation.zuiduokeshangchuan4zhangtu' }),
                            },
                          ]}
                          listType="card"
                          action="/api/support/file/upload/prefix"
                          data={{
                            fileType: UPLOAD_TYPE,
                            prefix: FILE_PREFIX_ENUM.ORDER_SERVICE,
                          }}
                          beforeUpload={beforeUpload}
                          accept=".png, .jpg, .jpeg"
                          maxCount={4}
                        />
                      </Col>
                      {ediabled && (
                        <Col flex={1}>
                          <UploadTip />
                        </Col>
                      )}
                    </Row>
                    {interpretation ? (
                      <div className={styles['evaluation-form-interpretation']}>
                        <div className={styles['evaluation-form-interpretation-title']}>
                          {intl.formatMessage({
                            id: 'purchaserEvaluation.shangjiajieshi',
                            defaultMessage: '商家解释',
                          })}
                        </div>
                        <div className={styles['evaluation-form-interpretation-content']}>{item.replyContent}</div>
                        <div className={styles['evaluation-form-interpretation-date']}>{item.replyTime}</div>
                      </div>
                    ) : null}
                  </MellowCard>
                ))}
              </div>
            )
          }}
        </FieldList>
      </div>
    </Form>
  )
}

const EvaluationFormForWard = React.forwardRef<EvaluationFormRefHandle, EvaluationFormProps>(EvaluationForm)

export default EvaluationFormForWard
