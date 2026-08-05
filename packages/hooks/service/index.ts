import { useMemo } from 'react'

interface ServiceClass<T extends new (...args: any[]) => any> {
  serviceClass: T
  serviceProps?: ConstructorParameters<T>[0]
}

/**
 * 快速获取到service的指定memo实例
 */
export function useServiceMemo<T extends ServiceClass<any>[]>(
  serviceList: [...T],
): {
  [K in keyof T]: T[K]['serviceProps'] extends undefined
    ? InstanceType<T[K]['serviceClass']>
    : InstanceType<T[K]['serviceClass']>
} {
  return serviceList.map(({ serviceClass, serviceProps }) =>
    useMemo(() => new serviceClass(serviceProps), [serviceClass, serviceProps]),
  ) as any
}
