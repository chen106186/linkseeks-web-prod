# @apps/design-core

> TODO: description

### 📦 Install

```sh
yarn add @apps/design-react  @apps/design-react-web @apps/design-render
```

OR

```sh
npm install @apps/design-react @apps/design-react-web @apps/design-render
```

## Usage

```jsx
import {createElement} from 'react';
import {BrickDesign,BrickTree,BrickProvider,useSelector,createActions} from '@apps/design-react';
import {BrickPreview} from '@apps/design-core';
import BrickRender from '@apps/design-render';
const plugins=[(vDom,componentSchema)=>vDom];
const customReducer=(state,action)=>{
const {type,payload}=action
switch (type){
case 'customReducer':
return {...state}
default:
return state
}

}
const App = () => {
const {pageConfig}=useSelector(['pageConfig'])

	return(<BrickProvider initState={{}} customReducer={customReducer} config={{...}}>
<div onClick={()=>createActions({type:"customReducer",payload:{...}})}> 出发action</div>

    <BrickPreview/>
    <BrickDesign />
<BrickRender pageConfig={pageConfig} createElement={createElement} plugins={plugins}/>
<BrickTree/>

  </BrickProvider>);
}
```
