import NiceForm from '@/components/NiceForm'
import StandardTable from '@/components/StandardTable'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
// import {
//   getProductCommodityGetSubCommodityListS2B,
//   getProductCommodityGetUpperCommodityListS2B,
//   GetProductCommodityGetUpperCommodityListS2BRequest,
//   postProductCommodityChoiceSubCommodity,
//   postProductCommodityChoiceUpperCommodity,
// } from '@apps/apis'
import { createFormActions } from '@apps/formily'
import { Button, Modal, Table } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { getIntl } from '@linkseeks/i18n'
import { getWebIntl } from '@apps/locales'
const translate = getWebIntl()
// 快捷修改单价高级筛选
export const newSchema = (key: string) => ({
  type: 'object',
  properties: {
    mageLayout: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          flexWrap: 'nowrap',
        },
        colStyle: {
          marginLeft: 20,
        },
      },
      properties: {
        productId: {
          type: 'string',
          'x-component-props': {
            placeholder: '商品ID',
          },
        },
        name: {
          type: 'string',
          'x-component-props': {
            placeholder: getIntl().formatMessage({
              id: 'commodity.products.schema.productSchema.name',
            }),
          },
        },
        priceType: {
          type: 'string',
          enum: [
            {
              label: getIntl().formatMessage({
                id: 'commodity.products.schema.fastSchema.priceTypeList.1',
              }),
              value: '',
            },
            {
              label: getIntl().formatMessage({
                id: 'commodity.products.schema.fastSchema.priceTypeList.2',
              }),
              value: 1,
            },
            {
              label: getIntl().formatMessage({
                id: 'commodity.products.schema.fastSchema.priceTypeList.3',
              }),
              value: 2,
            },
          ],
          'x-component-props': {
            placeholder: getIntl().formatMessage({
              id: 'commodity.products.schema.productSchema.priceTypeList.placeholder',
            }),
          },
          style: { width: '174px' },
        },
        brandName: {
          type: 'string',
          'x-component-props': {
            placeholder: getIntl().formatMessage({
              id: 'commodity.products.schema.productSchema.brandId',
            }),
          },
        },
        customerCategoryName: {
          type: 'string',
          'x-component-props': {
            placeholder: getIntl().formatMessage({
              id: 'commodity.products.schema.productSchema.customerCategoryId',
            }),
          },
        },
        memberName: {
          type: 'string',
          'x-component-props': {
            placeholder:
              key === 'upperMemberName'
                ? getIntl().formatMessage({
                    id: 'commodity.products.shangyougongyingxuanzeshangpin',
                  })
                : getIntl().formatMessage({
                    id: 'commodity.products.xiayouxiaoshouxuanzeshangpin',
                  }),
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: '',
          },
        },
      },
    },
  },
})

