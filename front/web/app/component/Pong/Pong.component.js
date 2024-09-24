import { injector } from "../../../spa/Bootstrap.js";
import { AComponent } from "../../../spa/component/AComponent.js"
import { Router } from "../../../spa/Router.js";
import { UserService } from "../../service/User.service.js";
import { Game } from "./Game.js"

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

    static startPong(value) {
        this.game = new Game();
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
            </div>
        `;
    }
}