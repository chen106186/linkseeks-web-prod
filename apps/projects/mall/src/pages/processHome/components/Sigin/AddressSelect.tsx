import React, { useState, useEffect } from 'react'
import { Tabs } from 'antd'
import styles from './index.module.less'

interface Props {
  selectList?: any
  addressSelect?: any
  fnCallBlack: Function
  fnCallBlackText: string
}

const AddressSelect: React.FC<Props> = (props) => {
  /**
   * 返回整合对象
   * @param item 选中的对象
   */
  const fnGetSeltctObj = (key = 'firstSelect', item?: any) => {
    const callblackObj = { ...addressSelect }

    callblackObj[key] = {
      id: item?.id,
      pcode: item?.pcode,
      code: item?.code,
      name: item?.name,
    }
    if (key == 'firstSelect') {
      callblackObj['thirdSelect'].id = ''
      callblackObj['thirdSelect'].name = ''
      callblackObj['thirdSelect'].code = ''
      callblackObj['thirdSelect'].pcode = ''
    }
    return callblackObj
  }

  const {
    selectList = [
      { id: 1, name: '广州市' },
      { id: 2, name: '佛山市' },
    ],
    addressSelect = {
      firstSelect: {
        id: 0,
        name: '',
        code: '',
        pcode: '',
      },
      secondSelect: {
        id: 0,
        name: '',
        code: '',
        pcode: '',
      },
      thirdSelect: {
        id: 0,
        name: '',
        code: '',
        pcode: '',
      },
    },
    fnCallBlack,
    fnCallBlackText,
  } = props
  const { TabPane } = Tabs
  const tabTitles = ['省份', '城市', '区']
  const [secondList, setSecondList] = useState<any>([])
  const [thirdList, setThirdList] = useState<any>([])
  const [newActiveKey, setNewActiveKey] = useState('1')

  /**
   * 修改二级
   * @param item 选中的一级
   */
  const fnSetSecondList = (item: any) => {
    if (!item.areaResponses) {
      return
    }
    let bo = item.areaResponses.length == 0
    const selectItem = fnGetSeltctObj('firstSelect', item)
    fnCallBlack(selectItem, fnCallBlackText, bo)
    setThirdList([])
    if (!bo) {
      setNewActiveKey('2')
    }
    setSecondList(item.areaResponses)
  }
  /**
   * 修改三级
   * @param item 选中的二级
   */
  const fnSetThirdList = (item: any) => {
    if (!item.areaResponses) {
      return
    }
    let bo = item.areaResponses.length == 0
    if (!bo) {
      setNewActiveKey('3')
    }
    const selectItem = fnGetSeltctObj('secondSelect', item)
    fnCallBlack(selectItem, fnCallBlackText, bo)
    setThirdList(item.areaResponses)
  }
  /**
   * 设置三级
   * @param item 选中的三级
   */
  const fnSelectThird = (item: any) => {
    const selectItem = fnGetSeltctObj('thirdSelect', item)
    fnCallBlack(selectItem, fnCallBlackText)
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
  useEffect(() => {}, [])
  return (
    <div className={`${styles['tabs-main']} tabs-main`}>
      <Tabs activeKey={newActiveKey} onChange={fnCallback} className="ddddddddddddddddddddddddddddddddddd">
        <TabPane tab={tabTitles[0]} key="1">
          <ul className={`${styles['tabs-warp']}`}>
            {selectList.map((item: any) => {
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
                  {item.name}
                </li>
              )
            })}
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
                    {item.name}
                  </li>
                )
              })}
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
                    {item.name}
                  </li>
                )
              })}
            </ul>
          </TabPane>
        )}
      </Tabs>
    </div>
  )
}

export default AddressSelect
