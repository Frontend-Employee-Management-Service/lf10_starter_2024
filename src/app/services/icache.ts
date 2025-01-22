import { Signal } from "@angular/core";

export interface ICache<T extends {id?: number}>{
  refresh():void;
  read():Signal<T>;
  insert(dto: T): void;
  update(dto: T): void;
  delete(id: number): void;
  addToSelected(selector: string, dto: T): void;
  removeFromSelected(selector: string, dto: T): void;
  withdrawSelected(selector: string): T[];
}

