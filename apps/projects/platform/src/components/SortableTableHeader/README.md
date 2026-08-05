### SortableTableHeader 使用说明

#### 给 Antd Table 添加可拖拽头部
步骤 1: 从 '@/components/SortableTableHeader' 中引入相关组件及方法
步骤 2: 将页面中定义给 Table 的 columns 传给 useSortableColumns，并设置Table组件的属性columns 为 useSortableColumns 返回的 columns
步骤 3: 给 Table 组件设置对应 components、onHeaderRow 属性

<font color=RoyalBlue>* 注：如果表格使用了 rowSelection 属性，记得 useSortableColumns 第二个参数传递 true，否则会出现不能正常拖拽、伸缩</font>

```tsx
import React from 'react';
import { Table } from 'antd';
import SortableTableHeader, { useSortableColumns } from '@/components/SortableTableHeader';

type UserInfoType = {
  key: string,
  name: string,
  age: number,
  address: string,
}

const dataSource: UserInfoType[] = [
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
];

const SortableTableList: React.FC<any> = () => {
  const defaultColumns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '住址',
      dataIndex: 'address',
      key: 'address',
    },
  ];

  const [columns, setColumns] = useSortableColumns<UserInfoType>(defaultColumns, false);

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      components={{
        header: {
          row: SortableTableHeader.DraggableHeaderRow,
          cell: SortableTableHeader.DraggableHeaderCell,
        },
      }}
      onHeaderRow={(_, index) => ({
        columns,
        index,
        setColumns,
      }) as any}
    />
  );
};
```

#### 添加 自定义表格显示 弹窗
步骤 1: 从 '@/components/SortableTableHeader' 中引入相关组件及方法
步骤 2: 在页面上添加 CustomColumnsConfigure 组件，并传入 onConfirm 方法在点击弹窗确认按钮时 设置新的 columns

```tsx
import React from 'react';
import { Table } from 'antd';
import SortableTableHeader, { useSortableColumns, CustomColumnsConfigure } from '@/components/SortableTableHeader';

type UserInfoType = {
  key: string,
  name: string,
  age: number,
  address: string,
}

const dataSource: UserInfoType[] = [
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
];

const SortableTableList: React.FC<any> = () => {
  const defaultColumns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '住址',
      dataIndex: 'address',
      key: 'address',
    },
  ];

  const [columns, setColumns] = useSortableColumns<UserInfoType>(defaultColumns, false);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          paddingTop: 20,
          paddingBottom: 20,
        }}
      >
        <CustomColumnsConfigure
          defaultColumns={columns}
          onConfirm={(newColumns) => setColumns(newColumns)}
        />
      </div>
      <Table
        columns={columns}
        dataSource={dataSource}
        components={{
          header: {
            row: SortableTableHeader.DraggableHeaderRow,
            cell: SortableTableHeader.DraggableHeaderCell,
          },
        }}
        onHeaderRow={(internalColumns, index) => ({
          columns: internalColumns,
          index,
          setColumns,
        }) as any}
      />
    </div>
  );
};
```

<font color=RoyalBlue>* 注：CustomColumnsConfigure 的 defaultColumns属性，只有初始值才会生效哦，类似 Antd 表单元素的 defaultValue</font>

如果 columns 是异步获取之类的，可以传递 ref 调用 CustomColumnsConfigure 暴露出的 resetDefaultColumns 方法来设置 columns

```tsx
import React, { useRef, useEffect } from 'react';
import { Table } from 'antd';
import { ColumnType } from 'antd/lib/table';
import SortableTableHeader, { useSortableColumns, CustomColumnsConfigure, CustomColumnsConfigureRef } from '@/components/SortableTableHeader';

type UserInfoType = {
  key: string,
  name: string,
  age: number,
  address: string,
}

const dataSource: UserInfoType[] = [
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
];

const SortableTableList: React.FC<any> = () => {

  const [columns, setColumns] = useSortableColumns<UserInfoType>([], false);

  const customColumnsConfigureRef = useRef<CustomColumnsConfigureRef | null>(null);

  useEffect(() => {
    const fetchColumns = (): Promise<ColumnType<UserInfoType>[]> => (
      new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              title: '姓名',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: '年龄',
              dataIndex: 'age',
              key: 'age',
            },
            {
              title: '住址',
              dataIndex: 'address',
              key: 'address',
            },
          ]);
        }, 1500);
      })
    );

    fetchColumns().then((res) => {
      setColumns(res);
      customColumnsConfigureRef.current?.resetDefaultColumns(res);
    });
  }, []);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          paddingTop: 20,
          paddingBottom: 20,
        }}
      >
        <CustomColumnsConfigure
          defaultColumns={columns}
          onConfirm={(newColumns) => setColumns(newColumns)}
          ref={customColumnsConfigureRef}
        />
      </div>
      <Table
        columns={columns}
        dataSource={dataSource}
        components={{
          header: {
            row: SortableTableHeader.DraggableHeaderRow,
            cell: SortableTableHeader.DraggableHeaderCell,
          },
        }}
        onHeaderRow={(internalColumns, index) => ({
          columns: internalColumns,
          index,
          setColumns,
        }) as any}
      />
    </div>
  );
};
```

#### 在项目组件 StandardTable 中使用相关组件

<font color=RoyalBlue>* 注：下方是伪代码，用法基本与 Antd Table 是一致的，只需要设置必要的属性及使用对应的组件即可</font>

```tsx
import React, { useCallback } from 'react';
import { Table } from 'antd';
import SortableTableHeader, { useSortableColumns, CustomColumnsConfigure } from '@/components/SortableTableHeader';

type UserInfoType = {
  key: string,
  name: string,
  age: number,
  address: string,
}

const SortableTableList: React.FC<any> = () => {
  const defaultColumns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '住址',
      dataIndex: 'address',
      key: 'address',
    },
  ];

  const [columns, setColumns] = useSortableColumns<UserInfoType>(defaultColumns);

  const EnhanceCustomColumnsConfigure = useCallback(() => (
    <CustomColumnsConfigure
      defaultColumns={columns}
      onConfirm={(newColumns) => setColumns(newColumns)}
    />
  ), []);

  return (
    <div>
      <StandardTable
        columns={columns}
        controlRender={
          <NiceForm
            components={{
              EnhanceCustomColumnsConfigure,
            }}
          />
        }
        tableProps={{
          scroll: { x: 1200 },
          components: {
            header: {
              row: SortableTableHeader.DraggableHeaderRow,
              cell: SortableTableHeader.DraggableHeaderCell,
            },
          },
          onHeaderRow: (_, index) => ({
            columns,
            index,
            setColumns,
          }) as any,
        }}
      />
    </div>
  );
};
```

#### 关于 columns 宽度大小 及 Table 水平滚动的问题
1: [参考设计](https://codesign.qq.com/workspace/prototype/6dqN2922Wd9aBXe/ALwE9VWxo20X1Dp/inspect)
2: [参考文档](https://ant.design/components/table-cn/#components-table-demo-fixed-columns)