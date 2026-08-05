import React, { useEffect, useState } from 'react'
import { Row, Col, Space, Image } from 'antd'
import { Card } from '@linkseeks/ui'
import { isEmpty } from 'lodash'
import IMG_LEVEL1 from '@/assets/imgs/level1.png'
import IMG_LEVEL2 from '@/assets/imgs/level2.png'
import IMG_LEVEL3 from '@/assets/imgs/level3.png'
import IMG_LEVEL4 from '@/assets/imgs/level4.png'
import { getIntl } from '@linkseeks/i18n'
import style from './index.less'
import { getWebIntl } from '@apps/locales'

interface ActivityUserLayoutProps {
  /** 标题 */
  title?: string
  /** 适用用户 */
  isFlag?: boolean
  /** 数据回显 */
  dataScoure?: any
  /** 适用用户 */
  allUsers?: any[]
}

const PIC_MAP = {
  1: IMG_LEVEL1,
  2: IMG_LEVEL2,
  3: IMG_LEVEL3,
  4: IMG_LEVEL4,
}
const intl = getIntl()
const translate = getWebIntl()
const ActivityUserLayout: React.FC<ActivityUserLayoutProps> = (props: any) => {
  const { title, isFlag, dataScoure, allUsers } = props
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
        {!isEmpty(allUsers) ? (
          allUsers.map((item, i) => (
            <Col span={24} key={`allUsers_${i}`}>
              <div className={style.cell}>
                <div className={style.label}>{item.title}: </div>
                <div className={style.content}>
                  <Space>
                    {item.value
                      .filter((_item) => _item.key !== 0)
                      .map((_item, _i) => (
                        <div className={style.selector} key={`_item_${_i}`}>
                          {_item.name}
                        </div>
                      ))}
                  </Space>
                </div>
              </div>
            </Col>
          ))
        ) : (
          <Col span={24}>
            <div className={style.cell}>
              <div className={style.label}>{translate('web.resource.marketing.shiyongyonghu')}</div>
              <div className={style.content}>
                <Space>
                  {data.newMember && (
                    <div className={style.selector}>
                      {intl.formatMessage({ id: 'marketingAbility.xinhuiyuanpingtaihuiyuan' })}
                    </div>
                  )}
                  {data.oldMember && (
                    <div className={style.selector}>
                      {intl.formatMessage({ id: 'marketingAbility.laohuiyuanpingtaihuiyuan' })}
                    </div>
                  )}
                </Space>
              </div>
            </div>
            <div className={style.cell}>
              <div className={style.label}>{intl.formatMessage({ id: 'marketingAbility.shiyongyonghujuese：' })}</div>
              <div className={style.content}>
                <Space>
                  {data.enterpriseMember && (
                    <div className={style.selector}>{intl.formatMessage({ id: 'marketingAbility.qiyehuiyuan' })}</div>
                  )}
                  {data.personalMember && (
                    <div className={style.selector}>{intl.formatMessage({ id: 'marketingAbility.gerenhuiyuan' })}</div>
                  )}
                </Space>
              </div>
            </div>
          </Col>
        )}
      </Row>
      {!isFlag && (
        <Row gutter={[16, 16]}>
          {memberLevelList.map((item: any) => (
            <Col span={12} key={item.id}>
              <div className={style.colStyle}>
                <Row>
                  <Col span={6}>
                    <div className={style.cell}>
                      <div className={style.label}>
                        {intl.formatMessage({
                          id: 'marketingAbility.huiyuanleixing',
                          defaultMessage: '会员类型:',
                        })}
                      </div>
                      <div className={style.content}>{item.memberTypeName}</div>
                    </div>
                  </Col>
                  <Col span={6}>
                    <div className={style.cell}>
                      <div className={style.label}>
                        {intl.formatMessage({
                          id: 'marketingAbility.huiyuanjuese',
                          defaultMessage: '会员角色:',
                        })}
                      </div>
                      <div className={style.content}>{item.roleName}</div>
                    </div>
                  </Col>
                  <Col span={6}>
                    <div className={style.cell}>
                      <div className={style.label}>{intl.formatMessage({ id: 'marketingAbility.dengjileixing' })}</div>
                      <div className={style.content}>{item.levelTypeName}</div>
                    </div>
                  </Col>
                  <Col span={6}>
                    <div className={style.cell}>
                      <div className={style.label}>{intl.formatMessage({ id: 'marketingAbility.dengjibiaoqian' })}</div>
                      <div className={style.content}>{item.levelTag}</div>
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
  title: `${intl.formatMessage({ id: 'marketingAbility.canyuhuodongyonghu' })}`,
}

export default ActivityUserLayout
