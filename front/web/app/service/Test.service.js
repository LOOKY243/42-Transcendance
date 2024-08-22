import { injector } from "../../spa/Bootstrap.js";
import { HttpClient } from "../../spa/service/HttpClient.js";
import { Observable } from "../../spa/utils/Observable.js";

export class TestService {
	getResult = new Observable();

	getValue() {
		injector[HttpClient].get("error").then(response => {
			this.getResult.next(response.value);
		}).catch(error => {
			console.log("erreur get /test", error);
		});
	}

	postValue(value) {
		injector[HttpClient].post("error", {
			value: value
		}).then(response => {
			this.getResult.next(response.value);
		}).catch(error => {
			console.log("erreur post /test", error);
		});
	}
}