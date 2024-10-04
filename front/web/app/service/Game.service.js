import { injector } from "../../spa/Bootstrap.js";
import { TokenError } from "../../spa/error/TokenError.js";
import { Router } from "../../spa/Router.js";
import { AInjectable } from "../../spa/service/AInjectable.js";
import { HttpClient } from "../../spa/service/HttpClient.js";
import { TokenService } from "../../spa/service/Token.service.js";
import { PongComponent } from "../component/Pong/Pong.component.js";
import { PopService } from "./Pop.service.js";

export class GameService extends AInjectable {
	constructor() {
		super();
	}

	startNewPong(points, ballSpeed, theme, player1, player2) {
		injector[HttpClient].post("startNewPong/", {
			points: points,
			ballSpeed: ballSpeed,
			theme: theme,
			playerOne: player1,
			playerTwo: player2
		}, true).then(response => {
			if (response.ok) {
				injector[Router].navigate('/pong');
				PongComponent.startPong(response.points, response.theme, response.ballSpeed, response.playerOne, response.playerTwo);
			} else {
				injector[PopService].renderPop(false, "pop.startPongDanger");
			}
		}).catch(error => {
			if (error instanceof TokenError) {
				injector[TokenService].deleteCookie();
			}
		});
	}
}