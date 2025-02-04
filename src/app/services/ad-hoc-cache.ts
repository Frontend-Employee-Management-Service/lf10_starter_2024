import { signal, Signal, WritableSignal } from '@angular/core';
import { DataCache } from './data-cache';


export class AdHocCache<T extends { id?: number | undefined; }> extends DataCache<T> {
  private cache: WritableSignal<T[]> = signal<T[]>([]);

  constructor(data: T[]) {
    super();
    this.cache.set(data);
  }

  public override getSelectedData(): Map<string, T[]> {
    throw new Error('Method not implemented.');
  }

  public override refresh(): void {
    throw new Error('Method not implemented.');
  }

  public override read(): WritableSignal<T[]> {
    return this.cache;
  }

  public override insert(dto: T): void {
    this.cache.update(data => data.concat([dto]))
  }

  public override update(dto: T): void {
    this.cache.update(data => {
      const entryToUpdate: T | undefined = data.find(entry => entry.id == dto.id);
      if(entryToUpdate){
        data = data.filter(entry => entry.id != entryToUpdate.id);
        data.push(dto);
      } else {
        this.insert(dto);
      }
      this.notifyStateChange();
      return data;
    });
  }

  public override delete(id: number): void {
    console.log("adhoc delete")
    this.cache.update(data => {
      this.notifyStateChange();
      return data.filter(entry => entry.id != id);
    });
  }

  public setSignalFromArray(data: T[]) {
    this.cache.set(data);
    this.notifyStateChange();
  }

  public setSignalFromSignal(data: Signal<T[]> | WritableSignal<T[]>) {
    this.cache.set(data());
    this.notifyStateChange();
  }
}
