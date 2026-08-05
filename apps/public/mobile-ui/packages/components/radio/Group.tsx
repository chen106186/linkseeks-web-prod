import React from 'react';
import cx from 'classnames'
import View from '../view';
import { RadioData, RadioGroupState, RadioGroupProps  } from '../../types/radio';

export const RadioContext = React.createContext<RadioData>({
  value: '',
  toggleChange: undefined,
  disabled: false,
  size: 22,
  buttonSize: 'middle',
  theme: 'dark',
});

class RadioGroup extends React.Component<RadioGroupProps, RadioGroupState> {
  static getDerivedStateFromProps(nextProps: RadioGroupProps) {
    const { value } = nextProps;

    if ('value' in nextProps) {
      return {
        value,
      };
    }
    return null;
  }

  constructor(props: RadioGroupProps) {
    super(props);
    this.state = {
      value: props.defaultValue,
      toggleChange: this.toggleChange,
    };
  }

  toggleChange = (next: any) => {
    const { value } = this.state;
    const { onChange } = this.props;
    if (next === value) {
      return;
    }

    if (!('value' in this.props)) {
      this.setState({
        value: next,
      });
    }
    if (onChange) {
      onChange(next);
    }
  };

  render() {
    const {
      disabled,
      size,
      buttonSize,
      customStyle,
      theme = 'dark',
      type,
      children,
    } = this.props;

    return (
      <View
        className={cx('radio-button-group', type === 'radio.button' && `radio-button-group__${theme}`)}
        style={customStyle}
      >
        <RadioContext.Provider
          value={{
            ...this.state,
            disabled: !!disabled,
            size: size as number,
            buttonSize: buttonSize as string,
            theme,
          }}
        >
          {children}
        </RadioContext.Provider>
      </View>
    );
  }
}

export default RadioGroup;
