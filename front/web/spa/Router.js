import { HomeComponent } from "../app/component/Home/Home.component.js";
import { NotFoundComponent } from "../app/component/NotFound/NotFound.component.js";
import { ReplayObservable } from "./utils/ReplayObservable.js";

export class Router {
	routes = [{
		path: "/home",
		selector: "home",
		component: HomeComponent,
	}];
	errorPage = {
		selector: "notFound",
		component: NotFoundComponent,
	};
	windowPath = new ReplayObservable();

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
		const component = new route.component("body", route.selector);
		document.querySelector("body").innerHTML = `<div id='${component.getComponentSelector()}'></div>`;
		component.onInit();
		component.render();
	}

	navigate(path) {
		window.history.pushState({}, "", path);
		this.windowPath.next(path);
	}
}
