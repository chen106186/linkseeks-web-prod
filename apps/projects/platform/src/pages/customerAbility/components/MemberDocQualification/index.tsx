/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-21 17:25:39
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-04 14:57:07
 * @Description: 会员公司资质
 */
import React, { useState } from 'react'
import { Descriptions, Popover } from 'antd'
import { getIntl } from '@linkseeks/i18n'
import { FileOutlined } from '@ant-design/icons'
import classNames from 'classnames'
import MellowCard from '@/components/MellowCard'
import styles from './index.less'
import { AlertFillIcon, EditCircleFillIcon, PlusFillIcon } from '@linkseeks/icons'
import { getWebIntl, useWebIntl } from '@apps/locales'

export type ValueType = {
  /**
   * 文件url
   */
  url: string
  /**
   * 文件名称
   */
  name: string
  /**
   * 到期日
   */
  expireDay: string
  /**
   * 有效期
   */
  permanent: number
  /**
   * 文件url（变更前）
   */
  lastUrl?: string
  /**
   * 文件名称（变更前）
   */
  lastName?: string
  /**
   * 到期日（变更前）
   */
  lastExpireDay?: string
  /**
   * 有效期（变更前）
   */
  lastPermanent?: number
}

interface IProps {
  /**
   * 数据
   */
  dataSource: ValueType[]
  /**
   * 是否显示变更 默认 false
   */
  showNew?: boolean
}

const imgReg = /\.(png|jpg|gif|jpeg|webp)$/
const intl = getIntl()

