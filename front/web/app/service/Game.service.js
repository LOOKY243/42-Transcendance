import { injector } from "../../spa/Bootstrap.js";
import { HttpClient } from "../../spa/service/HttpClient.js";

export class GameService {
	pongParams(players, points, ballSpeed, theme) {
		injector[HttpClient].post("/newPong", {
			players: players,
			points: points,
			ballSpeed: ballSpeed,
			theme: theme
		});
	}
}