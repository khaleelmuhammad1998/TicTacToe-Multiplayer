import { Schema, type } from "@colyseus/schema";
import { Playground } from "../MyRoom";

export class MyRoomState extends Schema {

  // @type("string") mySynchronizedProperty: string = "Hello world";

  @type("int8") currentPlayer: number = 0;
  @type(["int8"]) playgroundGrid: Array<number> = [-1, -1, -1, -1, -1, -1, -1, -1, -1];
  @type("boolean") gameOver: boolean = false;
}