export const ProductView = (props) => {
  // 查看上游弹窗
  const { visible, setVisible, productId } = props
  const columns = [
    {
      title: getIntl().formatMessage({ id: 'commodity.products.xuhao' }),
      // dataIndex: 'num',
      // key: 'num',
      render: (_text, _record, index) => `${index + 1}`,
    },
    {
      title: getIntl().formatMessage({
        id: 'commodity.products.shangyougongyinghuiyuanmingcheng',
      }),
      dataIndex: 'upperMemberName',
      key: 'upperMemberName',
    },
    {
      title: getIntl().formatMessage({
        id: 'commodity.products.shangyougongyingshangpinID',
      }),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: getIntl().formatMessage({
        id: 'commodity.products.shangyougongyingshangpinmingcheng',
      }),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: getIntl().formatMessage({ id: 'commodity.products.pinlei' }),
      dataIndex: 'customerCategory',
      key: 'customerCategory',
      render: (text) => text?.name,
    },
    {
      title: getIntl().formatMessage({ id: 'commodity.products.pinpai' }),
      dataIndex: 'brand',
      key: 'brand',
      render: (text) => text?.name,
    },
    {
      title: getIntl().formatMessage({ id: 'commodity.products.danwei' }),
      dataIndex: 'unitName',
      key: 'unitName',
    },
    {
      title: getIntl().formatMessage({
        id: 'commodity.products.shangpindingjia',
      }),
      dataIndex: 'priceType',
      key: 'priceType',
      render: (text) => {
        switch (text) {
          case 1:
            return getIntl().formatMessage({
              id: 'commodity.checkProduct.priceType.1',
            })
          case 2:
            return getIntl().formatMessage({
              id: 'commodity.checkProduct.priceType.2',
            })
          case 3:
            return getIntl().formatMessage({
              id: 'commodity.checkProduct.priceType.3',
            })
        }
      },
    },
    {
      title: getIntl().formatMessage({ id: 'commodity.products.jiage' }),
      dataIndex: 'min',
      key: 'min',
      render: (text, record) => {
        return `${translate('web.common.currencySymbol')}${text}~${translate('web.common.currencySymbol')}${record.max}`
      },
    },
  ]
  const [dataSource, setDataSource] = useState<any>([])
  // const fetchData = (item: any) => {
  //   const params = {
  //     current: '1',
  //     pageSize: '10',
  //     productId,
  //     ...item,
  //   };
  //   return new Promise(resolve => {
  //     getProductCommodityGetUpperCommodityListS2B(params).then(res => {
  //       resolve({
  //         totalCount: res.data.totalCount,
  //         data: res.data.data,
  //       });
  //     });
  //   });
  // };
  useEffect(() => {
    if (productId) {
      // const params: GetProductCommodityGetUpperCommodityListS2BRequest = {
      //   current: '1',
      //   pageSize: '50',
      //   productId,
      //   name: '',
      //   priceType: '',
      //   customerCategoryName: '',
      //   memberName: '',
      //   brandName: '',
      // }
      // getProductCommodityGetUpperCommodityListS2B(params).then((res) => {
      //   if (res.code === 1000) {
      //     setDataSource(res.data.data)
      //   }
      // })
    }
  }, [productId])
  return (
    <Modal
      title={getIntl().formatMessage({
        id: 'commodity.products.zhakanshangyoushangpin',
      })}
      visible={visible}
      width={1200}
      onCancel={() => setVisible(false)}
      footer={
        <Button onClick={() => setVisible(false)}>
          {getIntl().formatMessage({ id: 'commodity.products.guanbi' })}
        </Button>
      }
    >
      {/* <StandardTable
        columns={columns}
        tableProps={{
          rowKey: 'id',
        }}
        fetchTableData={(params: any) => fetchData(params)}
      /> */}
      <Table dataSource={dataSource} columns={columns} rowKey="id" />
    </Modal>
  )
}

