import { Component, Label, _decorator, Node } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

/** Class to change player symbols. */
@ccclass('UIManager')
export class UIManager extends Component {

    // Property Decorators of this class.

    @property(Label)
    private buttonLabel: Label = new Label;

    // Custom Functions.

    /** Function to change player symbols. */
    private setLabel() {
        if (GameManager.instance.currentPlayer == 0) {
            this.buttonLabel.string = "×";
        }
        else if (GameManager.instance.currentPlayer == 1) {
            this.buttonLabel.string = "○";
        }
    }
}