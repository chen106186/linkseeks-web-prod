import React from 'react'
import Overlay from '@/components/Overlay';
import { useIntl } from '@linkseeks/i18n';
import { Icons, View, ScrollView } from '@apps/mobile-ui';
import styles from './collageModal.module.scss';
import CollageItem from './collageItem';
import useGetTeamData from '../../detailGroup/hooks/useGetTeamData';

interface Iprops {
  onClose?: () => void,
  /** 商品id */
  commodityId: number,
  visible: boolean,
  onJoin: (params: { teamId: number, isInvite: boolean, leftNum: number, endTime: number }) => void

}

const CollageModal = (props: Iprops) => {
  const { onClose, commodityId, visible, onJoin } = props;
  const { teamList, teamHasMore, teamLoading, handleLoadMore } = useGetTeamData({ commodityId: +commodityId, initPageSize: 10, visible })

  const intl = useIntl()

  const handleJoin = (params: { id: number, isInvite: boolean, leftNum: number, endTime: number }) => {
    onJoin({ teamId: params.id, isInvite: params.isInvite, leftNum: params.leftNum, endTime: params.endTime });
  }

  const handleOnClose = () => {
    onClose?.();
  }


  const renderFooter = () => {
    if (teamHasMore) {
      return null
    }
    if (teamLoading) {
      return (
        <View className={styles.footerLoading}>
          {intl.formatMessage({id: 'commodityMerge.stocksSourcing.components.collage.loading',  defaultMessage: '加载中' })}
        </View>
      )
    }
    return null
  }

  return (
    <Overlay
      position='center'
      visible={visible}
    >
      <View className={styles.container}>
        <View className={styles['modal']}>
          <View className={styles['modal-header']}>{intl.formatMessage({id: 'commodityMerge.stocksSourcing.components.collage.joining',  defaultMessage: '正在拼团' })}</View>
          <View className={styles['modal-content']}>
            <ScrollView
              onEndReachedThreshold={50}
              refresherEnabled={false}
              onEndReached={handleLoadMore}
              listFooterComponent={renderFooter}
              className={styles.scrollView}
            >
              {
                teamList.map((_item) => {
                  return (
                    <CollageItem key={_item.id} {..._item} onJoin={handleJoin} />
                  )
                })
              }
            </ScrollView>
          </View>
        </View>
        <View className={styles['modal-close']} onClick={handleOnClose}>
          <Icons name='Close' size={16} color='#fff' />
        </View>
      </View>
    </Overlay>
  )
}

export default CollageModal;
