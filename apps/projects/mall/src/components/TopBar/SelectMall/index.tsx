import React, { Fragment } from 'react'
import { Dropdown, Space } from 'antd'
import { CaretDownOutlined, CheckOutlined } from '@ant-design/icons'
import { LAYOUT_TYPE, MallInfoType } from '@/types/global'
import { REQUEST_HEADER, TOP_DOMAIN } from '@apps/constants'
import useLink from '@/hooks/useLink'
import styles from './index.module.less'

interface SelectMallProps {
  mallInfo: MallInfoType | undefined
  mallList: MallInfoType[]
  layoutType: LAYOUT_TYPE
}

const SelectMall: React.FC<SelectMallProps> = (props) => {
  const { mallInfo, mallList, layoutType } = props
  const { linkPrefix } = useLink()

  const handleSelectMall = (item: MallInfoType) => {
    window.location.href = `${REQUEST_HEADER}${item.url}.${TOP_DOMAIN}${linkPrefix()}`
  }

  const getItems = () => {
    return mallList.map((item) => {
      return {
        label: (
          <Space onClick={() => handleSelectMall(item)}>
            {mallInfo?.id === item.id ? (
              <CheckOutlined className={styles.selected} />
            ) : (
              <div style={{ width: 20, height: 20 }}></div>
            )}
            <span>{item.name}</span>
          </Space>
        ),
        key: item.id,
      }
    })
  }

  return (
    <Fragment>
      {mallList && mallList.length > 0 ? (
        <Dropdown menu={{ items: getItems() }} placement="bottomRight" className={styles.selectLangBox}>
          <Space style={{ cursor: 'pointer' }} size={5}>
            <a href={linkPrefix()}>{mallInfo?.name}</a>
            <CaretDownOutlined translate={undefined} />
          </Space>
        </Dropdown>
      ) : (
        <Space style={{ cursor: 'pointer' }} size={5}>
          <a href={linkPrefix()}>{mallInfo?.name}</a>
        </Space>
      )}
    </Fragment>
  )
}

export default SelectMall
