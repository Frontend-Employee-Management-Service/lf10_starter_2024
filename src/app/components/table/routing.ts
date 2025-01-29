export class Routing{
  constructor( 
    public readonly activated: boolean,
    private templateString?: string,  // "{id}" will be replaced with the data id
  ){}

  getSimpleRoutingLink(): string{
    return this.templateString ?? "";
  }

  getRoutingLinkWithID(id: number): string {
    return this.templateString?.replace("{id}", id as unknown as string) ?? this.getSimpleRoutingLink();
  }
}