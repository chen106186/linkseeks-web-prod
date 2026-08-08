/*
 * @Author: XieZhiXiong
 * @Date: 2021-03-11 20:05:02
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-03-12 10:17:38
 * @Description: 多选组
 */
import { CheckboxData } from '../../types/checkbox';
import React from 'react';



export const CheckboxContext = React.createContext<CheckboxData>({
  value: [],
  toggleChange: undefined,
  disabled: false,
  size: 22,
});

interface CheckboxGroupProps {
  /**
   * 当前选中值
   */
  value?: (string | number)[];
  /**
   * 默认选中值当前选中值
   */
  defaultValue?: (string | number)[];
  /**
   * 选项变化时的回调函数
   */
  onChange?: (value: (string | number)[]) => void;
  /**
   * 禁选所有子单选器
   */
  disabled?: boolean,
  /**
   * 单选框大小，默认22，只对 单选样式生效
   */
  size?: number,

  children?: React.ReactNode,
}

interface CheckboxGroupState {
  value: any,
  toggleChange: (value: (string | number)[]) => void | undefined,
}

class CheckboxGroup extends React.Component<CheckboxGroupProps, CheckboxGroupState> {
  static getDerivedStateFromProps(nextProps: CheckboxGroupProps) {
    const { value } = nextProps;

    if ('value' in nextProps) {
      return {
        value,
      };
    }
    return null;
  }

  constructor(props: CheckboxGroupProps) {
    super(props);
    this.state = {
      value: props.defaultValue || [],
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
    const { disabled, size, children } = this.props;

    return (
      <CheckboxContext.Provider
        value={{
          ...this.state,
          disabled: !!disabled,
          size: size as number,
        }}
      >
        {children}
      </CheckboxContext.Provider>
    );
  }
}

export default CheckboxGroup;
