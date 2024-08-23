import { initErrorPage, initRouter } from "../app/init.js";
import { TranslateService } from "./service/Translate.service.js";
import { injector } from "./Bootstrap.js";
import { ReplayObservable } from "./utils/ReplayObservable.js";

export class Router {
	routes = initRouter();
	errorPage = initErrorPage();
	windowPath = new ReplayObservable();
	loadedPage = null;

	constructor() {
		this.windowPath.next(window.location.pathname);
		this.windowPath.subscribe((path) => {
				const route = this.routes.find((value) => {
					return value.path == path;
				});
				if (route == undefined) {
					this.loadPage(this.errorPage);
				} else
					this.loadPage(route);
			});
		window.addEventListener("popstate", (event) => {
			this.windowPath.next(window.location.pathname);
		});
	}

	loadPage(route) {
		injector[TranslateService].resetObservable();
		this.loadedPage = new route.component("body", route.selector);
		document.querySelector("body").innerHTML = 
		`<div id='${this.loadedPage.getComponentSelector()}'></div>`;
		this.loadedPage.onInit();
		this.loadedPage.render();
	}

	navigate(path) {
		window.history.pushState({}, "", path);
		this.windowPath.next(path);
	}
}
