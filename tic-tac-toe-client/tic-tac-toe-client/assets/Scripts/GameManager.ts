import { Component, Label, Node, _decorator } from 'cc';
import Colyseus from 'db://colyseus-sdk/colyseus.js';

const { ccclass, property } = _decorator;

/** Class to manage game. */
@ccclass('GameManager')
export class GameManager extends Component {

    // Instance of this class.

    public static instance: GameManager;

    // Property Decorators of this class.

    @property(Node)
    private blockInputEvents: Node = new Node;

    @property(Label)
    private buttonLabel: Label[] = [];

    /** Property Decorators of Colyseus. */
    @property hostname = "localhost";
    @property port = 2567;
    @property useSSL = false;

    // Variables of this class.

    private playerID: number = 0;
    public currentPlayer: number = 0;
    private playgroundGrid: Array<number> = [-1, -1, -1, -1, -1, -1, -1, -1, -1];

    /** Variables of Colyseus. */
    private client!: Colyseus.Client;
    private room!: Colyseus.Room;

    // Custom Functions.

    /** Function to connect via Colyseus. */
    private async connect() {
        try {
            this.room = await this.client.joinOrCreate("my_room");
            console.log("Connected to Server");
            console.log("Room: ", this.room.id, "- Session ID:", this.room.sessionId);
            this.room.onStateChange((state) => {
                console.log("Room: ", this.room.id, "- State: ", state);
                this.currentPlayer = state.currentPlayer;
                this.playgroundGrid = state.playgroundGrid;
                this.gameOver(state.gameOver);
                this.checkPlayerTurn();
                this.updatePlaygroundGrid();
            });
            this.room.onMessage("setPlayerID", (message: number) => {
                this.playerID = message;
                if (this.playerID == 0) {
                    this.updateTurns(false);
                }
            });
            this.room.onLeave((code) => {
                console.log("Room: ", this.room.id, "- Leave: ", code);
            });
        }
        catch (error) {
            console.error("Error:", error);
        }
    }

    /** Function to get button input. */
    private buttonInput(event: any, gridID: number) {
        this.changeTurn(gridID);
    }

    /** Function to send changeTurn on server. */
    private changeTurn(gridID: number) {
        this.room.send("changeTurn", gridID);
    }

    private checkPlayerTurn() {
        if (this.playerID == this.currentPlayer) {
            this.updateTurns(false);
        }
        else {
            this.updateTurns(true);
        }
    }

    private updatePlaygroundGrid() {
        for (let i = 0; i < this.playgroundGrid.length; i++) {
            if (this.playgroundGrid[i] != -1) {
                if (this.playgroundGrid[i] == 0) {
                    this.buttonLabel[i].string = "×";
                }
                else if (this.playgroundGrid[i] == 1) {
                    this.buttonLabel[i].string = "○";
                }
            }
        }
    }

    private updateTurns(status: boolean) {
        this.blockInputEvents.active = status;
    }

    private gameOver(status: boolean) {
        console.log("Status is " , status);
        if (status) {
            this.updateTurns(true);
            console.log("Game Over");
        }
    }

    // Default Functions of Cocos Creator.

    onLoad() {
        // Instance of this class.
        GameManager.instance = this;
    }

    start() {
        // Code of Colyseus.
        this.client = new Colyseus.Client(`${this.useSSL ? "wss" : "ws"}://${this.hostname}${([443, 80].includes(this.port) || this.useSSL) ? "" : `:${this.port}`}`);
        this.updateTurns(true);
        this.connect();
    }
}

/** Interface to store playground values. */
export interface Playground {
    GridID: number,
    PlayerID: number
}