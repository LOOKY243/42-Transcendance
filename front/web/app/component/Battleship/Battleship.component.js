import { AComponent } from "../../../spa/component/AComponent.js";
import { GameBattleship } from "./GameBattleship.js";

export class BattleshipComponent extends AComponent {
    game = {}

    onInit(){
        super.onInit();
        this.generateHtml({});
        
        return true;
    }

    static startBattleship() {
        this.game = new GameBattleship("First", "Second", "Blue", "Red", 6, 2);
        this.game.Start();
    }
    
    getCSSPath() {
        return "app/component/Battleship/Battleship.component.css";
    }

    generateHtml(config) {
        this.html = `
            <div id="root-window">
                <div id="render-target"></div>
                <div id="render-score">
                    <li id="score-list">
                    </li>
                </div>
                <div id="render-text invisible"></div>
                <button id="rotateButton" class="btn btn-outline-primary text-light">Rotate</button>
            </div>
        `;
    }
}