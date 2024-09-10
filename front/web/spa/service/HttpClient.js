export class HttpClient {
	baseUrl = "http://localhost:8080";
	authHeader = {
		"token": "123456"
	}

	getUrl(url) {
		return this.baseUrl + "/" + url;
	}

	get(url) {
		return fetch(this.getUrl(url, {"headers": this.authHeader})).then(response => {
			if (!response.ok)
				throw new Error(response.status);
			return response.json();
		});
	}

	post(url, data) {
		return fetch(this.getUrl(url), {
			method: "POST",
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

	put(url, data) {
		return fetch(this.getUrl(url), {
			method: "PUT",
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

	delete(url, data) {
		return fetch(this.getUrl(url), {
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
		return fetch(this.getUrl(url), {
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
}