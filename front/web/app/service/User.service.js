import { injector } from "../../spa/Bootstrap.js";
import { HttpClient } from "../../spa/service/HttpClient.js";

export class UserService {
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
}