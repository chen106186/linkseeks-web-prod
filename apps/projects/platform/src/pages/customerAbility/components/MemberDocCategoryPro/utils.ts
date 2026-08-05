export type CategoryItemType = {
  /**
   * 数据id
   */
  id: string,
  /**
   * 父级id
   */
  parentId: string,
  /**
   * 标题
   */
  title: string,
  /**
   * 是否选中
   */
  checked: boolean,
  /**
   * 图片url路径
   */
  imageUrl: string,
  /**
   * 子元素
   */
  children?: CategoryItemType[],
}

export function breakUpCategory(dataSource: CategoryItemType[]): {} {
  const valueMap = {};
  function loops(list, parent?) {
    return (list || []).map(({ children, id, title }) => {
      const node: any = (valueMap[id] = {
        parent,
        parentId: parent?.categoryId || 0,
        categoryId: +id,
        level: (parent?.level || 0) + 1,
        name: title,
      });
      node.children = loops(children, node);
      return node;
    });
  }
  loops(dataSource);
  return valueMap;
}

export type CategoryType = {
  /**
   * 层级
   */
  level: number,
  /**
   * 品类id
   */
  categoryId: number,
  /**
   * 品类名称
   */
  name: string,
  /**
   * 子节点
   */
  children?: CategoryType[],
  /**
   * 父级id
   */
  parentId: number,
  /**
   * 父级
   */
  parent?: CategoryType,
}

export function getCategoryPath(value: string, valueMap: {}): CategoryType[] {
  const path: CategoryType[] = [];
  let current = valueMap[value];
  while (current) {
    path.unshift({
      level: current.level,
      categoryId: current.categoryId,
      name: current.name,
      parentId: current.parentId,
    });
    current = current.parent;
  }
  return path;
}

export function getCategoryAllKeys(dataSource: CategoryType[]): string[] {
  const ret: string[] = [];
  function loops(list: CategoryType[]) {
    list.forEach((item) => {
      if (item.children && item.children.length) {
        loops(item.children);
      } else {
        ret.push(`${item.categoryId}`);
      }
    });
  }
  loops(dataSource);
  return ret;
};

export function nestedCategory(dataSource: CategoryType[]): CategoryType {
  return dataSource.reduceRight((pre, now) => {
    const { parent, ...rest } = now;
    return [{
      ...rest,
      children: pre,
    }];
  }, [])[0];
}