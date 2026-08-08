import React, { useState } from 'react'
import { Row, Col, Form, Card, Input, Descriptions, FormInstance, Space, Radio, RadioGroup } from '@linkseeks/ui'
import { useIntl } from '@linkseeks/i18n'
import { useTelCode } from '@apps/services'
import { LineTitle } from '@apps/components'
import { PATTERN_MAPS } from '@/constants/regExp'
import { GetContractSignatureAuthGetSignatureDetailResponse } from '@apps/apis'
import moment from 'moment'
import { occlusionToPhone, occlusionToidCard } from '@apps/utils'

interface IProps {
  /** 是否编辑模式 */
  editable: boolean
  form: FormInstance<any>
  detail: GetContractSignatureAuthGetSignatureDetailResponse['organization'] | undefined
}

const FORMAT_TYPE = 'yyyy-MM-dd HH:mm:ss'

const Enterprise: React.FC<IProps> = (props) => {
  const { editable, form, detail } = props
  const [authType, setAuthType] = useState<1 | 2>(1) // 认证类型 1-法人认证 2-经办人认证
  const { getTelPattern } = useTelCode()
  const intl = useIntl()

  const AUTHORIZE_SCOPE = {
    get_org_identity_info: intl.formatMessage({
      id: 'contract.electronicSignature.enterprise.get_org_identity_info',
      defaultMessage: '获取企业/组织的基本信息（企业名称、统一社会信用代码等）',
    }),
    get_psn_identity_info: intl.formatMessage({
      id: 'contract.electronicSignature.enterprise.get_psn_identity_info',
      defaultMessage: '获取经办人个人用户的账号信息（姓名、手机号/邮箱、证件号等）',
    }),
    org_initiate_sign: intl.formatMessage({
      id: 'contract.electronicSignature.enterprise.org_initiate_sign',
      defaultMessage: '代表企业/组织用户发起合同签署以及查询合同签署详情',
    }),
    psn_initiate_sign: intl.formatMessage({
      id: 'contract.electronicSignature.enterprise.psn_initiate_sign',
      defaultMessage: '代表经办人个人用户发起合同签署以及查询合同签署详情',
    }),
    manage_org_resource: intl.formatMessage({
      id: 'contract.electronicSignature.enterprise.manage_org_resource',
      defaultMessage: '获取企业/组织用户的印章、组织成员等资源的管理权限（不包含用印权限）',
    }),
    manage_psn_resource: intl.formatMessage({
      id: 'contract.electronicSignature.enterprise.manage_psn_resource',
      defaultMessage: '获取经办人个人用户的印章等资源的管理权限',
    }),
    use_org_order: intl.formatMessage({
      id: 'contract.electronicSignature.enterprise.use_org_order',
      defaultMessage: '获取企业/组织用户套餐订单的使用权限',
    }),
  }

  const mock = ['get_org_identity_info', 'get_psn_identity_info', 'manage_org_resource']

  return (
    <Space direction="vertical" size={16} style={{ width: '100%', display: 'flex' }}>
      <Card
        title={intl.formatMessage({
          id: 'contract.electronicSignature.enterprise.card.enterpriseInfo',
          defaultMessage: '企业信息',
        })}
      >
        {editable ? (
          <Row>
            <Col span={24}>
              <LineTitle style={{ fontWeight: 'normal' }}>
                {intl.formatMessage({
                  id: 'contract.electronicSignature.enterprise.basic.title',
                  defaultMessage: '基本信息',
                })}
              </LineTitle>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="orgName"
                    label={intl.formatMessage({
                      id: 'contract.electronicSignature.enterprise.form.companyName',
                      defaultMessage: '公司名称',
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
                    name="orgIDCardNum"
                    label={intl.formatMessage({
                      id: 'contract.electronicSignature.enterprise.form.idcard',
                      defaultMessage: '统一社会信用代码',
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
              </Row>
            </Col>
            <Col span={24}>
              <LineTitle style={{ fontWeight: 'normal' }}>
                {intl.formatMessage({
                  id: 'contract.electronicSignature.enterprise.legal.title',
                  defaultMessage: '法人信息',
                })}
              </LineTitle>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="legalRepName"
                    label={intl.formatMessage({
                      id: 'contract.electronicSignature.enterprise.form.legalName',
                      defaultMessage: '法人姓名',
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
                      id: 'contract.electronicSignature.enterprise.form.legalPhone',
                      defaultMessage: '法人手机号',
                    })}
                    name="legalRepMobile"
                    required
                    rules={[
                      {
                        required: true,
                        message: intl.formatMessage({
                          id: 'common.form.input.placeholder',
                          defaultMessage: '请输入',
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
                    name="legalRepIdCardNum"
                    label={intl.formatMessage({
                      id: 'contract.electronicSignature.enterprise.form.legalIdcard',
                      defaultMessage: '法人身份证号',
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
            </Col>
          </Row>
        ) : (
          <div>
            <LineTitle style={{ fontWeight: 'normal' }}>
              {intl.formatMessage({
                id: 'contract.electronicSignature.enterprise.basic.title',
                defaultMessage: '基本信息',
              })}
            </LineTitle>
            <Descriptions column={2}>
              <Descriptions.Item
                label={intl.formatMessage({
                  id: 'contract.electronicSignature.enterprise.form.companyName',
                  defaultMessage: '公司名称',
                })}
              >
                {detail?.orgName}
              </Descriptions.Item>
              <Descriptions.Item
                label={intl.formatMessage({
                  id: 'contract.electronicSignature.enterprise.form.idcard',
                  defaultMessage: '统一社会信用代码',
                })}
              >
                {detail?.orgIDCardNum}
              </Descriptions.Item>
            </Descriptions>
            <LineTitle style={{ fontWeight: 'normal' }}>
              {intl.formatMessage({
                id: 'contract.electronicSignature.enterprise.legal.title',
                defaultMessage: '法人信息',
              })}
            </LineTitle>
            <Descriptions column={2}>
              <Descriptions.Item
                label={intl.formatMessage({
                  id: 'contract.electronicSignature.enterprise.form.legalName',
                  defaultMessage: '法人姓名',
                })}
              >
                {detail?.legalRepName}
              </Descriptions.Item>
              <Descriptions.Item
                label={intl.formatMessage({
                  id: 'contract.electronicSignature.enterprise.form.legalPhone',
                  defaultMessage: '法人手机号',
                })}
              >
                {occlusionToPhone(detail?.legalRepMobile)}
              </Descriptions.Item>
              <Descriptions.Item
                label={intl.formatMessage({
                  id: 'contract.electronicSignature.enterprise.form.legalIdcard',
                  defaultMessage: '法人身份证号',
                })}
              >
                {occlusionToidCard(detail?.legalRepIdCardNum)}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Card>
      <Card
        title={intl.formatMessage({
          id: 'contract.electronicSignature.enterprise.form.manager.title',
          defaultMessage: '经办人信息',
        })}
      >
        {editable ? (
          <Row>
            <Col span={24}>
              <Form.Item name="authType" initialValue={authType}>
                <RadioGroup onChange={(e) => setAuthType(e.target.value)}>
                  <Radio value={1}>
                    {intl.formatMessage({
                      id: 'contract.electronicSignature.enterprise.form.verificationMethod1',
                      defaultMessage: '法人认证',
                    })}
                  </Radio>
                  <Radio value={2}>
                    {intl.formatMessage({
                      id: 'contract.electronicSignature.enterprise.form.verificationMethod2',
                      defaultMessage: '经办人认证',
                    })}
                  </Radio>
                </RadioGroup>
              </Form.Item>
            </Col>
            {authType === 2 && (
              <Col span={24}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="transactorName"
                      label={intl.formatMessage({
                        id: 'contract.electronicSignature.enterprise.form.managerName',
                        defaultMessage: '经办人姓名',
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
                        id: 'contract.electronicSignature.enterprise.form.managerPhone',
                        defaultMessage: '经办人手机号',
                      })}
                      name="transactorMobile"
                      required
                      rules={[
                        {
                          required: true,
                          message: intl.formatMessage({
                            id: 'common.form.input.placeholder',
                            defaultMessage: '请输入',
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
                      name="transactorIdCardNum"
                      label={intl.formatMessage({
                        id: 'contract.electronicSignature.enterprise.form.managerIdcard',
                        defaultMessage: '经办人身份证号',
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
              </Col>
            )}
          </Row>
        ) : (
          <div>
            {detail?.transactorList &&
              detail?.transactorList.length > 0 &&
              detail?.transactorList.map((item, index) => (
                <Descriptions column={2} key={`transactorList_${index}`}>
                  <Descriptions.Item
                    label={intl.formatMessage({
                      id: 'contract.electronicSignature.enterprise.form.managerName',
                      defaultMessage: '经办人姓名',
                    })}
                  >
                    {item?.transactorName}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={intl.formatMessage({
                      id: 'contract.electronicSignature.enterprise.form.managerPhone',
                      defaultMessage: '经办人手机号',
                    })}
                  >
                    {occlusionToPhone(item?.transactorMobile)}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={intl.formatMessage({
                      id: 'contract.electronicSignature.enterprise.form.managerIdcard',
                      defaultMessage: '经办人身份证号',
                    })}
                  >
                    {occlusionToidCard(item?.transactorIdCardNum)}
                  </Descriptions.Item>
                </Descriptions>
              ))}
          </div>
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
              {detail?.organizationAuthList && detail?.organizationAuthList.length > 0 ? (
                <span>
                  {moment(detail?.organizationAuthList[0]?.effectiveTime).format(FORMAT_TYPE)} 至{' '}
                  {moment(detail?.organizationAuthList[0]?.expireTime).format(FORMAT_TYPE)}
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
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {detail?.organizationAuthList?.map((item) => (
                  <div>- {item.authorizedScope}</div>
                ))}
              </div>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}
    </Space>
  )
}

export default Enterprise
