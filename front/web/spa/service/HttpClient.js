import { injector } from "../Bootstrap.js";
import { AInjectable } from "./AInjectable.js";
import { TokenService } from "./Token.service.js";

export class HttpClient extends AInjectable {
	baseUrl = "http://localhost:8000/api";

	constructor() {
		super();
	}

	getUrl(url) {
		return this.baseUrl + "/" + url;
	}

	get(url, token = false) {
		return this.fetchAndParseStream(this.getUrl(url), {}, token);
	}

	post(url, data) {
		return this.fetchAndParseStream(this.getUrl(url), {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data) 
		});
	}

	put(url, data) {
		return this.fetchAndParseStream(this.getUrl(url), {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data) 
		});
	}

	delete(url, data) {
		return this.fetchAndParseStream(this.getUrl(url), {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data) 
		}).then(response => {
			if (!response.ok)
				throw new Error(response.status)
			return response.json();
		})
	}

	patch(url, data) {
		return this.fetchAndParseStream(this.getUrl(url), {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data) 
		}).then(response => {
			if (!response.ok)
				throw new Error(response.status)
			return response.json();
		})
	}

	async fetchAndParseStream(url, options = {}, token = false) {
			if (!token) {
				const response = await fetch(url, options);
				return this.responseDecoder(response)
			} else {
				let accessToken = injector[TokenService].getCookie('accessToken');
				if (accessToken) {
					options.headers = {
						...options.headers,
						'Authorization': `Bearer ${accessToken}`
					};
				}
				options.credentials = 'include';

				let response = await fetch(url, options);
				response = await this.responseDecoder(response);

				if (response.token_refresh_required) {
					return await this.responseDecoder(injector[TokenService].refreshToken(url, options));
				} else {
					return response;
				}
			}
	}

	async responseDecoder(response) {
		const reader = response.body?.getReader();
		if (!reader) {
			throw new Error('Erreur: La réponse ne contient pas de corps lisible.');
		}

		const decoder = new TextDecoder();
		let data = '';
		let done = false;

		while (!done) {
		const { value, done: doneReading } = await reader.read();
		done = doneReading;
		data += decoder.decode(value, { stream: true });
		}

		return JSON.parse(data);
	}
	
}