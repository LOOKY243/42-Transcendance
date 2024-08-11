import { HomeComponent } from "./component/Home/Home.component.js";
import { NotFoundComponent } from "./component/NotFound/NotFound.component.js";
import { TestService } from "./service/Test.service.js";

export function initRouter() {
	return [{
		path: "/home",
		selector: "home",
		component: HomeComponent,
	}];
}

export function initErrorPage() {
	return {
		selector: "notFound",
		component: NotFoundComponent,
	};
}

export function initBootstrap() {
	let appInjector = {};
	appInjector[TestService] = new TestService();
	return appInjector;
}
