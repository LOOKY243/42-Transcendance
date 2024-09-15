import { injector } from "../../spa/Bootstrap.js";
import { AInjectable } from "../../spa/service/AInjectable.js";
import { HttpClient } from "../../spa/service/HttpClient.js";

export class GameService extends AInjectable {
	constructor() {
		super();
	}

	pongParams(players, points, ballSpeed, theme) {
		injector[HttpClient].post("/newPong", {
			players: players,
			points: points,
			ballSpeed: ballSpeed,
			theme: theme
		});
	}
}