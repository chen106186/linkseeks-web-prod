import { useState } from 'react'
import { AttributeModel } from '../models/AttributeModel'
import { AttributeManager } from '../models/AttributeManager'
import { useReactive } from '@linkseeks/hooks'
export const useAttributeManager = () => {
  const [attributeInstance, setAttributeInstance] = useState<AttributeModel[]>([])
  // 将所有属性状态化
  const attributeManager = useReactive<AttributeManager>(new AttributeManager())

  const initAttribute = (attributeModels: AttributeModel[]) => {
    attributeManager.initAttribute(attributeModels)
    setAttributeInstance(attributeModels)
  }

  return {
    attributeManager,
    attributeInstance,
    initAttribute,
  }
}
