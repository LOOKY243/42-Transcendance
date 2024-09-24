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
	user = null

	constructor() {
		super();
		this.getUser();
		this.username.subscribe(value => {
			if (value) {
				this.user.username = value;
			}
		})
		this.defaultLang.subscribe(value => {
			if (value) {
				this.user.defaultLang = value
			}
		});
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
			this.logoutManager("/", true, "pop.logout");
		});
	}

	getUser() {
		if (injector[TokenService].getCookie('accessToken') || injector[TokenService].getCookie('refreshToken')) {
			injector[HttpClient].get("getUser/", {}, true).then(response => {
				this.user = {
					username: response.username,
					defaultLang: response.lang,
				};
				this.username.next(response.username);
				this.defaultLang.next(response.lang);
				injector[TranslateService].setLang(response.lang);
				this.isReady.next(true);
			}).catch(error => {
				console.log(error)
				if (error instanceof TokenError) {
					injector[TokenService].deleteCookie();
				}
			});
		} else {
			this.isReady.next(true);
			console.log("getUser")
		}
	}

	patchDefaultLang(newDefaultLang) {
		injector[HttpClient].patch("updateLanguage/", {
			lang: newDefaultLang
		}, true).then(response => {
			this.defaultLang.next(newDefaultLang);
			injector[PopService].renderPop(true, "pop.defaultLangSuccess");
		}).catch(error => {
			if (error instanceof TokenError) {
				this.logoutManager("/auth", false, "pop.reconnect");
			}
		})
	}

	patchPassword(currentPassword, newPassword, newPasswordConfirm) {
		injector[HttpClient].patch("updatePassword/", {
			currentPassword: currentPassword,
			newPassword: newPassword,
			newPasswordConfirm: newPasswordConfirm
		}, true).then(response => {
			if (response.ok) {
				injector[PopService].renderPop(true, "pop.passwordSuccess");
			} else {
				injector[PopService].renderPop(false, "pop.passwordDanger");
			}
		}).catch(error => {
			if (error instanceof TokenError) {
				this.logoutManager("/auth", false, "pop.reconnect");
			};
		});
	}

	logoutManager(path, popStatus, popMessage) {
		this.user = null;
		injector[TokenService].deleteCookie();
		injector[Router].navigate(path);
		injector[PopService].renderPop(popStatus, popMessage);
		this.username.next(undefined);
	}

}