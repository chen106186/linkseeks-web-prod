/**
 * 最近未使用算法 
 * 设置最长的长度为6，好像只能用map，后面再改进吧，应为map的话不能放到localstorage，需要遍历一次，
 * 双向链表 用JSON.stringify 会报错，应该是因为有一个环
 */

import { setRecentVisit, getRecentVisit } from './recentVisit';


const LRUCache = function (capacity: number) {
  this.cache = new Map();
  this.capacity = capacity;
  this.instance = null
};

LRUCache.prototype.init = function() {
  const recentVisit = getRecentVisit();
  Object.keys(recentVisit).map((item) => {
    this.cache.set(item, recentVisit[item]);
  })
  // return recentVisit;
}

LRUCache.prototype.put = function (key: string, value: string) {
  if (this.cache.has(key)) {
    // 存在即更新（删除后加入）
    this.cache.delete(key);
  } else if (this.cache.size >= this.capacity) {
    // 不存在即加入
    // 缓存超过最大值，则移除最近没有使用的
    this.cache.delete(this.cache.keys().next().value);
  }
  this.cache.set(key, value);
  let data = {};
  for(var [k, v] of this.cache) {
    data[k] = v
  }
  setRecentVisit(data);
};


export default LRUCache;