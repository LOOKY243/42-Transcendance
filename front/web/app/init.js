import { AuthComponent } from "./component/Auth/Auth.component.js";
import { HomeComponent } from "./component/Home/Home.component.js";
import { NotFoundComponent } from "./component/NotFound/NotFound.component.js";
import { TestService } from "./service/Test.service.js";

export function initRouter() {
	return [{
		path: "/",
		selector: "home",
		component: HomeComponent
	}, {
		path: "/auth",
		selector: "auth",
		component: AuthComponent
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
