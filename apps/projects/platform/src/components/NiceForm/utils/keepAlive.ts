import { get, set, remove } from './session';

const STATE_KEY = 'currentState';

export interface currentStateType {
  pathname: string;
  current: number;
  pageSize: number;
  queryParams: any;
}

/**
 * 保存表格状态
 * @param current
 * @param pageSize
 */
export const saveCurrentState = (
  current: number,
  pageSize: number,
  queryParams?: any,
) => {
  let currentPage = get(STATE_KEY);
  set(
    STATE_KEY,
    Object.assign(currentPage ? currentPage : {}, {
      pathname: window.location.pathname,
      current,
      pageSize,
      queryParams,
    }),
  );
};

/**
 * 获取表格状态数据
 */
export const getCurrentState = () => {
  return get(STATE_KEY);
};

/**
 * 清除表格状态数据
 */
export const clearCurrentState = () => {
  return remove(STATE_KEY);
};
