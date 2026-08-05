import * as React from 'react';
import { ActiveKeyType, TagsPane } from './typings';

export type TagsPaneContextValues = {
  tags: TagsPane[],
};

const Context = React.createContext<TagsPaneContextValues>({
  tags: [],
});

export default Context;