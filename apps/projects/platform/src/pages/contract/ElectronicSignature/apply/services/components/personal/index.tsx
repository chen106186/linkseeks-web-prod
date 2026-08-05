import React from 'react'
import { Row, Col, Form, Card, Input, Descriptions, FormInstance, Space } from '@linkseeks/ui'
import { useIntl } from '@linkseeks/i18n'
import { useTelCode } from '@apps/services'
import { occlusionToPhone, occlusionToidCard } from '@apps/utils'
import { GetContractSignatureAuthGetSignatureDetailResponse } from '@apps/apis'
import moment from 'moment'
import { PATTERN_MAPS } from '@/constants/regExp'

interface IProps {
  /** 是否编辑模式 */
  editable: boolean
  form: FormInstance<any>
  detail: GetContractSignatureAuthGetSignatureDetailResponse['personal'] | undefined
}

const FORMAT_TYPE = 'yyyy-MM-DD HH:mm:ss'

const Personal: React.FC<IProps> = (props) => {
  const { editable, detail } = props
  const { getTelPattern } = useTelCode()
  const intl = useIntl()

  // const AUTHORIZE_SCOPE = {
  //   get_psn_identity_info: intl.formatMessage({
  //     id: 'contract.electronicSignature.personal.get_psn_identity_info',
  //     defaultMessage: '个人用户的账号信息（姓名、手机号/邮箱、证件号等）',
  //   }),
  //   psn_initiate_sign: intl.formatMessage({
  //     id: 'contract.electronicSignature.personal.psn_initiate_sign',
  //     defaultMessage: '代表个人用户发起合同签署以及查询合同签署详情',
  //   }),
  //   manage_psn_resource: intl.formatMessage({
  //     id: 'contract.electronicSignature.personal.manage_psn_resource',
  //     defaultMessage: '个人用户的印章等资源的管理权限',
  //   }),
  // }

  return (
    <Space direction="vertical" size={16} style={{ width: '100%', display: 'flex' }}>
      <Card
        title={intl.formatMessage({
          id: 'contract.electronicSignature.personal.card.personalInfo',
          defaultMessage: '个人信息',
        })}
      >
        {editable ? (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="psnName"
                label={intl.formatMessage({
                  id: 'contract.electronicSignature.personal.form.name',
                  defaultMessage: '姓名',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'common.form.input.placeholder',
                      defaultMessage: '请输入',
                    }),
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={intl.formatMessage({
                  id: 'contract.electronicSignature.personal.form.phone',
                  defaultMessage: '手机号',
                })}
                name="psnMobile"
                required
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'common.form.input.placeholder',
                      message: intl.formatMessage({
                        id: 'common.form.input.placeholder',
                        defaultMessage: '请输入',
                      }),
                    }),
                  },
                  () => ({
                    validator(_, value) {
                      if (!value) {
                        return Promise.resolve()
                      }
                      if (getTelPattern('+86').test(value)) {
                        return Promise.resolve()
                      } else {
                        return Promise.reject(
                          new Error(
                            intl.formatMessage({
                              id: 'accountSetting.inputCorrentPhoneNumble',
                              defaultMessage: '请填写正确的手机号',
                            }),
                          ),
                        )
                      }
                    },
                  }),
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="psnIDCardNum"
                label={intl.formatMessage({
                  id: 'contract.electronicSignature.personal.form.idcard',
                  defaultMessage: '身份证号',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'common.form.input.placeholder',
                      defaultMessage: '请输入',
                    }),
                  },
                  {
                    pattern: PATTERN_MAPS.identity,
                    message: intl.formatMessage({
                      id: 'contract.electronicSignature.enterprise.form.legalIdcard.pattern',
                      defaultMessage: '请输入正确的身份证号',
                    }),
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        ) : (
          <Descriptions column={2}>
            <Descriptions.Item
              label={intl.formatMessage({
                id: 'contract.electronicSignature.personal.form.name',
                defaultMessage: '姓名',
              })}
            >
              {detail?.psnName}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.formatMessage({
                id: 'contract.electronicSignature.personal.form.phone',
                defaultMessage: '手机号',
              })}
            >
              {occlusionToPhone(detail?.psnMobile)}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.formatMessage({
                id: 'contract.electronicSignature.personal.form.idcard',
                defaultMessage: '身份证号',
              })}
            >
              {occlusionToidCard(detail?.psnIDCardNum)}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Card>
      {!editable && (
        <Card
          title={intl.formatMessage({
            id: 'contract.electronicSignature.card.verificationInfo',
            defaultMessage: '授权信息',
          })}
        >
          <Descriptions column={1}>
            <Descriptions.Item
              label={intl.formatMessage({
                id: 'contract.electronicSignature.card.verificationInfo.periodDate',
                defaultMessage: '授权有效期',
              })}
            >
              {/* 本次对接暂无授权时间不一致情况，所以先取第一条数据的有效期，后续可按需调整展示 */}
              {detail?.personalAuthList && detail?.personalAuthList.length > 0 ? (
                <span>
                  {moment(detail?.personalAuthList[0]?.effectiveTime).format(FORMAT_TYPE)} 至{' '}
                  {moment(detail?.personalAuthList[0]?.expireTime).format(FORMAT_TYPE)}
                </span>
              ) : (
                '-'
              )}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.formatMessage({
                id: 'contract.electronicSignature.card.verificationInfo.periodScope',
                defaultMessage: '授权范围',
              })}
            >
              <Space direction="vertical">
                {detail?.personalAuthList?.map((item) => (
                  <div>- {item.authorizedScope}</div>
                ))}
              </Space>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}
    </Space>
  )
}

export default Personal
