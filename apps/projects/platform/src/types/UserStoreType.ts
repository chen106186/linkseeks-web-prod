export interface IUserModule {
  name: string;
  age: number;

  printNameAndAge: string;

  setName(name: string):void;
  getAsyncAge(): Promise<number>;
}