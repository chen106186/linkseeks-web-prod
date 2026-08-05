import React from 'react'
import type { FieldEntity, NotifyInfo, Store, ValuedNotifyInfo, Callbacks } from './typings'

export interface FormInstance {
  getFieldValue: typeof FormStore.prototype.getFieldValue
  getFieldsValue: typeof FormStore.prototype.getFieldsValue
  setFieldsValue: typeof FormStore.prototype.setFieldsValue
  submit: typeof FormStore.prototype.submit
  resetFields: typeof FormStore.prototype.resetFields
  getInternalHooks: typeof FormStore.prototype.getInternalHooks
}

export interface InternalHooks {
  updateValue: typeof FormStore.prototype.updateValue
  initEntityValue: typeof FormStore.prototype.initEntityValue
  registerField: typeof FormStore.prototype.registerField
  setInitialValues: typeof FormStore.prototype.setInitialValues
  setCallbacks: typeof FormStore.prototype.setCallbacks
}

export class FormStore {
  private store: Store = {}
  private fieldEntities: FieldEntity[] = []
  private initialValues: Store = {}
  private callbacks: Callbacks = {}
  // TODO 未处理children为function的情况
  // private forceRootUpdate: () => void;

  // TODO 未处理children为function的情况
  // constructor(forceRootUpdate: () => void) {
  //   this.forceRootUpdate = forceRootUpdate;
  // }

  public getForm = (): FormInstance => ({
    getFieldValue: this.getFieldValue,
    getFieldsValue: this.getFieldsValue,
    setFieldsValue: this.setFieldsValue,
    submit: this.submit,
    resetFields: this.resetFields,
    getInternalHooks: this.getInternalHooks,
  })

  public getInternalHooks = (): InternalHooks => {
    return {
      updateValue: this.updateValue,
      initEntityValue: this.initEntityValue,
      registerField: this.registerField,
      setInitialValues: this.setInitialValues,
      setCallbacks: this.setCallbacks,
    }
  }

  public setInitialValues = (initialValues: Store | undefined, init: boolean) => {
    this.initialValues = initialValues || {}
    if (init) {
      this.store = { ...this.store, ...initialValues }
    }
  }

  public getFieldValue = (name: string) => {
    return this.store[name]
  }

  public getFieldsValue = () => {
    return { ...this.store }
  }

  public setFieldsValue = (store: Store) => {
    const prevStore = this.store

    if (store) {
      this.store = { ...this.store, ...store }
    }

    this.notifyObservers(prevStore, undefined, {
      type: 'valueUpdate',
      source: 'external',
    })
  }

  public updateValue = (name: string | undefined, value: any) => {
    if (name === undefined) return
    const prevStore = this.store
    this.store = { ...this.store, [name]: value }
    console.log('this.store', this.store)
    this.notifyObservers(prevStore, [name], {
      type: 'valueUpdate',
      source: 'internal',
    })

    const { onValuesChange } = this.callbacks
    // 取出onValuesChange，如果不为空则执行且传入相应的参数
    if (onValuesChange) {
      const changedValues = { [name]: this.store[name] }
      onValuesChange(changedValues, this.getFieldsValue())
    }
  }

  private getFieldEntities = () => {
    return this.fieldEntities.filter((field) => field.props.name)
  }

  public registerField = (entity: FieldEntity) => {
    this.fieldEntities.push(entity)
    // Set initial values
    // if (entity.props.initialValue !== undefined) {
    //   const prevStore = this.store;
    //   this.notifyObservers(prevStore, entity.props.name, {
    //     type: 'valueUpdate',
    //     source: 'internal',
    //   });
    // }

    return () => {
      this.fieldEntities = this.fieldEntities.filter((item) => item !== entity)
    }
  }

  public initEntityValue = (entity: FieldEntity) => {
    const { initialValue, name } = entity.props
    if (name !== undefined) {
      const prevValue = this.store[name]

      if (prevValue === undefined) {
        this.store = { ...this.store, [name]: initialValue }
      }
    }
  }

  private notifyObservers = (prevStore: Store, namePathList: string[] | undefined, info: NotifyInfo) => {
    // TODO 未处理children为function的情况
    const mergedInfo: ValuedNotifyInfo = {
      ...info,
      store: this.getFieldsValue(),
    }
    this.getFieldEntities().forEach(({ onStoreChange }) => {
      onStoreChange(prevStore, namePathList, mergedInfo)
    })
  }

  public setCallbacks = (callbacks: Callbacks) => {
    this.callbacks = callbacks
  }

  public submit = () => {
    const { onFinish } = this.callbacks
    if (onFinish) {
      onFinish(this.store)
    }
  }

  public resetFields = (nameList?: string[]) => {
    const prevStore = this.store
    // 如果没有传形参，则直接重置整个store
    if (!nameList) {
      this.store = { ...this.initialValues }
      this.resetWithFieldInitialValue()
      this.notifyObservers(prevStore, undefined, { type: 'reset' })
      return
    }
    nameList.forEach((name) => {
      this.store[name] = this.initialValues[name]
    })
    this.resetWithFieldInitialValue({ nameList })
    this.notifyObservers(prevStore, nameList, { type: 'reset' })
  }

  private resetWithFieldInitialValue = (
    info: {
      entities?: FieldEntity[]
      nameList?: string[]
    } = {},
  ) => {
    const cache: Record<string, FieldEntity> = {}
    this.getFieldEntities().forEach((entity) => {
      const { name, initialValue } = entity.props
      if (initialValue !== undefined) {
        cache[name!] = entity
      }
    })

    let requiredFieldEntities: FieldEntity[]
    if (info.entities) {
      requiredFieldEntities = info.entities
    } else if (info.nameList) {
      requiredFieldEntities = []
      info.nameList.forEach((name) => {
        const record = cache[name]
        if (record) {
          requiredFieldEntities.push(record)
        }
      })
    } else {
      requiredFieldEntities = this.fieldEntities
    }

    const resetWithFields = (entities: FieldEntity[]) => {
      entities.forEach((field) => {
        const { initialValue, name } = field.props
        if (initialValue !== undefined && name !== undefined) {
          const formInitialValue = this.initialValues[name]
          if (formInitialValue === undefined) {
            this.store[name] = initialValue
          }
        }
      })
    }

    resetWithFields(requiredFieldEntities)
  }
}

export function useForm(form?: FormInstance): [FormInstance] {
  const formRef = React.useRef<FormInstance>()

  if (!formRef.current) {
    // form作为参数，若form不为空，则不会创建且会把form存入formRef里
    if (form) {
      formRef.current = form
      // 若form为空，则创建formStore且把getForm()返回的对象存入formRef里
    } else {
      const formStore: FormStore = new FormStore()
      formRef.current = formStore.getForm()
    }
  }
  // 最后返回formRef.current
  return [formRef.current]
}
