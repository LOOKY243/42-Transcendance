import { injector } from "../../spa/Bootstrap.js";
import { Router } from "../../spa/Router.js";
import { AInjectable } from "../../spa/service/AInjectable.js";
import { HttpClient } from "../../spa/service/HttpClient.js";
import { TokenService } from "../../spa/service/Token.service.js";
import { ReplayObservable } from "../../spa/utils/ReplayObservable.js";
import { TokenError} from "../../spa/error/TokenError.js"
import { PopService } from "./Pop.service.js";
import { TranslateService } from "../../spa/service/Translate.service.js";

export class UserService extends AInjectable {
	username = new ReplayObservable();
	defaultLang = new ReplayObservable();
	user = {
		username: undefined,
		defaultLang: "en"
	}

	constructor() {
		super();
		this.username.subscribe(value => {
			if (value) {
				this.user.username = value;
			}
		})
		this.defaultLang.subscribe(value => {
			if (value) {
				this.user.defaultLang = value
				injector[TranslateService].setLang(value);
			}
		});

		this.getUser();
	}

	init() {
		this.isReady.next(false);
		return this
	}

	register(username, password, passwordConfirm) {
			injector[HttpClient].put("register/", {
			username: username,
			password: password,
			password_confirm: passwordConfirm,
			lang: injector[TranslateService].current
		}).then(response => {
			if (response.ok) {
				this.login(username, password);
			} else if (response.error === "usernameError") {
				injector[PopService].renderPop(false, "pop.registerUsernameDanger");
			} else {
				injector[PopService].renderPop(false, "pop.registerDanger");
			}
		}).catch(error => {
			console.error("Network error: ", error);
		});
	}

	login(username, password) {
		injector[HttpClient].post("login/", {
			username: username,
			password: password
		}).then(response => {
			if (response.ok) {
				injector[TokenService].setCookie('accessToken', response.access, 1);
        		injector[TokenService].setCookie('refreshToken', response.refresh, 7);
				injector[Router].navigate("/");
				injector[PopService].renderPop(true, "pop.loginSuccess");
				this.getUser();
			} else {
				injector[PopService].renderPop(false, "pop.loginDanger");
			}
		}).catch(error => {
			console.error("Network error: ", error);
		});
	}

	logout() {
		injector[HttpClient].post("logout/", {}, true).then(response => {
			this.username.next(null);
			injector[TokenService].deleteCookie();
			injector[Router].navigate("/");
			injector[PopService].renderPop(true, "pop.logout");
		});
	}

	getUser() {
		if (injector[TokenService].getCookie('accessToken') || injector[TokenService].getCookie('refreshToken')) {
			injector[HttpClient].get("getUser/", {}, true).then(response => {
				this.defaultLang.next(response.lang);
				this.username.next(response.username);
				this.isReady.next(true);
			}).catch(error => {
				if (error instanceof TokenError) {
					injector[TokenService].deleteCookie();
				}
			});
		}
	}

	patchDefaultLang(newDefaultLang) {
		injector[HttpClient].patch("updateLanguage/", {
			lang: newDefaultLang
		}, true).then(response => {
			this.defaultLang.next(newDefaultLang);
		}).catch(error => {
			if (error instanceof TokenError) {
				this.username.next(null);
				injector[TokenError].deleteCookie();
				injector[Router].navigate("/auth");
				injector[PopService].renderPop(false, "pop.reconnect");
			}
		})
	}

}