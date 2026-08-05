import React, { useState, useRef, ReactNode, createRef } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Card, Row, Col, Input, Button } from 'antd'
import statuStyle from '../../common/colorTag'
import { ColumnType } from 'antd/lib/table/interface'
import StandardTable from '@/components/StandardTable'
import { getContractContractParamPage } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

const ClassSearch = () => {
  const filterParamsRef = useRef<any>()
  const ref = useRef<any>({})
  const [filterParams, setFilterParams] = useState<any>({})
  const [falgReset, setFalgReset] = useState<boolean>(false)
  //表头
  const columns: ColumnType<any>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: '128px',
    },
    {
      title: intl.formatMessage({ id: 'contract.canshumingcheng' }),
      dataIndex: 'name',
    },
    {
      title: intl.formatMessage({ id: 'contract.canshumiaoshu' }),
      dataIndex: 'description',
    },
    {
      title: intl.formatMessage({ id: 'contract.zhuangtai' }),
      dataIndex: 'state',
      render: (text: any, reconds: any) => {
        let component: ReactNode = null
        if (text === 1) {
          component = (
            <>
              <span style={statuStyle.success}>{intl.formatMessage({ id: 'contract.youxiao' })}</span>
            </>
          )
        }
        return component
      },
    },
  ]

  // 列表数据
  const fetchData = (params?: any) => {
    console.log(params, filterParams) //可以直接打印参数
    return new Promise((resolve, reject) => {
      getContractContractParamPage({ ...params, ...filterParams })
        .then((res) => {
          resolve(res.data)
        })
        .catch(() => {
          reject()
        })
    })
  }
  // 搜索
  const handleSearch = () => {
    let obj = { ...filterParams, name: filterParamsRef.current.input.value }
    setFilterParams(obj)
    ref.current.reload(obj)
  }
  // 重置
  const handleReset = () => {
    setFilterParams({})
    setTimeout(() => {
      ref.current.reloadCurrent()
    }, 500)
  }
  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          tableProps={{
            rowKey: 'id',
          }}
          columns={columns}
          currentRef={ref}
          fetchTableData={(params: any) => fetchData({ ...params, name: filterParamsRef.current.input.value })}
          controlRender={
            <Row>
              <Col span={12}>
                <Input.Search
                  ref={filterParamsRef}
                  style={{ width: '256px', marginRight: '24px', marginBottom: '24px' }}
                  placeholder={intl.formatMessage({ id: 'contract.sousuo' })}
                  value={filterParams.name}
                  onChange={(e) => setFilterParams({ ...filterParams, name: e.target.value })}
                  onSearch={(val) => handleSearch()}
                />
                <Button onClick={handleReset}>{intl.formatMessage({ id: 'contract.zhongzhi' })}</Button>
              </Col>
            </Row>
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default ClassSearch
