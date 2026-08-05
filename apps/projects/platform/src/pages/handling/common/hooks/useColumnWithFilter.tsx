import React, { useEffect, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { FilterResType } from './useFetchFilterData';

function useColumns<T>(defaultColumns: ColumnsType<T>, actionsList: ColumnsType<T>, filterRes?: FilterResType) {
  const [columns, setColumns] = useState<ColumnsType<T>>(() => defaultColumns.concat(actionsList));

  /**
   * 添加columns 的filter
   */
  const setColumnsWithFilterOption = (optionMap: {[key: string]: {text: string, value: string}[]}) => {
    const newColumns = [...columns];
    const keys = Object.keys(optionMap);
    newColumns.forEach((_item: ColumnsType<T>[0] & {dataIndex: string}) => {
      if(_item.dataIndex && keys.includes(_item.dataIndex)) {
        _item.filters = optionMap[_item.dataIndex];
      }
    })
    setColumns(newColumns);
  }

  useEffect(() => {
    const keys = filterRes && Object.keys(filterRes) || []
    if (keys.length === 0) {
      return;
    }
    const map = {};
    keys.forEach((_item: keyof FilterResType) => {
      map[_item] = filterRes[_item].map((_row) => ({ text: _row.label, ..._row }))
    })
    setColumnsWithFilterOption(map)
  }, [defaultColumns, filterRes])

  useEffect(() => {
    setColumns(() => defaultColumns.concat(actionsList));
  }, [defaultColumns])

  return { columns, setColumnsWithFilterOption }
}

export default useColumns
