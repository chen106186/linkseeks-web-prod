import React, { useState, useEffect } from 'react'
import { Tabs, Empty } from 'antd'
import { getProductPlatformGetCategoryTree } from '@apps/apis'
import styles from './index.module.less'

interface Props {
  selectList?: any
  addressSelect?: any
  fnCallBlack: Function
  fnCallBlackText: string
}

const Category: React.FC<Props> = (props) => {
  /**
   * 返回整合对象
   * @param item 选中的对象
   */
  const fnGetSeltctObj = (key = 'firstSelect', item?: { id: 0; title: 0 }) => {
    const callblackObj = { ...addressSelect }

    callblackObj[key] = {
      id: item?.id,
      name: item?.title,
    }
    if (key == 'firstSelect') {
      callblackObj['thirdSelect'].id = ''
      callblackObj['thirdSelect'].name = ''
    }
    return callblackObj
  }

  const {
    addressSelect = {
      firstSelect: {
        id: 0,
        name: '',
      },
      secondSelect: {
        id: 0,
        name: '',
      },
      thirdSelect: {
        id: 0,
        name: '',
      },
    },
    fnCallBlack,
    fnCallBlackText,
  } = props
  const { TabPane } = Tabs
  const tabTitles = ['一级品类', '二级品类', '三级品类']
  const [secondList, setSecondList] = useState<any>([])
  const [thirdList, setThirdList] = useState<any>([])
  const [newActiveKey, setNewActiveKey] = useState('1')
  const [categoryList, setCategoryList] = useState<any>([])
  /**
   * 修改二级
   * @param item 选中的一级
   */
  const fnSetSecondList = (item: any) => {
    if (!item.children) {
      return
    }
    const selectItem = fnGetSeltctObj('firstSelect', item)
    let bo = item.children.length == 0
    fnCallBlack(selectItem, fnCallBlackText, bo)
    setThirdList([])
    if (!bo) {
      setNewActiveKey('2')
    }
    setSecondList(item.children)
  }
  /**
   * 修改三级
   * @param item 选中的二级
   */
  const fnSetThirdList = (item: any) => {
    if (!item.children) {
      return
    }
    let bo = item.children.length == 0
    const selectItem = fnGetSeltctObj('secondSelect', item)
    fnCallBlack(selectItem, fnCallBlackText, bo)
    if (!bo) {
      setNewActiveKey('3')
    }
    setThirdList(item.children)
  }
  /**
   * 设置三级
   * @param item 选中的三级
   */
  const fnSelectThird = (item: any) => {
    const selectItem = fnGetSeltctObj('thirdSelect', item)
    fnCallBlack(selectItem, fnCallBlackText, item.children.length == 0)
  }
  /**
   * tab切换
   */
  const fnCallback = (step: string) => {
    if (step == '2') {
      if (!secondList || secondList.length == 0) {
        return
      }
    } else if (step == '3') {
      if (!thirdList || thirdList.length == 0) {
        return
      }
    }
    setNewActiveKey(step)
  }

  const fnGetCategoryTree = () => {
    getProductPlatformGetCategoryTree().then((res: any) => {
      console.log(res.data)
      setCategoryList(res.data)
    })
  }
  useEffect(() => {
    fnGetCategoryTree()
  }, [])
  return (
    <div className={`${styles['tabs-main']} tabs-main`}>
      <Tabs activeKey={newActiveKey} onChange={fnCallback} className="ddddddddddddddddddddddddddddddddddd">
        <TabPane tab={tabTitles[0]} key="1">
          <ul className={`${styles['tabs-warp']}`}>
            {categoryList.map((item: any) => {
              return (
                <li
                  key={item.id}
                  className={`${styles['tabs-item']} ${
                    addressSelect.firstSelect.id == item.id ? styles['tabs-item-select'] : ''
                  }`}
                  onClick={() => {
                    fnSetSecondList(item)
                  }}
                >
                  {item.title}
                </li>
              )
            })}
            {categoryList.length == 0 && (
              <li style={{ margin: '0 auto' }}>
                <Empty description={<div>暂无数据</div>} />
              </li>
            )}
          </ul>
        </TabPane>
        <TabPane tab={tabTitles[1]} key="2">
          <ul className={`${styles['tabs-warp']}`}>
            {secondList &&
              secondList.map((item: any) => {
                return (
                  <li
                    onClick={() => {
                      fnSetThirdList(item)
                    }}
                    className={`${styles['tabs-item']} ${
                      addressSelect.secondSelect.id == item.id ? styles['tabs-item-select'] : ''
                    }`}
                    key={item.id + 'second'}
                  >
                    {item.title}
                  </li>
                )
              })}
            {secondList.length == 0 && (
              <li style={{ margin: '0 auto' }}>
                <Empty description={<div>暂无数据</div>} />
              </li>
            )}
          </ul>
        </TabPane>
        {tabTitles[2] && (
          <TabPane tab={tabTitles[2]} key="3">
            <ul className={`${styles['tabs-warp']}`}>
              {thirdList.map((item: any) => {
                return (
                  <li
                    onClick={() => {
                      fnSelectThird(item)
                    }}
                    className={`${styles['tabs-item']} ${
                      addressSelect.thirdSelect.id == item.id ? styles['tabs-item-select'] : ''
                    }`}
                    key={item.id + 'second'}
                  >
                    {item.title}
                  </li>
                )
              })}
              {thirdList.length == 0 && (
                <li style={{ margin: '0 auto' }}>
                  <Empty description={<div>暂无数据</div>} />
                </li>
              )}
            </ul>
          </TabPane>
        )}
      </Tabs>
    </div>
  )
}

export default Category
