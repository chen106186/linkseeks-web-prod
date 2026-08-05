import { Modal } from 'antd';
import React from 'react';
import styles from './index.less'
import wechat from '@/assets/imgs/wechat_icon.png';
import alipay from '@/assets/imgs/alipay_icon.png';

interface Iprops {
  mode: 'wechat' | 'alipay'
  visible: boolean,
  qrcode: string,
  onClose: () => void,
  onOk: () => void
}

const MODE_TEXT = {
  wechat: '微信',
  alipay: '支付宝'
}
const QrcodeModal: React.FC<Iprops> = (props: Iprops) => {
  const { mode, visible, qrcode, onClose, onOk } = props;
  const currentImage = mode === 'wechat' ? wechat : alipay;

  const handleClose = () => {
    onClose?.()
  }
  const handleOk = () => {
    onOk?.();
  }

  return (
    <Modal
      visible={visible}
      title={`请用${MODE_TEXT[mode]}支付`}
      onCancel={handleClose}
      okText="我已付款"
      onOk={handleOk}
    >
      <div className={styles.container}>
        <div className={styles.tips}>
          <img className={styles.modeImage} src={currentImage} />
          <div>{`请打开${MODE_TEXT[mode]}扫一扫`}</div>
        </div>
        <div className={styles.qrcode}>
          <img src={qrcode} />
        </div>
      </div>
    </Modal>
  )
}

export default QrcodeModal
