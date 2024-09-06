import { injector } from "../../spa/Bootstrap.js";
import { HttpClient } from "../../spa/service/HttpClient.js";
import { ReplayObservable } from "../../spa/utils/ReplayObservable.js";

export class UserService {
	username = new ReplayObservable();

	register(username, password) {
		injector[HttpClient].put("/register", {
			username: username,
			password: password
		});
	}
	login(username, password) {
		injector[HttpClient].post("/login", {
			username: username,
			password: password
		});
	}
	getCurrentUser() {
		injector[HttpClient].get("/getCurrentUser").then(response => {
			this.username.next(response.username);
		}).catch(error => {
			this.username.next(null);
		});
	}
}