export class HttpClient {
	baseUrl = "";

	getUrl(url) {
		return this.baseUrl + "/" + url;
	}

	get(url) {
		return fetch(this.getUrl(url)).then(response => {
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