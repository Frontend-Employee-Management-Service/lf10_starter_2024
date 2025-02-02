export class Routing{
  constructor( 
    public readonly activated: boolean,
    public templateString?: string,  // "{id}" will be replaced with the data id
  ){}
}