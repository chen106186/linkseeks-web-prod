/*
 * @Author: XieZhiXiong
 * @Date: 2021-09-07 11:39:12
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-11 13:47:11
 * @Description: 退货申请信息 Popup
 */
import React from 'react';
import { useIntl } from '@linkseeks/i18n';
import { Text, View } from '@apps/mobile-ui';
import Popup from '@/components/Popup';
import Cell from '@/components/Cell';
import Copy from '@/components/Copy';
import Gap from '../Gap';
import styles from './index.module.scss';

export interface ApplyData {
  /**
   * 申请单号
   */
  applyNo?: string
  /**
   * 供应会员名称
   */
  supplierName?: string
  /**
   * 单据时间
   */
  applyTime?: string
}

interface IProps {
  /**
   * 售后类型，1 维修 2 退货 3 换货
   */
  afterType: 1 | 2 | 3,
  /**
   * 是否可见
   */
  visible: boolean,
  /**
   * 关闭事件
   */
  onClose: () => void,
  /**
   * 当前值
   */
  data: ApplyData,
}

const AsInfoPopup: React.FC<IProps> = (props: IProps) => {
  const {
    visible,
    onClose,
    data,
    afterType,
  } = props;

  const intl = useIntl();

  const AFTER_TYPE_NAME_MAP: { [key: number]: string } = {
    1: intl.formatMessage({id: 'afterRecords.components.asInfoPopup.repair',  defaultMessage: '维修' }),
    2: intl.formatMessage({id: 'afterRecords.components.asInfoPopup.refund',  defaultMessage: '退货' }),
    3: intl.formatMessage({id: 'afterRecords.components.asInfoPopup.exchange',  defaultMessage: '换货' }),
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const deliveryInfo = [
    {
      key: 1,
      title: intl.formatMessage({id: 'afterRecords.components.asInfoPopup.applyNo',  afterType: AFTER_TYPE_NAME_MAP[afterType] }),
      value: (
        <Copy description={data.applyNo} text={data.applyNo || ''} />
      ),
    },
    {
      key: 2,
      title: intl.formatMessage({id: 'afterRecords.components.asInfoPopup.supplierName',  defaultMessage: '店铺名称' }),
      value: data.supplierName,
    },
    {
      key: 3,
      title: intl.formatMessage({id: 'afterRecords.components.asInfoPopup.applyTime',  defaultMessage: '申请时间' }),
      value: data.applyTime,
    },
  ];

  return (
    <Popup
      visible={visible}
      onClose={handleClose}
      title={intl.formatMessage({id: 'afterRecords.components.asInfoPopup.applyInfo',  afterType: AFTER_TYPE_NAME_MAP[afterType] })}
      customStyle={{
        backgroundColor: '#FFF',
      }}
    >
      <View className={styles['as-info']}>
        <View
          className={styles['as-info-item']}
        >
          <View className={styles['as-info-item-content']}>
            <Cell border={false} transposition>
              {deliveryInfo.map((item) => (
                <Cell.Item
                  key={item.key}
                  title={item.title}
                  value={item.value}
                  border
                />
              ))}
            </Cell>
          </View>
        </View>
      </View>
      <Gap height={165} />
    </Popup>
  );
};

AsInfoPopup.defaultProps = {};

export default AsInfoPopup;
