import { useIntl } from '@linkseeks/i18n'
import React, { useCallback, useState, useEffect } from 'react'
import { Form, Checkbox, Row, Col, Image } from 'antd'
import { Card as CardLayout } from '@linkseeks/ui'
import cx from 'classnames'
import style from './index.less'
import { isEmpty } from 'lodash'
import IMG_LEVEL1 from '@/assets/imgs/level1.png'
import IMG_LEVEL2 from '@/assets/imgs/level2.png'
import IMG_LEVEL3 from '@/assets/imgs/level3.png'
import IMG_LEVEL4 from '@/assets/imgs/level4.png'
import { getMarketingCouponSuitableMemberTypeList } from '@apps/apis'
import { getMemberManageMarketingSuitableLevelConfigPage } from '@apps/apis'

const PIC_MAP = {
  1: IMG_LEVEL1,
  2: IMG_LEVEL2,
  3: IMG_LEVEL3,
  4: IMG_LEVEL4,
}

interface PartakeUserLayoutProps {
  /** 返回等级 */
  onGetLevel?: (e: any) => void
  /** 回显数据 */
  onSetLevel?: any[]
  /** 会员类型 */
  setMemberType?: any[]
}

const PartakeUserLayout: React.FC<PartakeUserLayoutProps> = (props: any) => {
  const { onGetLevel, onSetLevel, setMemberType } = props
  const intl = useIntl()
  const [allUser, setAllUser] = useState<any[]>([])
  const [user, setUser] = useState<Number[]>([])
  const [levelConfig, setLevelConfig] = useState<any[]>([])
  const suitableMemberTypeList = useCallback(async () => {
    await getMarketingCouponSuitableMemberTypeList().then((res) => {
      if (res.code !== 1000) {
        return
      }
      setAllUser(res.data)
    })
  }, [])
  const handleChange = (e) => {
    setUser(e.filter((_item) => _item !== 1 && _item !== 2))
  }

  useEffect(() => {
    suitableMemberTypeList()
  }, [])

  useEffect(() => {
    if (!isEmpty(setMemberType)) {
      setUser(setMemberType.filter((_item) => _item !== 1 && _item !== 2))
    }
  }, [setMemberType])

  const handleLevelConfig = (e) => {
    const data = [...levelConfig]
    onGetLevel(data.filter((item) => e.includes(item.id)))
  }

  const levelConfigPage = (memberTypes) => {
    getMemberManageMarketingSuitableLevelConfigPage({
      levelConfigIds: '',
      roleIds: '',
      memberTypes: '',
      current: '1',
      pageSize: '999',
    }).then((res) => {
      if (res.code !== 1000) {
        return
      }
      setLevelConfig(res.data.data)
    })
  }

  useEffect(() => {
    if (!isEmpty(user)) {
      levelConfigPage(user.join(','))
    } else {
      setLevelConfig([])
    }
  }, [user])

  return (
    <CardLayout id="partakeUserLayout" title={intl.formatMessage({ id: 'selfManagement.participateInTheUser' })}>
      <Form.Item
        name="allUser"
        label={intl.formatMessage({ id: 'selfManagement.members' })}
        tooltip={intl.formatMessage({
          id: 'selfManagement.reviewPlatformThroughPlatformMembersMemberThroughPlatformMembersMembers',
        })}
        rules={[{ required: true, message: `${intl.formatMessage({ id: 'selfManagement.pleaseSelectMembers' })}` }]}
        className={style.rulesLayout}
      >
        <Checkbox.Group onChange={handleChange}>
          {allUser.map((item) => (
            <Checkbox key={`allUser${item.value}`} value={item.value}>
              {item.name}
            </Checkbox>
          ))}
        </Checkbox.Group>
      </Form.Item>
      {!isEmpty(user) && !isEmpty(levelConfig) && (
        <Form.Item name="memberLevelList">
          <Checkbox.Group onChange={handleLevelConfig} style={{ width: '100%' }}>
            <Row gutter={[16, 16]}>
              {levelConfig.map((item) => (
                <Col span={12} key={item.id}>
                  <div className={style.colStyle}>
                    <Row>
                      <Col span={6}>
                        <div className={style.cell}>
                          <div className={style.label}>
                            {intl.formatMessage({ id: 'selfManagement.TypeMembership' })}:{' '}
                          </div>
                          <div className={style.content}>{item.memberTypeName}</div>
                        </div>
                      </Col>
                      <Col span={6}>
                        <div className={style.cell}>
                          <div className={style.label}>{intl.formatMessage({ id: 'selfManagement.MemberRole' })}: </div>
                          <div className={style.content}>{item.roleName}</div>
                        </div>
                      </Col>
                      <Col span={6}>
                        <div className={style.cell}>
                          <div className={style.label}>{intl.formatMessage({ id: 'selfManagement.GradeType' })}: </div>
                          <div className={style.content}>{item.levelTypeName}</div>
                        </div>
                      </Col>
                      <Col span={6}>
                        <div className={style.cell}>
                          <div className={style.label}>{intl.formatMessage({ id: 'selfManagement.LevelLabel' })}: </div>
                          <div className={style.content}>{item.levelTag}</div>
                        </div>
                      </Col>
                    </Row>
                    <Checkbox value={item.id} />
                  </div>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </Form.Item>
      )}
    </CardLayout>
  )
}
export default PartakeUserLayout
