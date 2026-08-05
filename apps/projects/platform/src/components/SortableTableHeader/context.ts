import React from 'react';
import { SortableContextProps } from './interface';

const SortableContext = React.createContext<SortableContextProps | null>(null);

export const SortableContextProvider = SortableContext.Provider;

export default SortableContext;