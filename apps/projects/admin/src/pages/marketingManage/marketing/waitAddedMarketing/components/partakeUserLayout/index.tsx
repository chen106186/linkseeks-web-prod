import React, { useCallback, useState, useEffect } from 'react'
import { Form, Checkbox, Row, Col, Image } from 'antd'
import { Card as CardLayout } from '@linkseeks/ui'
import style from './index.less'
import { isEmpty } from 'lodash'
import IMG_LEVEL1 from '@/assets/level1.png'
import IMG_LEVEL2 from '@/assets/level2.png'
import IMG_LEVEL3 from '@/assets/level3.png'
import IMG_LEVEL4 from '@/assets/level4.png'
import { getMarketingCouponPlatformMemberTypeList, getMarketingCouponPlatformSuitableMemberTypeList } from '@apps/apis'
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
  const [allUser, setAllUser] = useState<any[]>([])
  const [allMemberType, setAllMemberType] = useState<any[]>([])
  const [roleIds, setRoleIds] = useState<Number[]>([])
  const [levelConfig, setLevelConfig] = useState<any[]>([])
  const suitableMemberTypeList = useCallback(async () => {
    await getMarketingCouponPlatformSuitableMemberTypeList().then((res) => {
      if (res.code !== 1000) {
        return
      }
      setAllUser(res.data)
    })
    await getMarketingCouponPlatformMemberTypeList().then((res) => {
      if (res.code !== 1000) {
        return
      }
      setAllMemberType(res.data)
    })
  }, [])
  const handleChange = (e) => {
    setRoleIds(e)
  }

  useEffect(() => {
    suitableMemberTypeList()
  }, [])

  useEffect(() => {
    if (!isEmpty(roleIds)) {
      getMemberManageMarketingSuitableLevelConfigPage({
        levelConfigIds: '',
        roleIds: '',
        memberTypes: roleIds.join(','),
        current: '1',
        pageSize: '999',
      }).then((res) => {
        if (res.code !== 1000) {
          return
        }
        setLevelConfig(res.data.data)
      })
    }
  }, [roleIds])

  const handleLevelConfig = (e) => {
    const data = [...levelConfig]
    onGetLevel(data.filter((item) => e.includes(item.id)))
  }

  useEffect(() => {
    if (!isEmpty(setMemberType)) {
      setRoleIds(setMemberType)
    }
  }, [setMemberType])

  return (
    <CardLayout id="partakeUserLayout" title="参与用户">
      <Form.Item
        name="allUser"
        label="适用新老会员"
        tooltip="当天平台审核通过的平台会员为新会员，非当天审核通过的平台会员为老会员"
        rules={[{ required: true, message: '请选择适用新老会员' }]}
        className={style.rulesLayout}
      >
        <Checkbox.Group>
          {allUser.map((item) => (
            <Checkbox key={`allUser${item.value}`} value={item.value}>
              {item.name}
            </Checkbox>
          ))}
        </Checkbox.Group>
      </Form.Item>
      <Form.Item
        name="allMemberType"
        label="适用会员类型"
        rules={[{ required: true, message: '请选择适用会员类型' }]}
        className={style.rulesLayout}
      >
        <Checkbox.Group onChange={handleChange}>
          {allMemberType.map((item) => (
            <Checkbox key={`allMemberType${item.value}`} value={item.value}>
              {item.name}
            </Checkbox>
          ))}
        </Checkbox.Group>
      </Form.Item>
      {!isEmpty(roleIds) && (
        <Form.Item name="memberLevelList" rules={[{ required: true, message: '请选择' }]}>
          <Checkbox.Group style={{ display: 'block' }} onChange={handleLevelConfig}>
            <Row gutter={[16, 16]}>
              {levelConfig.map((item) => (
                <Col span={12} key={item.id}>
                  <div className={style.colStyle}>
                    <Row>
                      <Col span={6}>
                        <div className={style.cell}>
                          <h5 className={style.label}>会员类型: </h5>
                          <h5 className={style.content}>{item.memberTypeName}</h5>
                        </div>
                      </Col>
                      <Col span={6}>
                        <div className={style.cell}>
                          <h5 className={style.label}>会员角色: </h5>
                          <h5 className={style.content}>{item.roleName}</h5>
                        </div>
                      </Col>
                      <Col span={6}>
                        <div className={style.cell}>
                          <h5 className={style.label}>等级类型: </h5>
                          <h5 className={style.content}>{item.levelTypeName}</h5>
                        </div>
                      </Col>
                      <Col span={6}>
                        <div className={style.cell}>
                          <h5 className={style.label}>等级标签: </h5>
                          <h5 className={style.content}>{item.levelTag}</h5>
                          {/* <h5 className={style.content}><Image width={56} height={16} preview={false} src={PIC_MAP[item.level]} /></h5> */}
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
