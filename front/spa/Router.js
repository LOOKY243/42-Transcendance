import { initErrorPage, initRouter } from "../app/init.js";
import { TranslateService } from "./service/Translate.service.js";
import { injector } from "./Bootstrap.js";
import { ReplayObservable } from "./utils/ReplayObservable.js";
import { NavBarComponent } from "../app/component/NavBar/NavBar.component.js";

export class Router {
	routes = initRouter();
	errorPage = initErrorPage();
	navBar = new NavBarComponent("body", "navbar");
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
		`<nav id='${this.navBar.getComponentSelector()}' class="navbar navbar-expand-lg bg-body-tertiary fixed-top"></nav>
		<div class="bg-halftone"></div>
		<div id='${this.loadedPage.getComponentSelector()}'></div>`;
		this.navBar.onInit();
		this.loadedPage.onInit();
		this.navBar.render();
		this.loadedPage.render();
	}

	navigate(path) {
		window.history.pushState({}, "", path);
		this.windowPath.next(path);
	}
}
