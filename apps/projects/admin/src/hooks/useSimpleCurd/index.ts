export interface simpleCurdOptions {
  add(params)
  delete(params)
  find(params)
  update(params)
  changeStatus(params)
}

/**
 * @todo 简单的增删改查hooks， 可以配合table进行某些重复的操作
 */
export const useSimpleCurd = (options) => {}
