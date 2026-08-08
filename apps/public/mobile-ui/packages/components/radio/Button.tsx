/*
 * @Author: XieZhiXiong
 * @Date: 2021-03-10 17:28:06
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-04 21:04:26
 * @Description: 按钮单选框
 */
import React, { useContext } from 'react';
import cx from 'classnames';
import Text from '../text';
import View from '../view';
import { RadioContext } from './Group';
import { RadioButtonProps } from '../../types/radio';

const RadioButton = (props: RadioButtonProps) => {
  const {
    value,
    size = 'middle',
    disabled,
    theme = 'dark',
    children,
  } = props;

  const radioContext = useContext(RadioContext);

  const finalDisabled = radioContext.disabled || disabled;
  const finalSize = radioContext.buttonSize || size;
  const finalTheme = radioContext.theme || theme;

  const handleClick = () => {
    if (finalDisabled) {
      return;
    }
    if (radioContext.toggleChange) {
      radioContext.toggleChange(value);
    }
  };

  const check = value === radioContext.value;

  const contentNode = typeof children !== 'object' ? (
    <Text
      className={cx(
        'radio-button-label',
        `radio-button-label__${finalTheme}`,
        check && `radio-button-label__${finalTheme}_active`,
        finalDisabled &&'radio-label__disabled',
      )}
    >
      {children}
    </Text>
  ) : children;

  const viewClass = cx(
    'radio-button',
    `radio-button__${finalTheme}`,
    `radio-button__${finalSize}`,
    check && `radio-button__${finalTheme}_active`,
    finalDisabled && 'radio-button__disabled',
    check && finalDisabled && 'radio-button__check_disabled'
  )
  return (
    <View
      onClick={handleClick}
      className={viewClass}
    >
      {!!children && (
        contentNode
      )}
    </View>
  );
};

RadioButton.defaultProps = {
  size: 'middle',
  disabled: false,
  theme: 'dark',
  children: null,
};

RadioButton.displayName = 'Radio.Button';

export default RadioButton;
