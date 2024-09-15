import { injector } from "../../spa/Bootstrap.js";
import { Router } from "../../spa/Router.js";
import { HttpClient } from "../../spa/service/HttpClient.js";
import { TokenService } from "../../spa/service/Token.service.js";
import { ReplayObservable } from "../../spa/utils/ReplayObservable.js";
import { PopService } from "./Pop.service.js";

export class UserService {
	username = new ReplayObservable();
	history = new ReplayObservable();

	register(username, password, passwordConfirm) {
			injector[HttpClient].put("register/", {
			username: username,
			password: password,
			password_confirm: passwordConfirm
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
			} else {
				injector[PopService].renderPop(false, "pop.loginDanger");
			}
		}).catch(error => {
			console.error("Network error: ", error);
		});
	}

	logout() {
		injector[HttpClient].post("logout/", {}, true).then(response => {
			injector[TokenService].deleteCookie();
			injector[Router].navigate("/");
			injector[PopService].renderPop(true, "pop.logout")
		});
	}

	isAuth() {
		return injector[HttpClient].get("isAuth/", true).then(response => {
			return response ? response.ok : undefined;
		}).catch(error => {
            console.error('Error during authentication check:', error);
            return false;
        });
	}
}