import { AuthComponent } from "./component/Auth/Auth.component.js";
import { HomeComponent } from "./component/Home/Home.component.js";
import { NotFoundComponent } from "./component/NotFound/NotFound.component.js";
import { PongNewComponent } from "./component/PongNew/PongNew.component.js";
import { ProfileComponent } from "./component/Profile/Profile.component.js";
import { ProfileSettingsComponent } from "./component/ProfileSettings/ProfileSettings.component.js";
import { GameService } from "./service/Game.service.js";
import { PopService } from "./service/Pop.service.js";
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
	}, {
		path: "/profile",
		selector: "profile",
		component: ProfileComponent
	}, {
		path: "/profile/settings",
		selector: "profileSettings",
		component: ProfileSettingsComponent
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
	appInjector[GameService] = new GameService();
	appInjector[PopService] = new PopService();
	return appInjector;
}
