import React, { useState, useEffect, useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { Button, Form, Space, Card, Modal, Result, Progress, Select, Dropdown, Menu, Popconfirm, message } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import { EyeAuthButton } from '@apps/components'
import {
  PlusOutlined,
  FileExcelOutlined,
  EyeOutlined,
  DownOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table/interface'
import styles from './index.less'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import NiceForm from '@/components/NiceForm'
import { createFormActions, FormEffectHooks } from '@apps/formily'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
// import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
// import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { goodsSchema } from './schema'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import {
  searchBrandOptionEffect,
  searchCustomerCategoryOptionEffect,
  searchCustomerMeterialOptionEffect,
} from './effect'
import { getProductMaterielGetMaterielList, postProductMaterielDeleteBatchMateriel } from '@apps/apis'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton } from '@apps/components'

const { Option } = Select
const { confirm } = Modal

let timeChange: any

const formActions = createFormActions()

const Goods: React.FC<{}> = () => {
  const intl = useIntl()
  const ref = useRef<any>({})
  const { pathname } = useLocation()
  const currentRefRow = useRef<any>([])
  const [importModal, setImportModal] = useState(false)
  const [deleteBatchModal, setDeleteBatchModal] = useState(false)
  const [modalTitle, setModalTitle] = useState(intl.formatMessage({ id: 'commodity.goods.modalTitle.1' }))
  const [modalStep, setModalStep] = useState(0)
  const [goodsRowSelection, goodsRowCtl] = useRowSelectionTable()

  useEffect(() => {
    currentRefRow.current = goodsRowCtl.selectRow
  }, [goodsRowCtl])

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'commodity.goods.columns.materialCode' }),
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: intl.formatMessage({ id: 'commodity.goods.columns.materialName' }),
      dataIndex: 'name',
      key: 'name',
      className: 'commonPickColor',
      render: (text: any, record: any) => (
        <EyeAuthButton
          type={authUrl(pathname, 'detail') ? 'link' : 'button'}
          url={`/commodityAbility/commodity/goods/detail?id=${record.id}&isSee=true`}
        >
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'commodity.goods.columns.goodsGroup' }),
      dataIndex: ['materialGroup', 'name'],
      key: 'materialGroup',
    },
    {
      title: intl.formatMessage({ id: 'commodity.goods.columns.type' }),
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: intl.formatMessage({ id: 'commodity.goods.columns.customerCategory' }),
      dataIndex: ['customerCategory', 'name'],
      key: 'customerCategory',
    },
    {
      title: intl.formatMessage({ id: 'commodity.goods.columns.brand' }),
      dataIndex: ['brand', 'name'],
      key: 'brand',
    },
    {
      title: intl.formatMessage({ id: 'commodity.goods.columns.unit' }),
      dataIndex: 'unitName',
      key: 'unit',
    },
    {
      title: (
        <>
          {intl.formatMessage({ id: 'commodity.goods.columns.muluPrice' })}&nbsp;
          {/* <Tooltip title={intl.formatMessage({ id: 'commodity.goods.columns.costPrice.tip' })}>
          <QuestionCircleOutlined />
        </Tooltip> */}
        </>
      ),
      dataIndex: 'costPrice',
      key: 'costPrice',
      render: (text) => `${intl.formatMessage({ id: 'commodity.goods.columns.currency' })}${text}`,
    },
    {
      title: intl.formatMessage({ id: 'commodity.goods.columns.batch' }),
      dataIndex: 'batch',
      key: 'batch',
    },
    {
      title: intl.formatMessage({ id: 'commodity.goods.columns.option' }),
      dataIndex: 'option',
      render: (text: any, record: any) => {
        return (
          <>
            <EditAuthButton>
              <Button
                type="link"
                onClick={() => history.push(`/commodityAbility/commodity/goods/edit?id=${record.id}`)}
              >
                {intl.formatMessage({ id: 'commodity.goods.columns.option.button.1' })}
              </Button>
            </EditAuthButton>
            <AuthButton type="custom" code="delete">
              <Popconfirm
                title={intl.formatMessage({ id: 'commodity.goods.columns.option.button.2.popconfirm.title' })}
                onConfirm={() => handleSingleDelete(record)}
                onCancel={() => console.log('取消')}
                okText={intl.formatMessage({ id: 'commodity.goods.columns.option.button.2.popconfirm.okText' })}
                cancelText={intl.formatMessage({ id: 'commodity.goods.columns.option.button.2.popconfirm.cancelText' })}
              >
                <Button type="link">{intl.formatMessage({ id: 'commodity.goods.columns.option.button.2' })}</Button>
              </Popconfirm>
            </AuthButton>
          </>
        )
      },
    },
  ]

  const fetchData = (params: any) => {
    console.log(params)
    return new Promise((resolve, reject) => {
      let obj = { ...params }
      getProductMaterielGetMaterielList(obj).then((res) => {
        resolve(res.data)
      })
    })
  }

  const handleSingleDelete = (record: any) => {
    if (record?.id)
      postProductMaterielDeleteBatchMateriel({ idList: [record.id] }).then((res) => {
        //@ts-ignore
        ref.current.reloadCurrent()
      })
  }

  const handleCancel = () => {
    console.log('cancel')
    setImportModal(false)
  }

  const modalLoadTemplate = () => {
    console.log('模板下载！')
  }

  const modalUpload = () => {
    console.log('上传')
    setModalStep(1)
    setModalTitle(intl.formatMessage({ id: 'commodity.goods.modalTitle.2' }))
  }

  const exportErrorLog = () => {
    console.log('导出错误')
  }

  const modalImportData = () => {
    setModalStep(2)
    setModalTitle(intl.formatMessage({ id: 'commodity.goods.modalTitle.2' }))
    console.log('下一步，导入数据')
  }

  const step0Description = (
    <>
      <ul className={styles.step0Description}>
        <li>
          {intl.formatMessage({ id: 'commodity.goods.step0Description.text.1' })}{' '}
          <a onClick={modalLoadTemplate}>{intl.formatMessage({ id: 'commodity.goods.step0Description.download' })}</a>
        </li>
        <li>{intl.formatMessage({ id: 'commodity.goods.step0Description.text.2' })}</li>
        <li>{intl.formatMessage({ id: 'commodity.goods.step0Description.text.3' })}</li>
      </ul>
    </>
  )

  const step1Description = (
    <div className={styles.step1Description}>
      <h4>{intl.formatMessage({ id: 'commodity.goods.step1Description.text.1' })}</h4>
      <p>{intl.formatMessage({ id: 'commodity.goods.step1Description.text.2' })}</p>
    </div>
  )

  const step1DescripSuccess = (
    <div className={styles.step1Description}>
      <h4>{intl.formatMessage({ id: 'commodity.goods.step1DescripSuccess.text.1' })}</h4>
      <p>{intl.formatMessage({ id: 'commodity.goods.step1DescripSuccess.text.2' })}</p>
      <Button type="primary" onClick={modalImportData}>
        {intl.formatMessage({ id: 'commodity.goods.step1DescripSuccess.button' })}
      </Button>
    </div>
  )

  const step1Exception = (
    <div className={styles.step1Description}>
      <h4>{intl.formatMessage({ id: 'commodity.goods.step1Exception.text.1' })}</h4>
      <p>{intl.formatMessage({ id: 'commodity.goods.step1Exception.text.2' })}</p>
    </div>
  )

  const step2Description = (
    <div className={styles.step1Description}>
      <h4>{intl.formatMessage({ id: 'commodity.goods.step2Description.text.1' })}</h4>
      <p>{intl.formatMessage({ id: 'commodity.goods.step2Description.text.2' })}</p>
    </div>
  )

  const step2DescripSuccess = (
    <div className={styles.step1Description}>
      <h4>{intl.formatMessage({ id: 'commodity.goods.step2DescripSuccess.text.1' })}</h4>
      <p>{intl.formatMessage({ id: 'commodity.goods.step2DescripSuccess.text.2' })}</p>
      <Button type="primary">{intl.formatMessage({ id: 'commodity.goods.step2DescripSuccess.button.1' })}</Button>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <Button>{intl.formatMessage({ id: 'commodity.goods.step2DescripSuccess.button.2' })}</Button>
    </div>
  )

  const step2Exception = (
    <div className={styles.step1Description}>
      <h4>{intl.formatMessage({ id: 'commodity.goods.step2Exception.text.1' })}</h4>
      <p>{intl.formatMessage({ id: 'commodity.goods.step2Exception.text.2' })}</p>
    </div>
  )

  // 导入的时候的描述文字
  const [step1DescriptState, setStep1DescriptState] = useState(step1Description)
  const [step2DescriptState, setStep2DescriptState] = useState(step2Description)

  // timer  计时器模拟导入过程
  const [exceptionCheck, setExceptionCheck] = useState(false) // 默认无异常
  const [exceptionData, setExceptionData] = useState(false) // 默认无异常
  const [time, setTime] = useState(0) // timer
  useEffect(() => {
    clearInterval(timeChange)
  }, [])
  useEffect(() => {
    console.log(modalStep)
    if (modalStep === 1) runTimer()
    if (modalStep === 2) runTimer()
  }, [modalStep])
  useEffect(() => {
    if (time >= 100) {
      clearInterval(timeChange)
      setTime(100)
      if (modalStep === 1) setStep1DescriptState(step1DescripSuccess)
      if (modalStep === 2) setStep2DescriptState(step2DescripSuccess)
      console.log('倒计时完毕！', modalStep)
    }
  }, [time])
  const runTimer = () => {
    setTime(0)
    timeChange = setInterval(() => setTime((t) => t + Math.floor(Math.random() * 10)), 200)
  }
  //timer end

  // 导入的时候 进度条的颜色配置
  const step1Icon = (
    <Progress
      type="circle"
      strokeColor={{
        '0%': '#669EDE',
        '100%': '#41CC9E',
      }}
      percent={time}
    />
  )

  const step2Icon = (
    <Progress
      type="circle"
      strokeColor={{
        '0%': '#669EDE',
        '100%': '#41CC9E',
      }}
      percent={time}
    />
  )

  const menuMore = (
    <Menu onClick={(e) => handleMenuClick(e)}>
      <Menu.Item key="1" icon={<DeleteOutlined />}>
        {intl.formatMessage({ id: 'commodity.goods.menuMore.item.1' })}
      </Menu.Item>
      <Menu.Item key="2" icon={<DeleteOutlined />}>
        {intl.formatMessage({ id: 'commodity.goods.menuMore.item.2' })}
      </Menu.Item>
    </Menu>
  )

  const handleMenuClick = (e: any) => {
    // 1 批量删除；2 删除导入批次
    if (e.key === '1') {
      confirm({
        title: intl.formatMessage({ id: 'commodity.goods.handleMenuClick.title' }),
        icon: <ExclamationCircleOutlined />,
        onOk() {
          if (!currentRefRow.current.length) {
            return message.error(intl.formatMessage({ id: 'commodity.goods.handleMenuClick.error' }))
          }
          postProductMaterielDeleteBatchMateriel({ idList: currentRefRow.current.map((item) => item.id) }).then(
            (res) => {
              ref.current.reloadCurrent()
            },
          )
        },
        okType: 'danger',
        onCancel() {
          console.log('Cancel')
        },
        okText: intl.formatMessage({ id: 'commodity.goods.handleMenuClick.okText' }),
        cancelText: intl.formatMessage({ id: 'commodity.goods.handleMenuClick.cancelText' }),
      })
    } else if (e.key === '2') {
      console.log('删除导入批次')
      setDeleteBatchModal(true)
    }
  }

  const handleOkDeleteBatch = () => {
    setDeleteBatchModal(false)
    console.log('删除批次')
  }

  const handleCancelDelete = () => {
    setDeleteBatchModal(false)
    console.log('取消删除')
  }

  const controllerBtns = (
    <Space>
      <AddAuthButton>
        <Button type="primary" onClick={() => history.push('/commodityAbility/commodity/goods/add')}>
          <PlusOutlined />
          {intl.formatMessage({ id: 'commodity.goods.controllerBtns.button.1' })}
        </Button>
      </AddAuthButton>

      {/* <Button style={{ margin: '0 16px' }} onClick={() => setImportModal(true)}>导入数据</Button> */}
      <AuthButton type="custom" code="batch">
        <Dropdown overlay={menuMore} trigger={['click']}>
          <Button>
            {intl.formatMessage({ id: 'commodity.goods.controllerBtns.button.2' })} <DownOutlined />
          </Button>
        </Dropdown>
      </AuthButton>
    </Space>
  )

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          columns={columns}
          currentRef={ref}
          rowSelection={goodsRowSelection}
          tableProps={{ rowKey: 'id' }}
          fetchTableData={(params: any) => fetchData(params)}
          controlRender={
            <NiceForm
              actions={formActions}
              onSubmit={(values) => ref.current.reload(values)}
              expressionScope={{
                controllerBtns,
              }}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)

                FormEffectHooks.onFieldChange$('brandId').subscribe((state) => {
                  searchBrandOptionEffect(actions, 'brandId')
                })
                FormEffectHooks.onFieldChange$('customerCategoryId').subscribe((state) => {
                  searchCustomerCategoryOptionEffect(actions, 'customerCategoryId')
                })
                FormEffectHooks.onFieldChange$('materialGroupId').subscribe((state) => {
                  searchCustomerMeterialOptionEffect(actions, 'materialGroupId')
                })
              }}
              schema={goodsSchema}
            />
          }
        />
      </Card>
      <Modal title={modalTitle} visible={importModal} onCancel={handleCancel} maskClosable={false} footer={null}>
        {modalStep === 0 && (
          <>
            <Result
              icon={<FileExcelOutlined />}
              title={step0Description}
              extra={
                <Button style={{ width: '100%' }} type="primary" onClick={modalUpload}>
                  {intl.formatMessage({ id: 'commodity.goods.modal.button.1' })}
                </Button>
              }
            />
          </>
        )}
        {modalStep === 1 && !exceptionCheck && (
          <>
            <Result icon={step1Icon} title={step1DescriptState} />
          </>
        )}
        {modalStep === 1 && exceptionCheck && (
          <>
            <Result
              icon={<Progress type="circle" percent={100} status="exception" />}
              title={step1Exception}
              extra={
                <Button onClick={exportErrorLog}>{intl.formatMessage({ id: 'commodity.goods.modal.button.2' })}</Button>
              }
            />
          </>
        )}
        {modalStep === 2 && !exceptionData && (
          <>
            <Result icon={step2Icon} title={step2DescriptState} />
          </>
        )}
        {modalStep === 2 && exceptionData && (
          <>
            <Result
              icon={<Progress type="circle" percent={100} status="exception" />}
              title={step2Exception}
              extra={
                <Button onClick={exportErrorLog}>{intl.formatMessage({ id: 'commodity.goods.modal.button.2' })}</Button>
              }
            />
          </>
        )}
      </Modal>
      <Modal
        title={intl.formatMessage({ id: 'commodity.goods.modal.title' })}
        open={deleteBatchModal}
        onOk={handleOkDeleteBatch}
        onCancel={handleCancelDelete}
        okButtonProps={{ danger: true }}
      >
        <Form layout="vertical">
          <Form.Item label={intl.formatMessage({ id: 'commodity.goods.modal.form.label' })}>
            <Select placeholder={intl.formatMessage({ id: 'commodity.goods.modal.form.placeholder' })} options={[]} />
          </Form.Item>
        </Form>
      </Modal>
    </PageHeaderWrapper>
  )
}

export default Goods
