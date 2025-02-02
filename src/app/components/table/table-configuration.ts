import { Routing } from "./routing";
import { Label } from "./label";
import { SelectionBehaviour } from "./selection-behaviour";
import { DataCache } from "../../services/data-cache";

export class TableConfiguration<T extends {id? :number}> {
  constructor(
    private cachingService: DataCache<T>,
    public labels: Label<T>[],        // defines order of column headers and maps the model properties to them
    public deleteActivated: boolean,
    public selection: SelectionBehaviour, 
    public routing: Routing           
  ) {}

  getCache(): DataCache<T>{
    return this.cachingService;
  }
}
