import { useState, useMemo } from 'react';

interface stringMethods {
  [key: string]: (...args) => any
}

/**
 * @description 传入一个值和方法map， 返回对应控制该状态的fn
 * @param initialValue 初始状态
 * @param methods 控制状态的方法集合对象
 * @author xjm
 */
export const useMethods = <T>(initialValue: T, methods: stringMethods) => {
    const [value, setValue] = useState<T>(initialValue);
    const boundMethods = useMemo(
        () => Object.entries(methods).reduce(
            (methods, [name, fn]) => {
                const method = (...args) => {
                    setValue(value => fn(value, ...args));
                };
                methods[name] = method;
                return methods;
            },
            {}
        ),
        [methods]
    );
    return [value, boundMethods];
};