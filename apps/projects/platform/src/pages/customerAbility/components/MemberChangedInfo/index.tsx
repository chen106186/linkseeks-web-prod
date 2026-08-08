/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-21 18:14:10
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-04 14:19:20
 * @Description: 会员变更信息
 */
import React, { useState, useEffect } from 'react'
import { useIntl } from '@linkseeks/i18n'
import MellowCard from '@/components/MellowCard'
import PolymericTable from '@/components/PolymericTable'
import type { EditableColumns } from '@/components/PolymericTable/interface'
import { Button } from 'antd'
import QualificationChangeDrawer from '../QualificationChangeDrawer'
import ImgChangeDrawer from '../ImgChangeDrawer'
import DrawerListInfo from '../DrawerListInfo'

export type ChangeItemType = {
  /**
   * 数据id
   */
  id: number
  /**
   * 变更时间
   */
  createTime: string
  /**
   * 变更项目
   */
  fieldLocalName: string
  /**
   * 变更后的内容
   */
  fieldValue: string
  /**
   * 变更前的内容
   */
  lastValue: string
}

export type FetchParamsType = {
  pageSize: string
  current: string
}

export type ReponseType = {
  data: ChangeItemType[]
  totalCount: number
}

interface IProps {
  /**
   * 数据
   */
  fetchList: (params: FetchParamsType) => Promise<ReponseType>
}

const PAGE_SIZE = 10

