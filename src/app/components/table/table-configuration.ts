import { Routing } from "./routing";
import { Label } from "./label";
import { ICache } from "../../services/icache";
import { Signal } from "@angular/core";
import { SelectionBehaviour } from "./selection-behaviour";

export class TableConfiguration<T extends {id? :number}> {
  constructor(
    public data: Signal<T>,
    private cachingService: ICache<T>,
    public labels: Label<T>[],        // header order and naming
    public deleteActivated: boolean,
    public selection: SelectionBehaviour, 
    public routing: Routing           
  ) {}

  getRoutingLink(data: T):string{
    if(!this.routing.activated)
      throw new Error("Routing is not activated");
    if(data.id === undefined)
      return this.routing.getSimpleRoutingLink();
    return this.routing.getRoutingLinkWithID(data.id);
  }

  getCache(): ICache<T>{
    return this.cachingService;
  }
}
