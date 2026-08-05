import { useCallback, useState } from 'react';
import useUpdateEffect from './useUpdateEffect';

export interface Options<T> {
  defaultValue?: T;
  defaultValuePropName?: string;
  valuePropName?: string;
  trigger?: string;
}

export interface Props {
  [key: string]: any;
}

/**
 * 当想组件状态即可被自身控制， 也可被外部的props控制时使用
 */
export default function useControlProps<T>(props: Props = {}, options: Options<T> = {}) {
  const {
    defaultValue,
    defaultValuePropName = 'defaultValue',
    valuePropName = 'value',
    trigger = 'onChange',
  } = options;

  const value = props[valuePropName];

  const [state, setState] = useState<T>(() => {
    if (valuePropName in props) {
      return value;
    }
    if (defaultValuePropName in props) {
      return props[defaultValuePropName];
    }
    return defaultValue;
  });

  /* init 的时候不用执行了 */
  useUpdateEffect(() => {
    if (valuePropName in props) {
      setState(value);
    }
  }, [value, valuePropName]);

  const handleSetState = useCallback(
    (v: T) => {
      if (!(valuePropName in props)) {
        setState(v);
      }
      if (props[trigger]) {
        props[trigger](v);
      }
    },
    [props, valuePropName, trigger],
  );

  return [state, handleSetState] as const;
}
