import { initBootstrap } from "../app/init.js";
import { TranslateService } from "./service/Translate.service.js";
import { Router } from "./Router.js";
import { HttpClient } from "./service/HttpClient.js";
import { TokenService } from "./service/Token.service.js";

window.addEventListener("load", () => {
	if (!window.appLaunched) {
		new Bootstrap();
	}
});

export const injector = initBootstrap();

class Bootstrap {
	constructor() {
		window.appLaunched = true;
		injector[TranslateService] = new TranslateService();
		injector[HttpClient] = new HttpClient();
		injector[TokenService] = new TokenService();
		injector[Router] = new Router();
	}
}