export const ProductSel = (props) => {
  // 选择商品
  const { visible, setVisible, titleKey } = props
  /** 带参数查询，给表单带默认值 */
  // const { clear } = useSetSearchValueInTable();
  const ref = useRef<any>({})
  const [rowSelection, RowCtl] = useRowSelectionTable({ customKey: 'id' })
  const [loading, setLoading] = useState<boolean>(false)
  const columns = (tKey: string) => {
    const arr = [
      {
        title: getIntl().formatMessage({ id: 'commodity.products.shangpinID' }),
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: getIntl().formatMessage({
          id: 'commodity.products.shangpinmingcheng',
        }),
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: getIntl().formatMessage({ id: 'commodity.products.pinlei' }),
        dataIndex: 'customerCategory',
        key: 'customerCategory',
        render: (text) => text?.name,
      },
      {
        title: getIntl().formatMessage({ id: 'commodity.products.pinpai' }),
        dataIndex: 'brand',
        key: 'brand',
        render: (text) => text?.name,
      },
      {
        title: getIntl().formatMessage({ id: 'commodity.products.danwei' }),
        dataIndex: 'unitName',
        key: 'unitName',
      },
      {
        title: getIntl().formatMessage({
          id: 'commodity.products.shangpindingjia',
        }),
        dataIndex: 'priceType',
        key: 'priceType',
        render: (text) => {
          switch (text) {
            case 1:
              return getIntl().formatMessage({
                id: 'commodity.checkProduct.priceType.1',
              })
            case 2:
              return getIntl().formatMessage({
                id: 'commodity.checkProduct.priceType.2',
              })
            case 3:
              return getIntl().formatMessage({
                id: 'commodity.checkProduct.priceType.3',
              })
          }
        },
      },
      {
        title: `${
          tKey === 'upperMemberName'
            ? getIntl().formatMessage({
                id: 'commodity.products.shangyougongyinghuiyuan',
              })
            : getIntl().formatMessage({
                id: 'commodity.products.xiayouxiaoshouhuiyuan',
              })
        }`,
        dataIndex: tKey,
        key: tKey,
      },
      {
        title: getIntl().formatMessage({ id: 'commodity.products.danjia' }),
        dataIndex: 'min',
        key: 'min',
        render: (text, record) => {
          return `${translate('web.common.currencySymbol')}${text}~${translate('web.common.currencySymbol')}${
            record.max
          }`
        },
      },
      {
        title: getIntl().formatMessage({ id: 'commodity.products.zhuangtai' }),
        dataIndex: 'status',
        key: 'status',
        render: (text) => {
          switch (text) {
            case 1:
              return getIntl().formatMessage({ id: 'commodity.checkProduct.status.1' })
            case 2:
              return getIntl().formatMessage({ id: 'commodity.checkProduct.status.2' })
            case 3:
              return getIntl().formatMessage({ id: 'commodity.checkProduct.status.3' })
            case 4:
              return getIntl().formatMessage({ id: 'commodity.checkProduct.status.4' })
            case 5:
              return getIntl().formatMessage({ id: 'commodity.checkProduct.status.5' })
            case 6:
              return getIntl().formatMessage({ id: 'commodity.checkProduct.status.6' })
          }
        },
      },
    ]
    if (tKey === 'subMemberName') {
      arr.splice(7, 1)
    }
    return arr
  }
  const formActions = createFormActions()
  // const fetchData = (item: GetProductCommodityGetUpperCommodityListS2BRequest) => {
  //   const params = {
  //     current: '1',
  //     pageSize: '10',
  //     // name: '',
  //     // priceType: '',
  //     // customerCategoryName: '',
  //     // memberName: '',
  //     // brandName: '',
  //     // productId: '',
  //     ...item,
  //   }
  //   const fn =
  //     titleKey === 'upperMemberName'
  //       ? getProductCommodityGetUpperCommodityListS2B
  //       : getProductCommodityGetSubCommodityListS2B
  //   return new Promise((resolve) => {
  //     fn(params).then((res) => {
  //       resolve(res.data)
  //     })
  //   })
  // }
  const handleOk = () => {
    setLoading(true)
    // const fn =
    //   titleKey === 'upperMemberName' ? postProductCommodityChoiceSubCommodity : postProductCommodityChoiceUpperCommodity
    // fn({ idList: RowCtl.selectedRowKeys }).then((res) => {
    //   if (res.code === 1000) {
    //     setVisible(false)
    //   }
    //   setLoading(false)
    // })
  }
  return (
    <Modal
      title={
        titleKey === 'upperMemberName'
          ? getIntl().formatMessage({
              id: 'commodity.products.xuanzeshangyougongyingshangpin',
            })
          : getIntl().formatMessage({
              id: 'commodity.products.xuanzexiayouxiaoshoushangpin',
            })
      }
      visible={visible}
      width={1200}
      onOk={handleOk}
      onCancel={() => setVisible(false)}
      confirmLoading={loading}
    >
      <StandardTable
        columns={columns(titleKey)}
        currentRef={ref}
        rowSelection={rowSelection}
        tableProps={{
          rowKey: 'id',
        }}
        // fetchTableData={(params) => fetchData(params)}
        controlRender={
          <NiceForm
            actions={formActions}
            onSubmit={(values) => ref.current.reload(values)}
            schema={newSchema(titleKey)}
          />
        }
      />
      {/* <Table dataSource={dataSource} columns={columns} />; */}
    </Modal>
  )
}
