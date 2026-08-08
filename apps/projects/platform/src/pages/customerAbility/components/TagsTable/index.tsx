/**
 * @Description: 标签表格
 */
import React from 'react';
import { Table } from 'antd';
import { ColumnsType, TableProps } from 'antd/lib/table';
import TagsPane from '../TagsPane';

export type TagsTableDataType<D> = {
  /**
   * 标签名称
   */
  name: string,
  /**
   * 标签key 
   */
  key: string,
  /**
   * 表格数据
   */
  dataSource: D[],
}[]

export interface TagsTableProps<D = Record<string, any>> {
  /**
   * 表格 columns
   */
  columns: ColumnsType<any>,
  /**
   * 数据
   */
  data: TagsTableDataType<D>,
  /**
   * 表格rowKey
   */
  rowKey: string,

  tableProps?: TableProps<any>,

  children?: React.ReactNode,
}

const TagsTable: React.FC<TagsTableProps> = (props) => {
  const { columns, data, rowKey, tableProps } = props;

  return (
    <div className='tagsPane'>
      <TagsPane>
        {data.map((item) => (
          <TagsPane.Pane name={item.name} key={item.key}>
            <Table
              columns={columns}
              dataSource={item.dataSource}
              rowKey={rowKey}
              pagination={false}
              {...tableProps}
            />
          </TagsPane.Pane>
        ))}
      </TagsPane>
    </div>
  );
};

export default TagsTable;
