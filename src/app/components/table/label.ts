export class Label<T> {
  constructor(
    public key: keyof T,
    public name: string
  ) {}
}