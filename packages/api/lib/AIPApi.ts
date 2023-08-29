import { Personality } from "~/db/entities/Personality";
import { Chat } from "~/db/entities/Chat";
import { User } from "~/db/entities/User";
import { Invoice } from "~/db/entities/Invoice";
import { Config } from "~/types/config";
import Stripe from "stripe";

export interface Message {
	role: "user" | "system" | "assistant";
	content: string;
	id: string;
	date: number;
}

export class Client {
	private readonly baseUrl: string;
	private readonly token: string;

	constructor(token: string, baseUrl?: string) {
		this.baseUrl = baseUrl || window.location.origin;
		this.token = token;
	}

	async request<T>(
		method: string,
		path: string,
		body: any,
		headers: any,
		raw = false
	) {
		const response = await fetch(`${this.baseUrl}${path}`, {
			method,
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.token}`,
				...headers,
			},
			body: body ? JSON.stringify(body) : undefined,
		});

		if (raw) {
			return response as T;
		} else {
			return response.json() as Promise<T>;
		}
	}

	get<T>(path: string, body: any, headers: any, raw?: boolean) {
		return this.request<T>("GET", path, body, headers, raw);
	}

	post<T>(path: string, body: any, headers: any, raw?: boolean) {
		return this.request<T>("POST", path, body, headers, raw);
	}

	put<T>(path: string, body: any, headers: any, raw?: boolean) {
		return this.request<T>("PUT", path, body, headers, raw);
	}

	patch<T>(path: string, body: any, headers: any, raw?: boolean) {
		return this.request<T>("PATCH", path, body, headers, raw);
	}

	delete<T>(path: string, body: any, headers: any, raw?: boolean) {
		return this.request<T>("DELETE", path, body, headers, raw);
	}

	getChats() {
		return this.get<Chat[]>("/api/chats", undefined, undefined);
	}

	getChat(id: string) {
		return this.get<Chat>(`/api/chats/${id}`, undefined, undefined);
	}

	createChat(data: { model: string; personalityId?: string }) {
		return this.post<Chat>("/api/chats", data, undefined);
	}

	/**
	 *
	 * @param id
	 * @param data
	 * @returns Stream of messages
	 */
	generateChat(
		id: string,
		data: {
			messages: Message[];
			temperature?: number;
		}
	) {
		return this.post(
			`/api/chats/${id}/generate`,
			data,
			undefined,
			true
		) as Promise<Response>;
	}

	deleteChat(id: string) {
		return this.delete<Chat>(`/api/chats/${id}`, undefined, undefined);
	}

	updateChat(
		id: string,
		data: {
			title?: string;
			model?: string;
			personalityId?: string;
			messages?: Message[];
		}
	) {
		return this.put<Chat>(`/api/chats/${id}`, data, undefined);
	}

	cleanChats() {
		return this.post<Chat[]>("/api/chats/clean", undefined, undefined);
	}

	getPersonalities() {
		return this.get<Personality[]>(
			"/api/personalities",
			undefined,
			undefined
		);
	}

	getPersonality(id: string) {
		return this.get<Personality>(
			`/api/personalities/${id}`,
			undefined,
			undefined
		);
	}

	createPersonality(data: {
		name: string;
		prompt: string;
		description: string;
	}) {
		return this.post<Personality>("/api/personalities", data, undefined);
	}

	updatePersonality(
		id: string,
		data: {
			name?: string;
			prompt?: string;
			description?: string;
			avatar?: string;
		}
	) {
		return this.put<Personality>(
			`/api/personalities/${id}`,
			data,
			undefined
		);
	}

	getUser(id?: string) {
		if (id) {
			return this.get<User>(`/api/users/${id}`, undefined, undefined);
		} else {
			return this.get<User>("/api/user/", undefined, undefined);
		}
	}

	getOidcConfig() {
		return this.get<Config["oidc_providers"]>(
			"/api/config/oidc",
			undefined,
			undefined
		);
	}

	deletePersonality(id: string) {
		return this.delete<Personality>(
			`/api/personalities/${id}`,
			undefined,
			undefined
		);
	}

	getInvoices() {
		return this.get<Invoice[]>(
			"/api/billing/invoices",
			undefined,
			undefined
		);
	}

	getInvoice(id: string) {
		return this.get<Invoice>(
			`/api/billing/invoices/${id}`,
			undefined,
			undefined
		);
	}

	getInvoiceProducts(id: string) {
		return this.get<Stripe.LineItem[]>(
			`/api/billing/invoices/${id}/products`,
			undefined,
			undefined
		);
	}
}
