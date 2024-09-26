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
	friendsList = new ReplayObservable();
	pfp = new ReplayObservable()
	user = null

	constructor() {
		super();
		this.username.subscribe(value => {
			if (value) {
				this.user.username = value;
			}
		})
		this.defaultLang.subscribe(value => {
			if (value) {
				this.user.defaultLang = value;
			}
		});
		this.friendsList.subscribe(value => {
			if (value) {
				this.user.friendsList = value;
			}
		});
		this.pfp.subscribe(value => {
			if (value) {
				this.user.pfp = value;
			}
		});
	}

	init() {
		this.isReady.next(false);
		this.getUser();
		return this;
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
					pfp: response.pfp,
					readyToPlay: false,
					friendsList: {
						"1": {
							"name": "Alice"
						},
						"2": {
							"name": "Bob"
						},
						"3": {
							"name": "Charlie"
						},
						"4": {
							"name": "Diana"
						},
						"5": {
							"name": "Eve"
						}
					}
				};
				this.username.next(response.username);
				this.defaultLang.next(response.lang);
				this.pfp.next(response.pfp),
				this.friendsList.next(response.friendsList);
				injector[TranslateService].setLang(response.lang);
			}).catch(error => {
				if (error instanceof TokenError) {
					injector[TokenService].deleteCookie();
				}
			}).finally(() => {
				this.isReady.next(true);
			});
		} else {
			this.isReady.next(true);
		}
	}

	patchDefaultLang(newDefaultLang) {
		injector[HttpClient].patch("updateLanguage/", {
			lang: newDefaultLang
		}, true).then(response => {
			if (response.ok) {
				this.defaultLang.next(newDefaultLang);
				injector[PopService].renderPop(true, "pop.defaultLangSuccess");
			} else {
				injector[PopService].renderPop(false, "pop.defaultLangDanger");
			}
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

	patchUsername(newUsername) {
		injector[HttpClient].patch("updateUsername/", {
			username: newUsername
		}, true).then(response => {
			if (response.ok) {
				this.username.next(newUsername);
				injector[PopService].renderPop(true, "pop.usernameSuccess");
			} else {
				injector[PopService].renderPop(false, "pop.usernameDanger");
			}
		}).catch(error => {
			if (error instanceof TokenError) {
				this.logoutManager("/auth", false, "pop.reconnect");
			};
		});
	}

	patchPfp(newPfp) {
		const formData = new FormData();
		formData.append('pfp', newPfp);
		injector[HttpClient].patch("updatePfp/", formData, true, true).then(response => {
			if (response.ok) {
				this.getPfp();
				injector[PopService].renderPop(true, "pop.pfpSuccess");
			} else {
				injector[PopService].renderPop(false, "pop.pfpDanger");
			}
		}).catch(error => {
			if (error instanceof TokenError) {
				this.logoutManager("/auth", false, "pop.reconnect");
			};
		});
	}

	getPfp() {
		injector[HttpClient].get("getPfp/", true).then(response => {
			if (response.ok) {
				this.pfp.next(response.pfp);
			}
		}).catch (error => {
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