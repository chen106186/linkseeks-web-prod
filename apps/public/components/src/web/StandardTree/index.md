---
group:
  title: 重型组件
---

# StandardTree

该组件的功能目前有

- [x] 拖拽元素
- [x] 节点增删改查
- [x] 节点复制粘贴
- [ ] ~~按需加载节点(接口请求)~~(过于累赘，暂不实现)
- [ ] ~~直接编辑节点~~(直接编辑在现阶段而言需求过于累赘，暂不实现)
- [ ] 右键呼出菜单

## 组件逻辑

1. 通过 context 链接整个 Tree 的数据，如 treeData，expandKeys 等，使得其中的子组件可以便捷的获取到数据， 同时外部可传入 children，配合 tree 组件实现任意联动，例如左侧是 tree，右侧是表单的布局，在表单组件中可通过 useTree 这一 hook 获取到 tree 相关的信息

2. 操作树节点可通过 menuUtil，其中包括遍历节点，增删改查等

3. 通过 TreeNode 组件可对单个节点进行操作修改

4. 可以使用普遍的复制粘贴快捷键例如 ctrl+c /v 进行快捷复制节点

5. 当新增/复制一个节点时，节点 id 是通过 uuid 库生成的，因为此时并未经过后端

### 有数据时

```tsx
import { StandardTree } from '@apps/components'

const data = [
  {
    title: '首页',
    id: 1,
    parentId: 0,
  },
  {
    title: '订单',
    id: 2,
    parentId: 0,
    children: [
      {
        title: '申请单',
        id: 20,
        parentId: 2,
      },
    ],
  },
]

export default () => (
  <StandardTree
    request={() => {
      return { data }
    }}
  />
)
```

### 树形菜单关联表单

```tsx
import { StandardTree, LineTitle, useTree } from '@apps/components'
import { Input } from '@linkseeks/ui'
const data = [
  {
    title: '首页',
    id: 1,
    parentId: 0,
  },
  {
    title: '订单',
    id: 2,
    parentId: 0,
    children: [
      {
        title: '申请单',
        id: 20,
        parentId: 2,
      },
    ],
  },
]

export default () => {
  const TreeContent = () => {
    const { selectNode } = useTree()
    return (
      <div style={{ flex: 1 }}>
        <LineTitle>菜单设置</LineTitle>
        <Input placeholder="请输入标题" value={selectNode?.title} />
      </div>
    )
  }

  return (
    <StandardTree
      request={() => {
        return { data }
      }}
    >
      <TreeContent />
    </StandardTree>
  )
}
```

### API

| 参数             | 说明                               | 类型                          | 可选值 | 默认值 |
| ---------------- | ---------------------------------- | ----------------------------- | ------ | ------ |
| request          | 树形数据初始化的请求               | `any`                         |        |        |
| handleToolDelete | 节点删除按钮                       | `(node: ITreeDataItem): void` |        |        |
| handleToolAdd    | 节点新增按钮                       | `(node: ITreeDataItem): void` |        |        |
| handleNodeClick  | 节点点击触发事件                   | `(node: any, e) => void`      |        |        |
| extraTools       | 右侧工具栏列表, 默认带有新增和删除 | `ToolItem[]`                  |        |        |
| height           | 树形菜单的高度                     | `number, string`              |        |        |

#### useTree

在使用该组件时可能会用到获取关于组件内部的一些信息

```ts
interface TreeContextProps {
  /**
   * 操作菜单节点的方法类,可以对节点进行增删改查以及更新
   */
  menuUtil: MenuUtil
  /**
   * 当前选中的节点
   */
  selectNode?: ITreeDataItem
  /**
   * 展开节点的集合
   */
  expandKeys: TreeId[]
  /**
   * 被选中的节点集合
   */
  selectKeys: TreeId[]
  /**
   * 设置展开节点
   * @param nodeKey 节点信息
   * @param isFixed 是否保持展开状态不变
   */
  setExpandKeys(nodeKey: TreeId, isFixed?: boolean): void
  /**
   * 设置选中节点
   */
  setSelectKeys(selectKeys: TreeId[]): void

  /**
   * 设置选中节点
   */
  setSelectNode(node: ITreeDataItem): void

  /**
   * 设置树形数据
   */
  setTreeData(treeData: ITreeDataItem[]): void

  /**
   * 树形数据
   */
  treeData: ITreeDataItem[]

  /**
   * 更新树形数据的状态
   * 由于treeData并不能直接响应页面状态，所以需要通过该方法进行视图更新
   *
   * 如果需要刷新请求数据则应该使用refreshTreeData
   */
  updateTreeData(): void

  /**
   * 点击节点时触发
   */
  handleNodeClick(node: ITreeDataItem, e): void

  /**
   * 节点右侧额外的按钮工具栏
   */
  extraTools: ToolItem[]

  /**
   * 事件响应系统，可参考@linkseeks/hooks中的useEventEmitter
   * @todo 目前暂未给该组件提供任何事件响应, 不过可自定义
   */
  event$: EventEmitter<any>

  /**
   * 收起所有展开的节点
   */
  handleExpandAll(): void

  /**
   * 刷新树形结构数据，相当于回到初始化的时候
   */
  refreshTreeData(): void

  /**
   * 右侧工具栏中，点击新增触发
   */
  handleToolAdd?(node: ITreeDataItem): void

  /**
   * 右侧工具栏中，点击删除触发
   */
  handleToolDelete?(node: ITreeDataItem): void
}
```