const ChangeBtn = (props) => {
  const { ...rest } = props
  return (
    <Button type="link" {...rest}>
      查看变更
    </Button>
  )
}
const MemberChangedInfo: React.FC<IProps> = (props: IProps) => {
  const { fetchList, ...rest } = props
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(PAGE_SIZE)
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<ReponseType>({
    totalCount: 0,
    data: [],
  })
  const [drawerData, setDrawerState] = useState({
    state: false,
    rowData: [] as ChangeItemType[],
  })
  // eslint-disable-next-line prefer-const
  let [keys, setKeys] = useState(0)
  const [queChangeProps, setQueChangeProps] = useState({
    isShow: false,
    row: void 0,
    isShowAfter: true,
  })
  const [imgChangeProps, setImgChangeProps] = useState({
    isShow: false,
    row: void 0,
    isShowAfter: true,
  })

  const intl = useIntl()

  const getList = (params?: FetchParamsType) => {
    if (fetchList) {
      setLoading(true)
      const nextPage = params?.current || page
      const nextSize = params?.pageSize || size
      fetchList({
        current: `${nextPage}`,
        pageSize: `${nextSize}`,
      })
        .then((res) => {
          if (res.data) {
            setList(res)
          }
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  useEffect(() => {
    getList()
  }, [])

  useEffect(() => {
    setKeys(++keys)
  }, [drawerData.state])

  /** 查看资质变更抽屉 */
  const handleShowQuaChange = (isShow: boolean, row?: ChangeItemType, isShowAfter?: boolean) => {
    setQueChangeProps({ isShow, row, isShowAfter })
  }
  /** 查看图片变更抽屉 */
  const handleShowImgChange = (isShow: boolean, row?: ChangeItemType, isShowAfter?: boolean) => {
    setImgChangeProps({ isShow, row, isShowAfter })
  }
  // 查看变更列表
  const handleDrawer = (isState: boolean, data?: ChangeItemType[]) => {
    setDrawerState({ state: isState, rowData: data })
  }
  const columns: EditableColumns[] = [
    {
      title: intl.formatMessage({
        id: 'customerAbility.components.MemberChangedInfo.columns.id',
        defaultMessage: '序号',
      }),
      dataIndex: 'id',
    },
    {
      title: intl.formatMessage({
        id: 'customerAbility.components.MemberChangedInfo.columns.createTime',
        defaultMessage: '变更日期',
      }),
      dataIndex: 'createTime',
    },
    {
      title: intl.formatMessage({
        id: 'customerAbility.components.MemberChangedInfo.columns.fieldLocalName',
        defaultMessage: '变更项目',
      }),
      dataIndex: 'fieldLocalName',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({
        id: 'customerAbility.components.MemberChangedInfo.columns.lastValue',
        defaultMessage: '变更前内容',
      }),
      dataIndex: 'lastValue',
      ellipsis: true,
      render: (text, row) => {
        if (row.fieldLocalName === '资质证明照片') {
          return (
            <ChangeBtn
              onClick={() => {
                handleShowQuaChange(true, row, false)
              }}
            />
          )
        }
        if (row.fieldType === 'upload') {
          return (
            <ChangeBtn
              onClick={() => {
                handleShowImgChange(true, row, false)
              }}
            />
          )
        }
        return row.fieldType === 'list' ? (
          <Button type="link" onClick={() => handleDrawer(true, row)}>
            {intl.formatMessage({ id: 'supplier.list.chang.view.changes', defaultMessage: '查看变更' })}
          </Button>
        ) : (
          text
        )
      },
    },
    {
      title: intl.formatMessage({
        id: 'customerAbility.components.MemberChangedInfo.columns.fieldValue',
        defaultMessage: '变更后内容',
      }),
      dataIndex: 'fieldValue',
      ellipsis: true,
      render: (text, row) => {
        if (row.fieldLocalName === '资质证明照片') {
          return (
            <ChangeBtn
              onClick={() => {
                handleShowQuaChange(true, row, true)
              }}
            />
          )
        }
        if (row.fieldType === 'upload') {
          return (
            <ChangeBtn
              onClick={() => {
                handleShowImgChange(true, row, true)
              }}
            />
          )
        }
        return row.fieldType === 'list' ? (
          <Button type="link" onClick={() => handleDrawer(true, row)}>
            {intl.formatMessage({ id: 'supplier.list.chang.view.changes', defaultMessage: '查看变更' })}
          </Button>
        ) : (
          text
        )
      },
    },
  ]

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const handlePaginationChange = (page: number, size: number) => {
    setPage(page)
    setSize(size)
    getList({
      current: `${page}`,
      pageSize: `${size}`,
    })
  }

  return (
    <MellowCard
      title={intl.formatMessage({
        id: 'customerAbility.components.MemberChangedInfo.title',
        defaultMessage: '变更信息',
      })}
      {...rest}
    >
      <PolymericTable
        dataSource={list.data}
        columns={columns}
        loading={loading}
        pagination={{
          current: page,
          pageSize: size,
          total: list.totalCount,
        }}
        onPaginationChange={handlePaginationChange}
      />
      {/* 资质图片抽屉 */}
      <QualificationChangeDrawer
        visible={queChangeProps.isShow}
        setVisible={handleShowQuaChange}
        qualificationData={queChangeProps.row}
        isShowAfter={queChangeProps.isShowAfter}
      />

      {/** 普通图片抽屉 */}
      <ImgChangeDrawer
        visible={imgChangeProps.isShow}
        setVisible={handleShowImgChange}
        data={imgChangeProps.row}
        isShowAfter={imgChangeProps.isShowAfter}
      />

      {/* 查看变更列表弹窗 */}
      <DrawerListInfo
        title={intl.formatMessage({ id: 'supplier.list.chang.contact.list', defaultMessage: '联系人信息' })}
        visible={drawerData.state}
        onClose={handleDrawer}
        listData={drawerData.rowData}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={() => handleDrawer(false, null)} style={{ marginRight: 16 }}>
              {intl.formatMessage({ id: 'supplier.enterpriseBasicInfo.component.cancel', defaultMessage: '取消' })}
            </Button>
            <Button onClick={() => handleDrawer(false, null)} type="primary">
              {intl.formatMessage({ id: 'supplier.enterpriseBasicInfo.component.sure', defaultMessage: '确定' })}
            </Button>
          </div>
        }
        width="50%"
        key={keys}
      />
    </MellowCard>
  )
}

export default MemberChangedInfo
