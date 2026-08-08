import React, { useContext } from 'react';
import Icons from '../icons';
import View from '../view';
import Text from '../text';
import RadioGroup, { RadioContext } from './Group';
import RadioButton from './Button';
import cx from 'classnames'
import { RadioProps } from '../../types/radio';

const Radio = (props: RadioProps) => {
  const {
    value,
    color,
    size = 22,
    disabled,
    children,
  } = props;

  const radioContext = useContext(RadioContext);

  const finalColor = color;
  const finalDisabled = radioContext.disabled || disabled;
  const finalSize = radioContext.size || size;

  const handleClick = () => {
    if (finalDisabled) {
      return;
    }
    if (radioContext.toggleChange) {
      radioContext.toggleChange(value);
    }
  };

  const contentNode = typeof children !== 'object' ? (
    <Text
      className={cx('radio-label', finalDisabled && 'radio-label__disabled')}
    >
      {children}
    </Text>
  ) : children;

  const check = value === radioContext.value;

  const iconMergeStyle = Object.assign({
    width: finalSize,
    height: finalSize,
  }, check ? {
    backgroundColor: finalColor,
    borderColor: finalColor,
  } : null,)
  return (
    <View
      className='radio'
      onClick={handleClick}
    >
      <View
        className={cx('radio-icon', check ? 'radio-icon__check' : null, finalDisabled ? 'radio-icon__disabled' : null)}
        style={iconMergeStyle}
      >
        <Icons
          name="Right"
          size={finalSize - 4}
          color={!finalDisabled ? '#FFFFFF' : '#c8c9cc'}
          customStyle={{
            opacity: check ? 1 : 0,
          }}
        />
      </View>
      {!!children && (
        contentNode
      )}
    </View>
  );
};

Radio.defaultProps = {
  size: 22,
  disabled: false,
  children: null,
};

Radio.displayName = 'Radio';

Radio.Group = RadioGroup;
Radio.Button = RadioButton;

export default Radio;
