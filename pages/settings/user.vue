<script setup lang="ts">
import { UserManager } from "oidc-client-ts";
import { arrayBufferToWebP } from "webp-converter-browser";
import { User } from "~/db/entities/User";
import { Config } from "types/config";

const user = (await useFetch(`/api/user/get`)).data.value as User;

definePageMeta({
	layout: "account",
});

const loading = ref(false);
const token = useCookie("token");
const isUploading = ref(false);
const avatarUrl = ref(user?.avatar ?? null);

const saveUserData = () => {
	loading.value = true;
	fetch(`/api/account/${user?.id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token.value}`,
		},
		body: JSON.stringify({
			display_name: (
				document.querySelector(
					"input[name=display-name]"
				) as HTMLInputElement
			).value,
			avatar: avatarUrl.value,
		}),
	})
		.then(data => {
			switch (data.status) {
				case 201:
				case 200: {
					loading.value = false;
					break;
				}
			}
		})
		.catch(err => {
			loading.value = false;
			console.error(err);
		});
};

const uploadFile = async (e: Event) => {
	const target = e.target as HTMLInputElement;

	if (!target.files?.length) return false;

	isUploading.value = true;

	// Dont convert WebP and SVG files to WebP automatically
	const file: File =
		target.files[0].type.includes("webp") ||
		target.files[0].type.includes("svg")
			? target.files[0]
			: new File(
					[
						await arrayBufferToWebP(
							await target.files[0].arrayBuffer()
						),
					],
					target.files[0].name.split(".").slice(0, -1).join(".") +
						".webp"
			  );

	const formData = new FormData();
	formData.append("file", file);

	fetch("/api/media/upload", {
		method: "POST",
		body: formData,
		headers: {
			Authorization: `Bearer ${token.value}`,
		},
	})
		.then(async res => {
			if (res.ok) {
				avatarUrl.value = await res.text();
				saveUserData();
			}
		})
		.finally(() => {
			isUploading.value = false;
		});
};

const clickFileInput = () => {
	(
		document.querySelector(`input[name=avatar-input]`) as HTMLInputElement
	).click();
};

const oidc = (await useFetch("/api/config/oidc")).data;

