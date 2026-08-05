export abstract class IMMESSAGE {
  constructor(public sender: string, public timestamp: number) {}
  abstract render(): any
}
