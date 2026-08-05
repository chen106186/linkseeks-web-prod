/**
 * 资质图片变更 抽屉
 */
import { Descriptions, Drawer } from 'antd'
import { useEffect, useState } from 'react'
import type { ChangeItemType } from '../MemberChangedInfo'
import styles from './index.less'
import classNames from 'classnames'
import { FileOutlined } from '@ant-design/icons'
import { formatTimeString } from '@/utils'
import { useWebIntl } from '@apps/locales'

interface IProps {
  /**
   * 抽屉显隐
   */
  visible: boolean
  /**
   * 设置抽屉显隐
   */
  setVisible: (boolean) => void
  /**
   * 资质图片数据(字符串)
   */
  qualificationData: ChangeItemType
  /**
   * 是否显示在变更后(默认 true)
   */
  isShowAfter?: boolean
}

const imgReg = /\.(png|jpg|gif|jpeg|webp)$/
const QualificationChangeDrawer = (props: IProps) => {
  const { visible, setVisible, qualificationData, isShowAfter = true } = props
  const [showAfter, setShowAfter] = useState(true)
  const [beforList, setBeforList] = useState([])
  const [afterList, setAfterList] = useState([])
  const translate = useWebIntl()
  useEffect(() => {
    const { fieldValue, lastValue } = qualificationData || {}
    try {
      const beforListJson = JSON.parse(lastValue)
      const afterListJson = JSON.parse(fieldValue)
      setBeforList(beforListJson)
      setAfterList(afterListJson)
    } catch (e) {
      // console.log(e, 19);
    }
    setShowAfter(isShowAfter)
  }, [qualificationData])

  const handleClose = () => {
    setVisible(false)
    // 重置默认tab
    setShowAfter(true)
  }
  return (
    <Drawer
      visible={visible}
      title="资质证明图片"
      width="50%"
      onClose={() => {
        handleClose()
      }}
      bodyStyle={{ padding: '20px' }}
    >
      <div className={styles['btn-switch']}>
        <span
          className={classNames(styles['btn-switch-item-none'], {
            [styles['btn-switch-item-active']]: !showAfter,
          })}
          onClick={() => {
            setShowAfter(false)
          }}
        >
          变更前
        </span>
        <span
          className={classNames(styles['btn-switch-item-none'], {
            [styles['btn-switch-item-active']]: showAfter,
          })}
          onClick={() => {
            setShowAfter(true)
          }}
        >
          变更后
        </span>
      </div>
      <ul className={styles.qualification}>
        {(showAfter ? afterList : beforList).map((item) => (
          <li key={item.url} className={styles['qualification-item']}>
            <div className={styles['qualification-item-wrap']}>
              <div
                className={classNames(styles['qualification-item-left'], {
                  [styles['qualification-item-left-file']]: !imgReg.test(item.url),
                })}
              >
                {imgReg.test(item.url) ? (
                  <img src={item.url} />
                ) : (
                  <a href={item.url} target="__black">
                    <FileOutlined style={{ fontSize: 36 }} />
                  </a>
                )}
              </div>
              <div className={styles['qualification-item-right']}>
                <Descriptions column={1}>
                  <Descriptions.Item label={'到期日'}>
                    {/* 长期有效时，不显示时间 */}
                    {(item.permanent !== 1 && item.expireDay && formatTimeString(item.expireDay, 'YYYY-MM-DD')) ||
                      translate('web.common.wu')}
                  </Descriptions.Item>
                  <Descriptions.Item label="有效期" style={{ paddingBottom: 0 }}>
                    {item.permanent === 1 ? '长期有效' : translate('web.common.fou')}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Drawer>
  )
}
export default QualificationChangeDrawer
