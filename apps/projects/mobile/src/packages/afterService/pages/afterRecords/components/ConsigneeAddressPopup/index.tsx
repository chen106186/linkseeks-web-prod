/*
 * @Author: XieZhiXiong
 * @Date: 2021-09-07 15:47:46
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-11 15:10:15
 * @Description: 商品回寄地址Popup
 */
import React from 'react';
import { useIntl } from '@linkseeks/i18n';
import Popup from '@/components/Popup';
import Cell from '@/components/Cell';
import Gap from '../Gap';

export interface ApplyData {
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
}

interface IProps {
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

const ConsigneeAddressPopup: React.FC<IProps> = (props: IProps) => {
  const {
    visible,
    onClose,
    data,
  } = props;

  const intl = useIntl()

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <Popup
      visible={visible}
      onClose={handleClose}
      title={intl.formatMessage({id: 'afterRecords.components.consigneeAddress.title',  defaultMessage: '商品寄回信息' })}
      customStyle={{
        backgroundColor: '#FFF',
      }}
    >
      <Cell border={false} transposition>
        <Cell.Item title={intl.formatMessage({id: 'afterRecords.components.consigneeAddress.receiveAddress',  defaultMessage: '寄回地址' })} value={data.receiveAddress} />
        <Cell.Item title={intl.formatMessage({id: 'afterRecords.components.consigneeAddress.receiveUserName',  defaultMessage: '收货人' })} value={data.receiveUserName} />
        <Cell.Item title={intl.formatMessage({id: 'afterRecords.components.consigneeAddress.receiveUserTel',  defaultMessage: '联系电话' })} value={data.receiveUserTel} />
      </Cell>
      <Gap height={165} />
    </Popup>
  );
};

export default ConsigneeAddressPopup;
