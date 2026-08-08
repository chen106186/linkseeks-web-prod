import React, { useEffect, useState } from 'react'
import { Row, Col, Space, Image } from 'antd'
import style from './index.less'
import { Card } from '@linkseeks/ui'
import { isEmpty } from 'lodash'
import IMG_LEVEL1 from '@/assets/level1.png'
import IMG_LEVEL2 from '@/assets/level2.png'
import IMG_LEVEL3 from '@/assets/level3.png'
import IMG_LEVEL4 from '@/assets/level4.png'

interface ActivityUserLayoutProps {
  /** 标题 */
  title?: string
  /** 适用用户 */
  isFlag?: boolean
  /** 数据回显 */
  dataScoure?: any
}

const PIC_MAP = {
  1: IMG_LEVEL1,
  2: IMG_LEVEL2,
  3: IMG_LEVEL3,
  4: IMG_LEVEL4,
}

const ActivityUserLayout: React.FC<ActivityUserLayoutProps> = (props: any) => {
  const { title, isFlag, dataScoure } = props
  const [data, setData] = useState<any>({})
  const [memberLevelList, setMemberLevelList] = useState<any[]>([])

  useEffect(() => {
    if (!isEmpty(dataScoure)) {
      setData(dataScoure)
      setMemberLevelList(dataScoure.memberLevelList || [])
    }
  }, [dataScoure])
  return (
    <Card id="activityUserLayout" title={title}>
      <Row gutter={[8, 8]}>
        <Col span={8}>
          <div className={style.cell} style={{ marginBottom: 16 }}>
            <label className={style.label}>适用用户: </label>
            <span className={style.content}>
              <Space>
                {data.newMember !== 0 && <div className={style.selector}>新会员（平台会员）</div>}
                {data.oldMember !== 0 && <div className={style.selector}>老会员（平台会员）</div>}
              </Space>
            </span>
          </div>
          <div className={style.cell} style={{ marginBottom: 16 }}>
            <label className={style.label}>适用用户角色： </label>
            <span className={style.content}>
              <Space>
                {data.enterpriseMember !== 0 && <div className={style.selector}>企业会员</div>}
                {data.personalMember !== 0 && <div className={style.selector}>个人会员</div>}
              </Space>
            </span>
          </div>
        </Col>
      </Row>
      {!isFlag && (
        <Row gutter={[16, 16]}>
          {memberLevelList.map((item: any) => (
            <Col span={12} key={item.id}>
              <div className={style.colStyle}>
                <Row>
                  <Col span={6}>
                    <div className={style.cell}>
                      <label className={style.label}>会员类型: </label>
                      <span className={style.content}>{item.memberTypeName}</span>
                    </div>
                  </Col>
                  <Col span={6}>
                    <div className={style.cell}>
                      <label className={style.label}>会员角色: </label>
                      <span className={style.content}>{item.roleName}</span>
                    </div>
                  </Col>
                  <Col span={6}>
                    <div className={style.cell}>
                      <label className={style.label}>等级类型: </label>
                      <span className={style.content}>{item.levelTypeName}</span>
                    </div>
                  </Col>
                  <Col span={6}>
                    <div className={style.cell}>
                      <label className={style.label}>等级标签: </label>
                      <span className={style.content}>{item.levelTag}</span>
                      {/* <h5 className={style.content}><Image width={56} height={16} preview={false} src={PIC_MAP[item.level]} /></h5> */}
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </Card>
  )
}

ActivityUserLayout.defaultProps = {
  title: '参与活动用户',
}

export default ActivityUserLayout
