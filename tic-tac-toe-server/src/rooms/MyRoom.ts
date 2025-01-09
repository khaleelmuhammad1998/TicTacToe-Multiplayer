import { Client, Room } from "colyseus";
import { MyRoomState } from "./schema/MyRoomState";

/** Default Class to manage room. */
export class MyRoom extends Room<MyRoomState> {

  // Variables of this class.

  private winnerPlayer: number = 0;

  // Custom Functions.

  /** Function to change turn. */
  private changeTurn(gridID: number) {
    if (this.state.playgroundGrid[gridID] == -1 && !this.state.gameOver) {
      this.state.playgroundGrid[gridID] = this.state.currentPlayer;
      this.checkGame();
      if (this.state.currentPlayer == 0) {
        this.state.currentPlayer = 1;
      }
      else if (this.state.currentPlayer == 1) {
        this.state.currentPlayer = 0;
      }
      console.log("Blah!");
      // this.broadcast("updateCurrentPlayer", this.state.currentPlayer);
      // this.broadcast("updatePlaygroundGrid", this.state.playgroundGrid);
    }
  }

  /** Function to check if a player won the game. */
  private checkGame() {
    // Check rows.
    let horizontalCheck: number = 0;
    for (let index = 0; index <= 2; index++) {
      horizontalCheck = index * 3;
      if (this.state.playgroundGrid[0 + horizontalCheck] == this.state.currentPlayer
        && this.state.playgroundGrid[1 + horizontalCheck] == this.state.currentPlayer
        && this.state.playgroundGrid[2 + horizontalCheck] == this.state.currentPlayer) {
        this.winnerPlayer = this.state.currentPlayer;
        this.state.gameOver = true;
        // this.broadcast("updateGameOver", this.state.gameOver);
        console.log("Room:", this.roomId, "- Winner:", this.winnerPlayer);
      }
    }

    // Check columns.
    for (let index = 0; index <= 2; index++) {
      if (this.state.playgroundGrid[0 + index] == this.state.currentPlayer
        && this.state.playgroundGrid[3 + index] == this.state.currentPlayer
        && this.state.playgroundGrid[6 + index]== this.state.currentPlayer) {
        this.winnerPlayer = this.state.currentPlayer;
        this.state.gameOver = true;
        // this.broadcast("updateGameOver", this.state.gameOver);
        console.log("Room:", this.roomId, "- Winner:", this.winnerPlayer);
      }
    }

    // Check Diagonals.
    if (this.state.playgroundGrid[0] == this.state.currentPlayer
      && this.state.playgroundGrid[4] == this.state.currentPlayer
      && this.state.playgroundGrid[8] == this.state.currentPlayer) {
      this.winnerPlayer = this.state.currentPlayer;
      this.state.gameOver = true;
      // this.broadcast("updateGameOver", this.state.gameOver);
      console.log("Room:", this.roomId, "- Winner:", this.winnerPlayer);
    }
    if (this.state.playgroundGrid[2] == this.state.currentPlayer
      && this.state.playgroundGrid[4] == this.state.currentPlayer
      && this.state.playgroundGrid[6] == this.state.currentPlayer) {
      this.winnerPlayer = this.state.currentPlayer;
      this.state.gameOver = true;
      // this.broadcast("updateGameOver", this.state.gameOver);
      console.log("Room:", this.roomId, "- Winner:", this.winnerPlayer);
    }
  }

  // Default Functions of Colyseus.

  onCreate(options: any) {
    this.setState(new MyRoomState());
    this.onMessage("changeTurn", (client, message: number) => {
      this.changeTurn(message);
    });
    console.log("Room:", this.roomId, "- Create");
  }

  onJoin(client: Client, options: any) {
    this.clients[this.clients.length-1].send("setPlayerID", (this.clients.length-1));
    console.log("Room:", this.roomId, "- Join:", client.sessionId);
  }

  onLeave(client: Client, consented: boolean) {
    console.log("Room:", this.roomId, "- Leave:", client.sessionId);
  }

  onDispose() {
    console.log("Room:", this.roomId, "- Dispose");
  }
}

/** Interface to store playground values. */
export interface Playground {
  GridID: number,
  PlayerID: number
}