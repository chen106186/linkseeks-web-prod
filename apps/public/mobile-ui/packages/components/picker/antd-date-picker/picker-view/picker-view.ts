import React, { FC, memo, useCallback, useEffect, useState } from 'react';
import { mergeProps } from '../utils/with-default-props';
import { Wheel } from './wheel';
import { useColumns } from './use-columns';
import { withNativeProps } from '../utils/native-props';
import { usePickerValueExtend } from './use-picker-value-extend';
import useDebounceEffect from '../hooks/useDebounceEffect';
import { PickerViewProps } from '../../../../types/picker';
const classPrefix = `adm-picker-view`;
const defaultProps = {
  defaultValue: []
};
export const PickerView: FC<PickerViewProps> = memo(p => {
  const props = mergeProps(defaultProps, p);
  const [innerValue, setInnerValue] = useState(props.value === undefined ? props.defaultValue : props.value);
  useDebounceEffect(() => {
    var _a;

    if (props.value === innerValue) return;
    (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, innerValue, generateValueExtend(innerValue));
  }, [innerValue], {
    wait: 0,
    leading: false,
    trailing: true
  }); // Sync `value` to `innerValue`

  useEffect(() => {
    if (props.value === undefined) return; // Uncontrolled mode

    if (props.value === innerValue) return;
    setInnerValue(props.value);
  }, [props.value]);
  useEffect(() => {
    if (props.value === innerValue) return;
    const timeout = window.setTimeout(() => {
      if (props.value !== undefined && props.value !== innerValue) {
        setInnerValue(props.value);
      }
    }, 1000);
    return () => {
      window.clearTimeout(timeout);
    };
  }, [props.value, innerValue]);
  const columns = useColumns(props.columns, innerValue);
  const generateValueExtend = usePickerValueExtend(columns);
  const handleSelect = useCallback((val, index) => {
    setInnerValue(prev => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  }, []);
  return withNativeProps(props, React.createElement("div", {
    className: `${classPrefix}`
  }, columns.map((column, index) => React.createElement(Wheel, {
    key: index,
    index: index,
    column: column,
    value: innerValue[index],
    onSelect: handleSelect
  } as any)), React.createElement("div", {
    className: `${classPrefix}-mask`
  }, React.createElement("div", {
    className: `${classPrefix}-mask-top`
  }), React.createElement("div", {
    className: `${classPrefix}-mask-middle`
  }), React.createElement("div", {
    className: `${classPrefix}-mask-bottom`
  }))));
});
PickerView.displayName = 'PickerView';
