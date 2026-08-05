import { createUpdateEffect } from '../hooks/createUpdateEffect';
import useIsomorphicLayoutEffect from '../hooks/useIsomorphicLayoutEffect';
export const useIsomorphicUpdateLayoutEffect = createUpdateEffect(useIsomorphicLayoutEffect);
