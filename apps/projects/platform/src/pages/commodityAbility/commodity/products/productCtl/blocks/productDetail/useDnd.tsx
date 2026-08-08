import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  CSS,
  useSensors,
  useSensor,
  KeyboardSensor,
  PointerSensor,
  sortableKeyboardCoordinates,
  DndContext,
  closestCenter,
  arrayMove,
} from '@linkseeks/tools'

export const useDnd = () => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      /**
       * 该属性可以将元素的onClick正常触发，如果不触发原因是外部的onMouse事件影响了
       */
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  return {
    sensors,
  }
}

export const DndContextProvider = ({ children, sensors, handleDragEnd, items }) => {
  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  )
}
