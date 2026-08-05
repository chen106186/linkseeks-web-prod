import React, { memo, useEffect, useRef } from 'react'
import SortableJS from 'sortablejs'

interface StoreType {
  nextSibling: any
  activeComponent: any
}

const store: StoreType = {
  nextSibling: null,
  activeComponent: null,
}

function Sortable(props: any) {
  const { options = {}, onChange, ...rest } = props
  const sortRef = useRef()

  useEffect(() => {
    ;['onChoose', 'onAdd', 'onUpdate', 'onMove', 'onEnd'].forEach((name) => {
      const eventHandler = options[name]
      options[name] = (...params: any) => {
        const [evt] = params

        if (name === 'onChoose') {
          store.nextSibling = evt.item.nextElementSibling
          store.activeComponent = sortRef.current
        } else if ((name === 'onAdd' || name === 'onUpdate') && onChange) {
          // const items = sortable.toArray();
          // const referenceNode =
          //   store.nextSibling && store.nextSibling.parentNode !== null
          //     ? store.nextSibling
          //     : null;
          // evt.from.insertBefore(evt.item, referenceNode);
          // onChange && onChange(items, evt);
        } else if (name === 'onMove') {
          // console.log(evt, 'evt');
        } else if (name === 'onEnd' && onChange) {
          const items = sortable.toArray()
          onChange && onChange(items, evt)
        }
        if (evt.type === 'move') {
          const [evt, originalEvent] = params
          return eventHandler ? eventHandler(evt, originalEvent) : true
        }

        setTimeout(() => {
          eventHandler && eventHandler(evt)
        }, 0)
      }
    })
    // options['sort'] = false; // boolean 定义是否列表单元是否可以在列表容器内进行拖拽排序
    options['fallbackOnBody'] = true
    options['filter'] = '.ignore-elements'
    const sortable = SortableJS.create(sortRef.current, options)

    return () => {
      sortable.destroy()
    }
  }, [sortRef.current])
  return <div {...rest} ref={sortRef} />
}

export default memo(Sortable)
