import { injector } from "../Bootstrap.js";
import { HttpClient } from "./HttpClient.js";

export class TokenService {
	getCookie(name) {
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${name}=`);
		if (parts.length === 2) return parts.pop().split(';').shift();
	}

	setCookie(name, value, days) {
		let expires = "";
		if (days) {
			const date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			expires = "; expires=" + date.toUTCString();
		}
		document.cookie = name + "=" + (value || "") + expires + "; path=/";
	}

	deleteCookie() {
		document.cookie = 'accessToken' + '=; Max-Age=0; path=/; SameSite=Lax;';
		document.cookie = 'refreshToken' + '=; Max-Age=0; path=/; SameSite=Lax;';
	}

	async getRefreshedToken() {
		try {
			const refreshToken = getCookie('refreshToken');
		
			if (!refreshToken) {
				throw new Error(`Erreur Token: no refresh token`);
			}
			const response = injector[HttpClient].fetchAndParseStream('token/refresh/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ refresh: refreshToken }),
				credentials: 'include',
			});

			if (!response.ok) {
				throw new Error(`Erreur Token: failed to refresh token`);
			}
			if (response.access) {
				setCookie('accessToken', data.access, 1);
				return response.access;
			} else {
				throw new Error(`Erreur Token: no refresh token in response`);
			}
		} catch(error) {
			console.error(error);
		}
	}

	async refreshToken(url, options) {
		let accessToken = await getRefreshedToken();
		if (accessToken) {
			options.headers['Authorization'] = `Bearer ${accessToken}`;
			response = await fetch(url, options);
			if (!response.ok) {
				throw new Error(`Erreur HTTP: fetch error`);
			}
			return response;
		} else {
			throw new Error(`Erreur JWT: can't refresh token`);
		}
	}

}