/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-03 15:33:06
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-04 18:12:46
 * @Description: 物流公司列表
 */
import React, { useState, useEffect } from 'react';
import { useIntl } from '@linkseeks/i18n';
import { ActionSheet } from '@apps/mobile-ui';
import { getLogisticsMobileSelectListCompany } from '@apps/apis';

type ActionsItem = {
  name: string,
  value: number,
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
  /**
   * 选项改变触发事件
   */
  onChange?: (value: string) => void,
}

const LogisticsCompanyList: React.FC<IProps> = (props: IProps) => {
  const { visible, onClose, onChange } = props;
  const [actions, setActions] = useState<ActionsItem[]>([]);

  const intl = useIntl()

  const getCompanyList = () => {
    getLogisticsMobileSelectListCompany({
      cooperateType: `${2}`,
    })
      .then((res) => {
        if (res.code === 1000) {
          setActions(res.data.map((item) => ({
            name: item.name,
            value: item.id,
          })));
        }
      });
  };

  useEffect(() => {
    getCompanyList();
  }, []);

  const triggerChange = (next: string) => {
    if (onChange) {
      onChange(next);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleChange = (_, next: ActionsItem) => {
    triggerChange(next.name);
    handleClose();
  };

  return (
    <ActionSheet
      isOpened={visible}
      title={intl.formatMessage({id: 'afterRecords.components.logisticsCompanyList.title',  defaultMessage: '选择物流公司' })}
      onClose={handleClose}
      actions={actions}
      onSelect={handleChange}
      cancelText={intl.formatMessage({id: 'afterRecords.components.logisticsCompanyList.cancelText',  defaultMessage: '取 消' })}
    />
  );
};

LogisticsCompanyList.defaultProps = {
  onChange: undefined,
};

export default LogisticsCompanyList;
