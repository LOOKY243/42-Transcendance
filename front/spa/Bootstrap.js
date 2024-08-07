import { Router } from "./Router.js";

window.addEventListener("load", () => {
	new Bootstrap();
});

class Bootstrap {
	router = null;

	constructor() {
		this.router = new Router();
	}
}