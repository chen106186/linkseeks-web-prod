import { TestLocalFactory, Type_TestLocalFactory } from './modules/test'

export class LK_Storage {
	TestLocalFactory: Type_TestLocalFactory
	constructor() {
		this.TestLocalFactory = new TestLocalFactory()
	}
}

export default LK_Storage
