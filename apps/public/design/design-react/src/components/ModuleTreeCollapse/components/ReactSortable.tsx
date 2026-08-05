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

interface Iprops {
  onMoveEnd: (evt, ref: any) => void
}

function Sortable(props: any) {
  const { options = {}, onChange, onMoveEnd, ...rest } = props
  const sortRef = useRef()
  const sortableRef = useRef<any>()

  useEffect(() => {
    if (sortRef.current) {
      options.onEnd = (evt) => {
        props.onMoveEnd && props.onMoveEnd(evt, sortableRef.current)
      }
      options.onStart = (evt) => {
        props.onStart && props.onStart(evt, sortableRef.current)
      }
      sortableRef.current = SortableJS.create(sortRef.current, options)
    }
    return () => {
      if (sortableRef.current) {
        sortableRef.current.destroy()
      }
    }
  }, [])

  return <div {...rest} ref={sortRef} />
}

export default memo(Sortable)
