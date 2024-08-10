import { Router } from "./Router.js";

window.addEventListener("load", () => {
	if (!window.appLaunched) {
		new Bootstrap();
	}
});

export const injector = {};

class Bootstrap {
	constructor() {
		window.appLaunched = true;
		injector[Router] = new Router();
	}
}