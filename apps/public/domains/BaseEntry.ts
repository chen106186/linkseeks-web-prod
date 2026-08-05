export interface IEntityWithId<T> {
  id: T
}

export interface IEntityStatus<S, D = string> {
  status: S
  desc: D
}

export interface IEntityEnumLabel<L = number> {
  level: L
  value: string
}

export interface IValueObject<T> {
  value: T
  equals(other: IValueObject<T>): boolean
}

type EnumValue = number | string

export abstract class BaseEnum {
  constructor(readonly value: EnumValue) {}

  toString(): string {
    return String(this.value)
  }
}
