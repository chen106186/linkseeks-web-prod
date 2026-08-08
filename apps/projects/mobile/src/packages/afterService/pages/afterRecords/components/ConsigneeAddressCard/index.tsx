/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-03 13:55:43
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-03 16:10:40
 * @Description: 商品回寄地址Card
 */
import React from 'react';
import { useIntl } from '@linkseeks/i18n';
import MellowCard from '@/components/MellowCard';
import Cell from '@/components/Cell';

interface ConsigneeAddressCardProps {
  /**
   * 数据，数据待定
   */
  data: {
    /**
     * 收件人
     */
    receiveUserName: string,
    /**
     * 收件人电话
     */
    receiveUserTel: string,
    /**
     * 收件完整地址
     */
    receiveAddress: string,
  },
  /**
   * 自定义外部样式
   */
  customStyle?: React.CSSProperties,
}

const ConsigneeAddressCard: React.FC<ConsigneeAddressCardProps> = (props: ConsigneeAddressCardProps) => {
  const {
    data,
    customStyle,
  } = props;

  const intl = useIntl()

  return (
    <MellowCard
      title={intl.formatMessage({id: 'afterRecords.components.consigneeAddress.title',  defaultMessage: '商品寄回信息' })}
      headStyle={{
        borderBottomWidth: 0,
      }}
      bodyStyle={{
        padding: 0,
      }}
      style={customStyle}
    >
      <Cell>
        <Cell.Item title={intl.formatMessage({id: 'afterRecords.components.consigneeAddress.receiveAddress',  defaultMessage: '寄回地址' })} value={data.receiveAddress} />
        <Cell.Item title={intl.formatMessage({id: 'afterRecords.components.consigneeAddress.receiveUserName',  defaultMessage: '收货人' })} value={data.receiveUserName} />
        <Cell.Item title={intl.formatMessage({id: 'afterRecords.components.consigneeAddress.receiveUserTel',  defaultMessage: '联系电话' })} value={data.receiveUserTel} />
      </Cell>
    </MellowCard>
  );
};

ConsigneeAddressCard.defaultProps = {
  customStyle: {},
};

export default ConsigneeAddressCard;
