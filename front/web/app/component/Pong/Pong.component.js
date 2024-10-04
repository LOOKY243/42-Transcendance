import { AComponent } from "../../../spa/component/AComponent.js"
import { GamePong } from "./GamePong.js"

export class PongComponent extends AComponent {
    game = {};

    onInit() {
        super.onInit();
        this.generateHtml({});

        return true;
    }

    static startPong(inputPoints, ballSpeed, theme, player1, player2) {
        this.game = new GamePong(ballSpeed, inputPoints, theme, player1, player2);
        this.game.Start();
    }

    getCSSPath() {
        return "app/component/Pong/Pong.component.css";
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
                <div id="playerLeft">
                    <button id="upLeft" class="btn btn-outline-primary text-light">Up</button>
                    <button id="downLeft" class="btn btn-outline-primary text-light">Down</button>
                    <button id="iaLeft" class="btn btn-outline-primary text-light">IA</button>
                </div>
                <div id="playerRight">
                    <button id="upRight" class="btn btn-outline-primary text-light">Up</button>
                    <button id="downRight" class="btn btn-outline-primary text-light">Down</button>
                    <button id="iaRight" class="btn btn-outline-primary text-light">IA</button>
                </div>
            </div>
        `;
    }
}