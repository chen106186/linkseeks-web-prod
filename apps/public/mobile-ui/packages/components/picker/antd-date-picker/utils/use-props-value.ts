import { useRef } from 'react';
import useMemoizedFn from '../hooks/useMemoizedFn';
import useUpdate from '../hooks/useUpdate';
export function usePropsValue(options) {
  const {
    value,
    defaultValue,
    onChange
  } = options;
  const update = useUpdate();
  const stateRef = useRef(value !== undefined ? value : defaultValue);

  if (value !== undefined) {
    stateRef.current = value;
  }

  const setState = useMemoizedFn(v => {
    if (value === undefined) {
      stateRef.current = v;
      update();
    }

    onChange === null || onChange === void 0 ? void 0 : onChange(v);
  });
  return [stateRef.current, setState];
}
