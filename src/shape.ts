export type Shape = Rectangle|Circle|Point;
export interface Rectangle{
    kind:"Rectangle";
    name?:string;
    x:number;
    y:number;
    width:number;
    height:number;
    angle:number;
}
export interface Circle{
    kind:"Circle";
    name?:string;
    x:number;
    y:number;
    r:number;
    angle:number;
}

export interface Point{
    kind:"Point";
    name?:string;
    x:number;
    y:number;
    //TODO
    //angle:number;
}
