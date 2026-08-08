import Label from '@/components/Label'
import { useIntl } from '@linkseeks/i18n'
import { Button } from '@tarojs/components'
import { View, Image, Text, CountDown } from '@apps/mobile-ui'
import { getOssUrlPath } from '@apps/constants'
import React, { useCallback, useMemo } from 'react'
import './collageItem.scss'
import { IS_WEB } from '@/constants'

interface Iprops {
  /** 拼团id */
  id: number
  /** 采购会员名字 */
  memberName: string
  /** 采购会员logo */
  logo: string
  /** 还差几人 */
  num: number
  /** 剩余秒数 */
  endTime: number
  /** 是否邀请按钮 */
  inviteButton: boolean
  /** onJoin */
  onJoin?: (option: { id: number; isInvite: boolean; leftNum: number; endTime: number }) => void
  onShare?: (teamId: number) => void
}

const CollageItem: React.FC<Iprops> = (props: Iprops) => {
  const { id, memberName, logo, num, endTime, inviteButton, onJoin, onShare } = props
  const current = new Date().valueOf()
  const offset = Math.floor((endTime - current) / 1000)
  // const { time, formatedData } = useCountDown(offset, 'HH:mm:ss');

  const intl = useIntl()

  const handleJoin = (isDisable: boolean) => {
    console.log('onJoin')
    if (isDisable) {
      return
    }
    onJoin?.({ id, isInvite: inviteButton, endTime, leftNum: num })
  }

  const renderButton = (time: number) => {
    if (inviteButton) {
      return (
        <Button
          openType={IS_WEB ? undefined : 'share'}
          data-teamId={id}
          className="collage-btn-share"
          onClick={() => onShare?.(id)}
        >
          {intl.formatMessage({
            id: 'commodityMerge.stocksSourcing.components.collage.share',
            defaultMessage: '邀请好友',
          })}
        </Button>
      )
    }

    return (
      <View className="collage-btn-share" onClick={() => handleJoin(time < 0)}>
        {intl.formatMessage({
          id: 'commodityMerge.stocksSourcing.components.collage.join',
          defaultMessage: '参与拼团',
        })}
      </View>
    )
  }

  const formatMemberName = useMemo(() => {
    if (memberName.length <= 2) {
      return memberName
    }
    const temp = memberName.replace(/[\u4E00-\u9FA5]/g, 'AA')
    return temp.length <= 2
      ? memberName
      : `${memberName.substring(0, 1)}...${memberName.substring(memberName.length - 1, memberName.length)}`
  }, [memberName])

  return (
    <View className="collage">
      <View className="collage-user">
        {(logo && <Image className="collage-user-logo" src={logo} />) || (
          <Image className="collage-user-logo" src={getOssUrlPath(`/Images/default_logo.png`)} />
        )}
        <Text className="collage-user-name">{formatMemberName}</Text>
      </View>
      <View className="collage-right">
        <CountDown count={offset} format="HH:mm:ss">
          {(time, formatedData) => {
            return (
              <View className="collage-countdown">
                <View className="collage-num-time">
                  <Text className="collage-num">
                    <Text className="collage-num-heightlight">
                      {intl.formatMessage({ id: 'commodityMerge.stocksSourcing.components.collage.short', num: num })}
                    </Text>
                  </Text>
                  {(time > 0 && (
                    <Text className="collage-time">
                      {`${intl.formatMessage({
                        id: 'commodityMerge.stocksSourcing.components.collage.rest',
                        defaultMessage: '剩余',
                      })}`}
                      {formatedData.formatTimeString}
                    </Text>
                  )) || (
                    <Label
                      name={intl.formatMessage({
                        id: 'commodityMerge.stocksSourcing.components.collage.expired',
                        defaultMessage: '已过期',
                      })}
                    />
                  )}
                </View>
                {time > 0 && renderButton(time)}
              </View>
            )
          }}
        </CountDown>
      </View>
    </View>
  )
}

export default CollageItem
