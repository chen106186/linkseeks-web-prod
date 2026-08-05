type RecentVisitType = { [key: string]: string }

const recentVisitKey = 'recentVisit';

/**
 * 设置最近访问本地存储数据
 * @param data
 */
export const setRecentVisit = (data: RecentVisitType) => {
  localStorage.setItem(recentVisitKey, JSON.stringify(data));
};

/**
 * 获取最近访问本地存储数据
 * @param data
 */
export const getRecentVisit = (): RecentVisitType => {
  const stora = localStorage.getItem(recentVisitKey);
  const recentVisit: RecentVisitType = stora ? JSON.parse(stora) : {};
  return recentVisit;
};

/**
 * 清除最近访问本地存储数据
 * @param data
 */
export const clearRecentVisit = () => {
  localStorage.removeItem(recentVisitKey);
};
