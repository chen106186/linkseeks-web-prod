import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { getMemberCustomerRectifyStatusList } from '@apps/apis';

type OptionType = {
  label: string,
  value: string
}

type Options = {
  fetchStatusListApi?: () => Promise<any>,
  key?: string
}

/**
 * 我分成每个模块都有一个column的hook， 合并action 列以及 状态列筛选列，这里请求方法直接写死算了
 * 但其实可以把整个hook提取出来，整成公用的
 * @param columnsList
 * @param actionColumn
 * @returns
 */
export default function useColumns<T>(columnsList: ColumnsType<T>, actionColumn?: ColumnsType<T>, options?: Options & { [key: string]: any } ) {
  const [columns, setColumns] = useState(() => {
    return columnsList.concat(actionColumn || []);
  });
  const [statusOptions, setStatusOptions] = useState<OptionType[]>([]);

  const defaultOptions = useMemo(() => options, [options])

  const fetchStatusOptions = useCallback(async () => {
    const defaultApi = defaultOptions && defaultOptions.fetchStatusListApi || getMemberCustomerRectifyStatusList
    const { code, data } = await defaultApi();
    if (code === 1000) {
      const formatedData = data.map((_item) => ({label: _item.message, value: _item.code}));
      setStatusOptions(formatedData)
      return formatedData
    }
    return [];
  }, [defaultOptions])

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
    if(statusOptions.length === 0) {
      return ;
    }
    const mapKeys = {
      [defaultOptions?.key || 'status']: statusOptions,
    }
    const keys = Object.keys(mapKeys) || []
    const map = {};
    keys.forEach((_item: keyof typeof mapKeys) => {
      map[_item] = mapKeys[_item].map((_row) => ({ text: _row.label, ..._row }))
    })
    // setColumnsWithFilterOption(map)
  }, [statusOptions])


  const cacheColumns = useMemo(() => columns, [columns])
  return { columns: cacheColumns, setColumns, fetchStatusOptions };
}
