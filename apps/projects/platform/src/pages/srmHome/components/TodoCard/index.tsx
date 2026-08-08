/**
 * @Description 欢迎卡片
 */
import React, { useState, useEffect } from 'react'
import { message, Spin, Empty } from 'antd'
import classNames from 'classnames'
import { history } from '@linkseeks/router-manager'
import { SRM_HOME_TODO } from '@/constants/home'
import { IRequestSuccess } from '@/index'
import { authService } from '@apps/services'
import {
  getAftersalesReportGetAfterSales,
  getContractReportGetContract,
  getLogisticsReportGetLogistics,
  getMemberReportGetMember,
  getOrderReportGetOrder,
  getPurchaseReportGetPurchase,
  getSettlementReportGetSettlement,
  // getReportMemberHomeGetQualityReport,
  getPayReportGetPay,
  getProductReportGetCommodity,
} from '@apps/apis'
import MellowCard from '@/components/MellowCard'
import NODATA_IMG from '@/assets/imgs/im_noData.png'
import styles from './index.less'
import { useWebIntl } from '@apps/locales'
// TODO
type Apikeys = keyof typeof SRM_HOME_TODO

type TallyType = {
  /**
   * 计数名称
   */
  name: string
  /**
   * 链接
   */
  link: string
  /**
   * 数量
   */
  count: number
}

type TallyReseponseType = { [key: string]: TallyType[] } | TallyType[]

type ApiFnType = () => Promise<IRequestSuccess<TallyReseponseType>>

const API_MAP: { [key in Apikeys]: ApiFnType } = {
  '/supplierAbility': getMemberReportGetMember as unknown as ApiFnType,
  '/orderAbility': getOrderReportGetOrder as unknown as ApiFnType,
  '/procurementAbility': getPurchaseReportGetPurchase as unknown as ApiFnType,
  '/contract': getContractReportGetContract as unknown as ApiFnType,
  '/commodityAbility': getProductReportGetCommodity as unknown as ApiFnType,
  '/balance': getSettlementReportGetSettlement as unknown as ApiFnType,
  '/afterAbility': getAftersalesReportGetAfterSales as unknown as ApiFnType,
  '/logisticsAbility': getLogisticsReportGetLogistics as unknown as ApiFnType,
  // '/qualityAbility': getReportMemberHomeGetQualityReport as unknown as ApiFnType,
  '/payandSettle': getPayReportGetPay as unknown as ApiFnType,
}

type TodoTagType = {
  /**
   * 地址
   */
  url: Apikeys
  /**
   * 名称
   */
  name: string
}

type TodoType = {
  /**
   * 名称
   */
  name: string
  /**
   * 待办总计
   */
  total: number
  /**
   * 地址
   */
  url: string
}

// 一组最多三个
const GROUP_MAX_LEN = 3

const normalizeTodoList = (dataSource: TallyReseponseType): TodoType[][] => {
  const ret = []
  let group: TodoType[] = []

  const keys = Object.keys(dataSource)

  keys.forEach((item, keyIndex) => {
    const todos: TallyType[] = dataSource[item]
    if (todos) {
      todos.forEach((todo, todoIndex) => {
        // 待办数大于 0 才展示
        if (todo.count > 0 && item !== 'platformList') {
          group.push({
            name: todo.name,
            url: todo.link,
            total: todo.count,
          })
        }
        if (group.length === GROUP_MAX_LEN) {
          ret.push(group)
          group = []
        }
      })
    }
    if (keyIndex === keys.length - 1 && group.length < GROUP_MAX_LEN) {
      ret.push(group)
      group = []
    }
  })

  return ret
}

const TodoCard: React.FC = () => {
  const [currentTag, setCurrentTag] = useState<Apikeys | ''>('')
  const [todoTags, setTodoTags] = useState<TodoTagType[]>([])
  const [todoList, setTodoList] = useState<TodoType[][]>([])
  const [listLoading, setListLoading] = useState(false)

  const translate = useWebIntl()
  const handleTagChange = (url: Apikeys) => {
    setCurrentTag(url)

    if (!API_MAP[url]) {
      message.warning('出错了，请检查菜单配置与项目菜单是否一致')
      return
    }

    setListLoading(true)
    API_MAP[url]()
      .then((res) => {
        if (res.code === 1000) {
          setTodoList(normalizeTodoList(res.data))
        }
      })
      .finally(() => {
        setListLoading(false)
      })
  }

  const initTags = () => {
    const userAuth = authService.getAuth()
    const urls = authService.getAuthUrlList(authService.getAuthList())
    const routes = Object.keys(SRM_HOME_TODO)
      .map((item) => ({
        url: item as Apikeys,
        name: SRM_HOME_TODO[item],
      }))
      .filter((item) => urls?.includes(item.url))
    setTodoTags(routes)
    if (routes.length) {
      handleTagChange(routes[0].url)
    }
  }

  useEffect(() => {
    initTags()
  }, [])

  const handleJump = (url: string) => {
    history.push(url)
  }

  console.log('todoList', todoList)

  const noTodoItem = todoList.every((item) => !item.length)
  console.log('noTodoItem', noTodoItem)

  return (
    <MellowCard title={<div className={styles['todo-title']}>{translate('web.resource.srmHome.jinridaiban')}</div>}>
      <ul className={styles['todo-tag-list']}>
        {todoTags.map((item) => (
          <li
            key={item.url}
            className={classNames(styles['todo-tag-item'], {
              [styles['todo-tag-item-active']]: item.url === currentTag,
            })}
            onClick={() => handleTagChange(item.url)}
          >
            {item.name}
          </li>
        ))}
      </ul>
      <Spin spinning={listLoading}>
        <div className={styles['todo-list']}>
          <div className={styles['todo-list-content']}>
            {todoList.map((group, index) =>
              group.length ? (
                <div key={index} className={styles['todo-list-group']}>
                  {group.map((item, groupItemIndex) => (
                    <div
                      key={`${item.url + groupItemIndex}`}
                      className={styles['todo-list-item']}
                      onClick={() => handleJump(item.url)}
                    >
                      <div className={styles['todo-list-item-name']}>{item.name}</div>
                      <div className={styles['todo-list-item-total']}>{item.total}</div>
                    </div>
                  ))}
                </div>
              ) : null,
            )}
            {noTodoItem ? (
              <Empty
                image={NODATA_IMG}
                description={
                  <div className={styles['todo-list-noData']}>{translate('web.resource.srmHome.zanwudaiban')}</div>
                }
              />
            ) : null}
          </div>
        </div>
      </Spin>
    </MellowCard>
  )
}

export default TodoCard
