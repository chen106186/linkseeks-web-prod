/*
 * @Author: XieZhiXiong
 * @Date: 2021-04-13 10:48:00
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-08 18:28:20
 * @Description: 内、外部状态过滤
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
} from '@apps/mobile-ui';
import FilterModal, { IProps as FilterModalProps } from './index';
import Group from './components/Group';
import DateGroup, { DateRangeValueType } from './components/DateGroup';
import './index.scss';
import { useIntl } from '@linkseeks/i18n';

export interface StatusItem {
  /**
   * 状态名称
   */
  name: string,
  /**
   * 状态值
   */
  status: number,
}

interface IProps extends FilterModalProps {
  /**
   * 外部状态
   */
  outerStatus: StatusItem[],
  /**
   * 内部状态
   */
  innerStatus: StatusItem[],
  /**
   * 外部状态值
   */

  outerStatusValue?: number,
  /**
   * 外部状态值
   */

  innerStatusValue?: number,
  /**
   * 外部状态值改变
   */
  onOuterStatusChange?: (value: number) => void,
  /**
   * 内部状态值改变
   */
  onInnerStatusChange?: (value: number) => void,
  /**
   * 时间组改变
   */
  onDateGroupChange?: (value: DateRangeValueType | undefined) => void,
  /**
   * 重置事件
   */
  onReset?: () => void,
  /**
   * 确认事件，参数 当前外部状态、当前内部状态
   */
  onConfirm: (outerStatus: number, innerStatus: number, dateGroup: DateRangeValueType['range']) => void,
}

const StatusFilterModal: React.FC<IProps> = (props: IProps) => {
  const {
    renderHeaderComponent,
    visible,
    onClose,
    outerStatus,
    innerStatus,
    outerStatusValue,
    innerStatusValue,
    onOuterStatusChange,
    onInnerStatusChange,
    onDateGroupChange,
    onReset,
    onConfirm,
  } = props;
  const [curOuterStatus, setCurOuterStatus] = useState(0);
  const [curInnerStatus, setCurInnerStatus] = useState(0);
  const [curDateGroupValue, setCurDateGroup] = useState<DateRangeValueType | undefined>(undefined);
  const intl = useIntl()
  const dateGroupRangeRef = useRef<DateRangeValueType['range']>([]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  useEffect(() => {
    if ('outerStatusValue' in props) {
      setCurOuterStatus(outerStatusValue!);
    }
  }, [outerStatusValue]);

  useEffect(() => {
    if ('innerStatusValue' in props) {
      setCurInnerStatus(innerStatusValue!);
    }
  }, [innerStatusValue]);

  const handleOuterChange = (status: number) => {
    if (!('outerStatusValue' in props)) {
      setCurOuterStatus(status);
    }
    if (onOuterStatusChange) {
      onOuterStatusChange(status);
    }
  };

  const handleInnerChange = (status: number) => {
    if (!('innerStatusValue' in props)) {
      setCurInnerStatus(status);
    }
    if (onInnerStatusChange) {
      onInnerStatusChange(status);
    }
  };

  const handleDateGroupChange = (value: DateRangeValueType) => {
    if (!('dateGroupValue' in props)) {
      setCurDateGroup(value);
    }
    if (onDateGroupChange) {
      onDateGroupChange(value);
    }
    dateGroupRangeRef.current = value.range;
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    }
    if (!('outerStatusValue' in props)) {
      setCurOuterStatus(0);
    }
    if (onOuterStatusChange) {
      onOuterStatusChange(0);
    }
    if (!('innerStatusValue' in props)) {
      setCurInnerStatus(0);
    }
    if (onInnerStatusChange) {
      onInnerStatusChange(0);
    }

    if (!('dateGroupValue' in props)) {
      setCurDateGroup(undefined);
    }
    if (onDateGroupChange) {
      onDateGroupChange(undefined);
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(curOuterStatus, curInnerStatus, dateGroupRangeRef.current);
    }
  };

  return (
    <FilterModal
      renderHeaderComponent={renderHeaderComponent}
      visible={visible}
      onClose={handleClose}
    >
      <View className='status'>
        <ScrollView className='status-scroll-view'>
          <DateGroup
            value={curDateGroupValue?.value}
            onChange={handleDateGroupChange}
          />
          <Group
            title={intl.formatMessage({id: 'filterModal_outerStatus', defaultMessage: '外部状态'})}
            dataSource={outerStatus.map((item) => ({ name: item.name, value: item.status }))}
            onClick={(value) => handleOuterChange(+value)}
            value={curOuterStatus}
          />
          <Group
            title={intl.formatMessage({id: 'filterModal_innerStatus', defaultMessage: '内部状态'})}
            dataSource={innerStatus.map((item) => ({ name: item.name, value: item.status }))}
            onClick={(value) => handleInnerChange(+value)}
            value={curInnerStatus}
          />
          <View className='gap' />
        </ScrollView>
      </View>
      <View className='actions'>
        <View className='actions-item'>
          <View
            onClick={handleReset}
            className='button-wrap__block'
          >
            <View
              className='button button-large button__block'
            >
              <Text
                className='button-text button-large-text'
              >
                {intl.formatMessage({id: 'filterModal_reset', defaultMessage: '重置'})}
              </Text>
            </View>
          </View>
        </View>
        <View className='actions-item'>
          <View
            onClick={handleConfirm}
            className='button-wrap__block'
          >
            <View
              className='button button-primary button-large button__block'
            >
              <Text
                className='button-text button-primary-text button-large-text'
              >
                {intl.formatMessage({id: 'filterModal_confirm', defaultMessage: '确定'})}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </FilterModal>
  );
};

StatusFilterModal.defaultProps = {
  onOuterStatusChange: undefined,
  onInnerStatusChange: undefined,
  onReset: undefined,
};

export default StatusFilterModal;
