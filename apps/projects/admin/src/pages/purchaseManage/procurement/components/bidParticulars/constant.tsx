import React from 'react'

export const columns = [
  {
    title: '物料编号/名称',
    dataIndex: 'name',
    key: 'name',
    render: (t, r) => (
      <>
        <div>{r.code}</div>
        <div>{t}</div>
      </>
    ),
  },
  {
    title: '规格型号',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '品类',
    dataIndex: 'categoryName',
    key: 'categoryName',
  },
  {
    title: '品牌',
    dataIndex: 'brandName',
    key: 'brandName',
  },
  {
    title: '采购数量/单位',
    dataIndex: 'count',
    key: 'count',
    render: (t, r) => (
      <>
        <div>{t}</div>
        <div>{r.unitName}</div>
      </>
    ),
  },
  {
    title: '含税/税率',
    dataIndex: 'isTax',
    key: 'isTax',
    render: (t, r) => (
      <>
        <div>{t ? '是' : '否'}</div>
        <div>{r.taxRate}%</div>
      </>
    ),
  },
  {
    title: '单价(含税)',
    dataIndex: 'price',
    key: 'price',
    render: (t) => `￥${t}`,
  },
  {
    title: '金额(含税)',
    dataIndex: 'money',
    key: 'money',
    render: (t, r) => `￥${Number((r.price * r.count).toFixed(2))}`,
  },
]