const linkOIDC = async (oidcProvider: Config["oidc_providers"][0]) => {
	const userManager = new UserManager({
		authority: oidcProvider.authority,
		client_id: oidcProvider.client_id,
		redirect_uri: `${useRequestURL().origin}/auth/callback/${
			oidcProvider.id
		}/`,
		scope: oidcProvider.scopes.join(" "),
	});

	const user = await userManager.signinPopup();

	await useFetch("/api/auth/link-openid", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token.value}`,
		},
		body: JSON.stringify({
			body: user,
			provider: oidcProvider.id,
		}),
	});

	window.location.reload();
};
</script>

<template>
	<main class="bg-dark-400 grow h-screen overflow-y-scroll no-scrollbar">
		<!-- Settings forms -->
		<div
			class="divide-y divide-white/5 flex flex-col items-center children:w-full">
			<div
				class="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
				<div>
					<h2 class="text-base font-semibold leading-7 text-white">
						Personal Information
					</h2>
					<p class="mt-1 text-sm leading-6 text-gray-400">
						Use a permanent address where you can receive mail.
					</p>
				</div>

				<form class="md:col-span-2" @submit.prevent="saveUserData">
					<div
						class="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
						<div class="col-span-full flex items-center gap-x-8">
							<div
								class="mt-2 ring-1 ring-dark-300 flex items-center justify-center gap-x-3 relative h-24 w-24 flex-none rounded-lg bg-gray-800 overflow-hidden group">
								<input
									accept="image/*"
									type="file"
									name="avatar-input"
									class="hidden"
									@change="uploadFile($event)" />
								<div
									class="absolute inset-0 bg-dark-100 bg-opacity-50 backdrop-blur-sm text-gray-800 group-hover:opacity-100 opacity-0 flex duration-200 items-center justify-center"
									@click="!isUploading && clickFileInput()">
									<Icon
										name="ic:round-upload"
										class="w-8 h-8" />
								</div>
								<div
									v-if="isUploading"
									class="absolute inset-0 bg-dark-100 text-gray-800 flex duration-200 items-center justify-center">
									<Spinner theme="gray" class="w-6 h-6" />
								</div>
								<img
									v-if="avatarUrl"
									:src="avatarUrl"
									class="h-full w-full object-cover"
									aria-hidden="true" />
								<Icon
									v-else
									name="ic:round-hide-image"
									class="text-gray-400 w-6 h-6" />
							</div>
						</div>

						<div class="sm:col-span-full">
							<label
								for="first-name"
								class="block text-sm font-medium leading-6 text-white"
								>Display Name</label
							>
							<div class="mt-2">
								<InputCMInput
									type="text"
									icon="tabler:tag"
									:value="user.display_name"
									:loading="loading"
									name="display-name"
									autocomplete="given-name"
									@change="
										user.display_name = (
											$event as any
										).target.value
									" />
							</div>
						</div>
					</div>

					<div class="mt-8 flex">
						<Button theme="orange" type="submit" :loading="loading">
							Save
						</Button>
					</div>
				</form>
			</div>

			<div
				class="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
				<div>
					<h2 class="text-base font-semibold leading-7 text-white">
						Change password
					</h2>
					<p class="mt-1 text-sm leading-6 text-gray-400">
						Update the password associated with your account.
					</p>
				</div>

				<form class="md:col-span-2">
					<div
						class="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
						<div class="col-span-full">
							<label
								for="current-password"
								class="block text-sm font-medium leading-6 text-white"
								>Current password</label
							>
							<div class="mt-2">
								<InputCMInput
									id="current-password"
									icon="tabler:password"
									name="current_password"
									type="password"
									autocomplete="current-password" />
							</div>
						</div>

						<div class="col-span-full">
							<label
								for="new-password"
								class="block text-sm font-medium leading-6 text-white"
								>New password</label
							>
							<div class="mt-2">
								<InputCMInput
									id="new-password"
									icon="tabler:password"
									name="new_password"
									type="password"
									autocomplete="new-password" />
							</div>
						</div>

						<div class="col-span-full">
							<label
								for="confirm-password"
								class="block text-sm font-medium leading-6 text-white"
								>Confirm password</label
							>
							<div class="mt-2">
								<InputCMInput
									id="confirm-password"
									icon="tabler:password"
									name="confirm_password"
									type="password"
									autocomplete="new-password" />
							</div>
						</div>
					</div>

					<div class="mt-8 flex">
						<Button type="submit" theme="orange" disabled>
							Save
						</Button>
					</div>
				</form>
			</div>

			<div
				class="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
				<div>
					<h2 class="text-base font-semibold leading-7 text-white">
						OpenID Integration
					</h2>
					<p class="mt-1 text-sm leading-6 text-gray-400">
						Configure OpenID integration with your account.
					</p>
				</div>

				<div class="md:col-span-2">
					<Button
						v-for="provider of oidc"
						:key="provider.id"
						theme="gray"
						:disabled="
							(user?.oauthAccounts ?? []).filter(
								a => a.provider === provider.id
							).length > 0
						"
						class="w-60 !pt-2 disabled:opacity-50 justify-between"
						@click="linkOIDC(provider)">
						<span
							><img
								:src="provider.icon"
								class="mr-2 w-4 h-4 inline mb-1" />
							{{
								(user?.oauthAccounts ?? []).filter(
									a => a.provider === provider.id
								).length > 0
									? "Linked!"
									: provider.name
							}}</span
						>
						<Icon name="ic:round-plus" />
					</Button>
				</div>
			</div>

			<div
				class="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
				<div>
					<h2 class="text-base font-semibold leading-7 text-white">
						Log out other sessions
					</h2>
					<p class="mt-1 text-sm leading-6 text-gray-400">
						Please enter your password to confirm you would like to
						log out of your other sessions across all of your
						devices.
					</p>
				</div>

				<form class="md:col-span-2">
					<div
						class="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
						<div class="col-span-full">
							<label
								for="logout-password"
								class="block text-sm font-medium leading-6 text-white"
								>Your password</label
							>
							<div class="mt-2">
								<InputCMInput
									id="logout-password"
									icon="tabler:password"
									name="password"
									type="password"
									autocomplete="current-password" />
							</div>
						</div>
					</div>

					<div class="mt-8 flex">
						<Button theme="orange" type="submit" disabled>
							Log out other sessions
						</Button>
					</div>
				</form>
			</div>

			<div
				class="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
				<div>
					<h2 class="text-base font-semibold leading-7 text-white">
						Delete account
					</h2>
					<p class="mt-1 text-sm leading-6 text-gray-400">
						No longer want to use our service? You can delete your
						account here. This action is not reversible. All
						information related to this account will be deleted
						permanently.
					</p>
				</div>

				<form class="flex items-start md:col-span-2">
					<Button theme="orange" type="submit" disabled>
						Yes, delete my account
					</Button>
				</form>
			</div>
		</div>
	</main>
</template>
