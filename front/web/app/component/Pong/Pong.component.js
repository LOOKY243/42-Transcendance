import { injector } from "../../../spa/Bootstrap.js";
import { AComponent } from "../../../spa/component/AComponent.js"
import { Router } from "../../../spa/Router.js";
import { UserService } from "../../service/User.service.js";
import { GamePong } from "./GamePong.js"

export class PongComponent extends AComponent {
    game = {};

    onInit() {
        // if (!injector[UserService].user) {
        //     injector[Router].navigate("/auth");
		// 	return false;
        // }
        // if (!injector[UserService].user.readyToPlay) {
        //     injector[Router].navigate("/");
		// 	return false;
        // }
        super.onInit();
        this.generateHtml({});

        return true;
    }

    static startPong(inputPoints, ballSpeed, theme) {
        this.game = new GamePong(ballSpeed, 2, inputPoints, theme);
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