import { AuthComponent } from "./component/Auth/Auth.component.js";
import { HomeComponent } from "./component/Home/Home.component.js";
import { NotFoundComponent } from "./component/NotFound/NotFound.component.js";
import { PongNewComponent } from "./component/PongNew/PongNew.component.js";
import { TestService } from "./service/Test.service.js";
import { UserService } from "./service/User.service.js";

export function initRouter() {
	return [{
		path: "/",
		selector: "home",
		component: HomeComponent
	}, {
		path: "/auth",
		selector: "auth",
		component: AuthComponent
	}, {
		path: "/pong/new",
		selector: "pongNew",
		component: PongNewComponent
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
	appInjector[UserService] = new UserService();
	return appInjector;
}
