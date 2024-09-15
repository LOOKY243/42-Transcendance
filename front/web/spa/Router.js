import { initErrorPage, initRouter } from "../app/init.js";
import { TranslateService } from "./service/Translate.service.js";
import { injector } from "./Bootstrap.js";
import { ReplayObservable } from "./utils/ReplayObservable.js";
import { BackgroundComponent } from "../app/component/Background/Background.component.js";
import { AInjectable } from "./service/AInjectable.js";

export class Router extends AInjectable {
	routes = initRouter();
	errorPage = initErrorPage();
	bgVideo = null;
	windowPath = new ReplayObservable();
	loadedPage = null;
	routerSelector = "#router"

	start() {
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
		this.bgVideo = new BackgroundComponent("body", "bgVideo");
		this.bgVideo.onInit();
		this.bgVideo.render();
	}

	loadPage(route) {
		injector[TranslateService].resetObservable();
		this.loadedPage = new route.component(this.routerSelector, route.selector);
		document.querySelector(this.routerSelector).innerHTML = 
		`<div id='${this.loadedPage.getComponentSelector()}'></div>`;
		if(this.loadedPage.onInit()) {
			this.loadedPage.render();
		}
	}

	async navigate(path) {
		if (path === window.location.pathname) {
			return ;
		}

		window.history.pushState({}, "", path);
		this.windowPath.next(path);
	}

}