/** 生成变更标识，expireDay有值时生成到期日变更的气泡内容*/
const MakeImgTip = (props: {
  iconNode: React.ReactNode
  color: string
  title: string
  imgUrl?: string
  expireDay?: string
}) => {
  const { iconNode, color, title, imgUrl, expireDay } = props
  const content = (
    <div>
      <div className={styles['tippop-title']}>
        <span style={{ color }} className={styles['tippop-title-icon']}>
          {iconNode}
        </span>
        {title}
      </div>

      {
        /** 图片 */
        !!imgUrl ? (
          imgReg.test(imgUrl) ? (
            <img src={imgUrl} style={{ margin: '10px 0 0 30px' }} />
          ) : (
            <a href={imgUrl} target="__black">
              <FileOutlined style={{ fontSize: 36 }} />
            </a>
          )
        ) : null
      }
      {
        /** 到期日期 */
        !!expireDay ? <span style={{ margin: '10px 0 0 30px', color: '#909399' }}>{expireDay}</span> : null
      }
    </div>
  )
  if (!!expireDay) {
    return content
  }
  return (
    <Popover content={content}>
      <div style={{ color, fontSize: 20 }}>{iconNode}</div>
    </Popover>
  )
}
/** 生成无变更标识的资质证明列表 */
const randerNoTipImg = (dataSource, urlFileName, dateFileName, permanentName) => {
  const translate = getWebIntl()
  return dataSource
    .filter((item) => !!item[urlFileName] || !!item[dateFileName])
    .map((item, index) => (
      <li key={index} className={styles['qualification-item']}>
        <div className={styles['qualification-item-wrap']}>
          <div
            className={classNames(styles['qualification-item-left'], {
              [styles['qualification-item-left-file']]: !imgReg.test(item[urlFileName]),
            })}
          >
            {imgReg.test(item[urlFileName]) ? (
              <img src={item[urlFileName]} />
            ) : (
              <a href={item[urlFileName]} target="__black">
                <FileOutlined style={{ fontSize: 36 }} />
              </a>
            )}
          </div>
          <div className={styles['qualification-item-right']}>
            <Descriptions column={1}>
              <Descriptions.Item
                label={intl.formatMessage({
                  id: 'customerAbility.components.MemberDocQualification.expireDay',
                })}
              >
                {(item[permanentName] !== 1 && item[dateFileName]) ||
                  intl.formatMessage({
                    id: 'customerAbility.components.MemberDocQualification.expireDay.nothing',
                  })}
              </Descriptions.Item>
              <Descriptions.Item
                label={intl.formatMessage({
                  id: 'customerAbility.components.MemberDocQualification.permanent',
                })}
                style={{ paddingBottom: 0 }}
              >
                {item[permanentName] === 1
                  ? intl.formatMessage({
                      id: 'customerAbility.components.QualitiesUploadFormItem.permanent.infinite',
                      defaultMessage: '长期有效',
                    })
                  : translate('web.common.fou')}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>
      </li>
    ))
}
const MemberDocQualification: React.FC<IProps> = (props: IProps) => {
  const { dataSource = [], showNew = false, ...rest } = props
  const [currentBtn, setCurrentBtn] = useState('after')

  const translate = useWebIntl()
  return (
    <MellowCard
      title={intl.formatMessage({
        id: 'customerAbility.components.MemberDocQualification.title',
        defaultMessage: '资质证明',
      })}
      extra={
        showNew && (
          <div>
            <span
              onClick={() => setCurrentBtn('before')}
              className={classNames(styles['change-btn-none'], {
                [styles['change-btn-active']]: currentBtn === 'before',
              })}
            >
              {translate('web.resource.member.biangengqian')}
            </span>
            <span
              onClick={() => setCurrentBtn('after')}
              className={classNames(styles['change-btn-none'], {
                [styles['change-btn-active']]: currentBtn === 'after',
              })}
            >
              {translate('web.resource.member.biangenghou')}
            </span>
          </div>
        )
      }
      {...rest}
    >
      <ul className={styles.qualification}>
        {showNew
          ? currentBtn === 'after'
            ? dataSource.map((item, index) => {
                const isAdd = !!item.url && !item.lastUrl // 新增：有新值无旧值
                const isDel = !item.url && !!item.lastUrl // 删除：无新值有旧值
                const isEdit = !isAdd && !isDel && item.url !== item.lastUrl // 编辑：新旧值不一致，且非新增，非删除
                return (
                  <li key={index} className={styles['qualification-item']}>
                    <div className={styles['qualification-item-wrap']}>
                      <div
                        className={classNames(styles['qualification-item-left'], {
                          [styles['qualification-item-left-file']]:
                            !imgReg.test(item.url) || !imgReg.test(item.lastUrl),
                        })}
                      >
                        {/* 当前无图片时，显示旧图片（若有） */}
                        {imgReg.test(item.url) ? (
                          <img src={item.url} />
                        ) : imgReg.test(item.lastUrl) ? (
                          <div className={styles.mask}>
                            <img src={item.lastUrl} />
                          </div>
                        ) : (
                          <a href={item.url} target="__black">
                            <FileOutlined style={{ fontSize: 36 }} />
                          </a>
                        )}
                        <div className={styles['qualification-item-icon']}>
                          {isAdd && (
                            <MakeImgTip
                              iconNode={<PlusFillIcon />}
                              color={'#04a68a'}
                              title={translate('web.resource.member.dangqianxinzeng')}
                            />
                          )}
                          {isDel && (
                            <MakeImgTip
                              iconNode={<AlertFillIcon />}
                              color={'#e15058'}
                              title={translate('web.resource.member.dangqianshanchu')}
                            />
                          )}
                          {isEdit && (
                            <MakeImgTip
                              iconNode={<EditCircleFillIcon />}
                              color={'#4888f1'}
                              title={translate('web.resource.member.shujubiangeng')}
                              imgUrl={item.lastUrl}
                            />
                          )}
                        </div>
                      </div>
                      <div className={styles['qualification-item-right']}>
                        <Descriptions column={1}>
                          <Descriptions.Item
                            label={intl.formatMessage({
                              id: 'customerAbility.components.MemberDocQualification.expireDay',
                            })}
                            contentStyle={{ alignItems: 'center' }}
                          >
                            {isDel
                              ? '-'
                              : (item.permanent !== 1 && item.expireDay) ||
                                intl.formatMessage({
                                  id: 'customerAbility.components.MemberDocQualification.expireDay.nothing',
                                })}
                            {
                              /** 到期日变更，显示修改标识 */
                              !!item.expireDay && !!item.lastExpireDay && item.expireDay !== item.lastExpireDay ? (
                                <Popover
                                  content={
                                    <MakeImgTip
                                      iconNode={<EditCircleFillIcon />}
                                      color={'#4888f1'}
                                      title={translate('web.resource.member.shujubiangeng')}
                                      expireDay={item.lastExpireDay}
                                    />
                                  }
                                >
                                  <EditCircleFillIcon className={styles['qualification-item-right-icon']} />
                                </Popover>
                              ) : null
                            }
                          </Descriptions.Item>
                          <Descriptions.Item
                            label={intl.formatMessage({
                              id: 'customerAbility.components.MemberDocQualification.permanent',
                            })}
                            style={{ paddingBottom: 0 }}
                          >
                            {isDel
                              ? '-'
                              : item.permanent === 1
                              ? intl.formatMessage({
                                  id: 'customerAbility.components.QualitiesUploadFormItem.permanent.infinite',
                                  defaultMessage: translate('web.common.changqiyouxiao'),
                                })
                              : translate('web.common.fou')}
                          </Descriptions.Item>
                        </Descriptions>
                      </div>
                    </div>
                  </li>
                )
              })
            : // 显示变更，且显示内容为变更前
              randerNoTipImg(dataSource, 'lastUrl', 'lastExpireDay', 'lastPermanent')
          : // 不展示变更，直接显示当前内容
            randerNoTipImg(dataSource, 'url', 'expireDay', 'permanent')}
      </ul>
    </MellowCard>
  )
}

export default MemberDocQualification
