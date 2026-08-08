/**
 * @Description TreeSelect Filed
 */
import React, { useState, useEffect } from 'react';
import { TreeSelect } from 'antd';

function convertDataToEnhanced(
  treeData: TreeSelectProps['treeData'],
  disabledKeys: DisbledKeysType,
  fieldNames: TreeSelectProps['fieldNames'],
): TreeSelectProps['treeData'] {
  // 跳过检查
  if (!disabledKeys || !disabledKeys.length) {
    return treeData;
  }
  const ret: TreeSelectProps['treeData'] = [];
  formatedTreeData(treeData, disabledKeys, ret, fieldNames);
  return ret;
};

function formatedTreeData (
  treeData: TreeSelectProps['treeData'],
  disabledKeys: DisbledKeysType,
  hash: TreeSelectProps['treeData'],
  fieldNames: TreeSelectProps['fieldNames'],
) {
  let { value: valueKey, children: childrenKey } = fieldNames;
  valueKey = valueKey || 'value';
  childrenKey = childrenKey || 'children';

  treeData.forEach((item) => {
    const entity = {
      ...item,
      disabled: disabledKeys.includes(item[valueKey]),
      [childrenKey]: [],
    };
    if (item[childrenKey]) {
      formatedTreeData(item[childrenKey], disabledKeys, entity[childrenKey], fieldNames);
    }
    hash.push(entity);
  })
}

interface TreeSelectProps extends React.ComponentProps<typeof TreeSelect> {}

type DisbledKeysType = React.Key[]

interface TreeSelectField extends TreeSelectProps {
  /**
   * 禁用项keys
   */
  disabledKeys: DisbledKeysType,
}

const TreeSelectField: React.FC<any> & { isFieldComponent: boolean } = (props) => {
  const { mutators, path, value, editable } = props;
  // 获取组件路径中的索引值，来判断是在表格中的索引
  const index = Number(path.match(/\d/ig)[0])
  const xComponentProps: TreeSelectField = props.props['x-component-props'] || {};
  const { disabled, disabledKeys, treeData, ...restComponentProps } = xComponentProps;

  const [internalTreeData, setInternalTreeData] = useState(treeData || []);
  const [checkValue, setCheckValue] = useState(value)

  useEffect(() => {
    if ('treeData' in xComponentProps) {
      // 过滤掉自身value值
      const leftover = disabledKeys?.filter((item) => !value?.includes(item));
      setInternalTreeData(convertDataToEnhanced(treeData, leftover, restComponentProps.fieldNames));
    }
  }, [treeData, disabledKeys, restComponentProps.fieldNames, value]);

  const onChange = (value) => {
    setCheckValue(value)
    mutators.change(value);
  }

  const platTreeData = (list: any[]): any[] => {
    let res = []
    console.log('list', list);
    
    res = list?.concat(...list.map(item => {
      if (Array.isArray(item.children) && item.children.length > 0) {
        return platTreeData(item.children)
      }
      return item
    }))
    return res
  }


  const matchTreeData = (): string => {
    if (value && Array.isArray(value) && value.length > 0) {
      const platList = platTreeData(treeData)
      const result = value.map((id) => platList?.find(item => item.id === id)?.title).join(' - ')
      return result
    }
    if (index == 0) {
      mutators.change(treeData[0].id)
      return treeData[0].title
    }
  }

  return (index !== 0 && editable) ? (
    <TreeSelect
      style={{ width: '100%' }}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      value={checkValue}
      onChange={onChange}
      treeDefaultExpandAll
      allowClear
      treeCheckable
      disabled={!editable}
      showCheckedStrategy={TreeSelect.SHOW_ALL}
      treeData={internalTreeData}
      {...restComponentProps}
    />
  ) : matchTreeData()
}

TreeSelectField.isFieldComponent = true

export default TreeSelectField;