import { HomeComponent } from "../app/component/Home/home.component.js";

export class Router {
	routes = [{
		path: "/home",
		selector: "home",
		component: HomeComponent,
	}];

	constructor() {
		const route = this.routes.find((value) => {
			return value.path == window.location.pathname;
		})
		if (route == undefined) {
			throw new Error("Page not found") //TODO : load 404
		}
		const component = new route.component("body", route.selector);
		document.querySelector("body").innerHTML = `<div id='${component.getComponentSelector()}'></div>`;
		component.onInit();
		component.render();
	}
}
