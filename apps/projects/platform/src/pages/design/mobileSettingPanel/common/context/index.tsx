import { ISchemaFormActions } from '@apps/formily'
import React from 'react'

type Icontext = {
  formActions: ISchemaFormActions
}

export const context = React.createContext<Icontext | null>(null)

export const FixtureContentProvider = context.Provider
