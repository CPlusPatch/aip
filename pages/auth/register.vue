<script setup lang="ts">
const showingPassword1 = ref(false);

const user = (await useFetch("/api/user/get")).data.value;

const loading = ref(false);

const token = useCookie("token", {
	sameSite: "strict",
	secure: true,
});

enum Stages {
	CREDENTIALS,
	EMAIL_VERIFICATION,
}
const mode = ref<Stages>(Stages.CREDENTIALS);

if (user && !user.isEmailVerified) {
	mode.value = Stages.EMAIL_VERIFICATION;
}

const email = ref("");
const username = ref("");
const password = ref("");
const code = ref("");

const error = ref<{
	message: string;
	statusCode: number;
} | null>(null);

const signUp = async () => {
	loading.value = true;

	const response = await fetch("/api/auth/register", {
		method: "POST",
		body: JSON.stringify({
			username: username.value,
			password: password.value,
			email: email.value,
		}),
	});

	if (response.ok) {
		mode.value = Stages.EMAIL_VERIFICATION;
		error.value = null;
		token.value = (await response.json()).token;
	} else {
		error.value = await response.json();
	}

	loading.value = false;
};

const verifyEmail = async () => {
	loading.value = true;

	const response = await fetch("/api/auth/verify", {
		method: "POST",
		body: JSON.stringify({
			code: code.value,
		}),
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token.value}`,
		},
	});

	if (response.ok) {
		error.value = null;
		window.location.href = "/";
	} else {
		error.value = await response.json();
	}

	loading.value = false;
};
</script>

<template>
	<div class="flex min-h-full flex-1 dark">
		<div
			class="flex flex-1 flex-col bg-dark-700 justify-center px-6 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
			<div class="mx-auto w-full max-w-sm lg:w-96">
				<Transition
					enter-from-class="translate-x-full"
					enter-to-class="translate-x-0"
					enter-active-class="duration-300"
					leave-active-class="duration-300"
					leave-from-class="translate-x-0"
					leave-to-class="-translate-x-full"
					mode="out-in">
					<div v-if="mode === Stages.CREDENTIALS">
						<div>
							<img
								class="h-10 w-auto"
								src="/images/icons/logo.svg"
								alt="Your Company" />
							<h2
								class="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-50">
								Sign up for a new account
							</h2>
						</div>

						<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
							<form
								class="space-y-6"
								action="#"
								method="POST"
								@submit.prevent="signUp">
								<div>
									<label
										for="email"
										class="block text-sm font-medium leading-6 text-gray-50"
										>Username</label
									>
									<div class="mt-2">
										<InputCMInput
											:value="username"
											icon="ic:round-perm-identity"
											name="username"
											placeholder="johndoe"
											autocomplete="username"
											required
											pattern="^[a-zA-Z0-9_]{3,20}$"
											class="block w-full rounded-md"
											:loading="loading"
											@input="
												username = (
													$event.target as any
												).value
											" />
									</div>
								</div>

								<div>
									<label
										for="email"
										class="block text-sm font-medium leading-6 text-gray-50"
										>E-mail address</label
									>
									<div class="mt-2">
										<InputCMInput
											:value="email"
											icon="tabler:mail"
											name="username"
											placeholder="me@gmail.com"
											autocomplete="email"
											required
											type="email"
											class="block w-full rounded-md"
											:loading="loading"
											@input="
												email = ($event.target as any)
													.value
											" />
									</div>
								</div>

								<div>
									<div
										class="flex items-center justify-between">
										<label
											for="password"
											class="block text-sm font-medium leading-6 text-gray-50"
											>Password</label
										>
										<div class="text-sm">
											<a
												href="#"
												class="font-semibold text-orange-600 hover:text-orange-500"
												@click="
													showingPassword1 =
														!showingPassword1
												"
												>{{
													showingPassword1
														? "Hide"
														: "Show"
												}}</a
											>
										</div>
									</div>
									<div class="mt-2">
										<InputCMInput
											:value="password"
											name="password"
											:type="
												showingPassword1
													? 'text'
													: 'password'
											"
											icon="ic:round-password"
											autocomplete="current-password"
											placeholder="Your password"
											required
											:loading="loading"
											class="block w-full rounded-md"
											@input="
												password = (
													$event.target as any
												).value
											" />
									</div>
								</div>

								<div
									v-if="error"
									class="rounded-md bg-red-200 p-4">
									<div class="flex">
										<div class="flex-shrink-0">
											<Icon
												name="tabler:circle-x-filled"
												class="h-5 w-5 text-red-400"
												aria-hidden="true" />
										</div>
										<div class="ml-3">
											<h3
												class="text-sm font-medium text-red-800">
												An error occured
											</h3>
											<div
												class="mt-2 text-sm text-red-700">
												{{ error.message }}
											</div>
										</div>
									</div>
								</div>

								<div>
									<Button
										:loading="loading"
										type="submit"
										theme="orange"
										class="flex w-full">
										Sign up!
									</Button>
								</div>
							</form>
						</div>
					</div>
					<div v-else-if="mode === Stages.EMAIL_VERIFICATION">
						<div>
							<img
								class="h-10 w-auto"
								src="/images/icons/logo.svg"
								alt="Your Company" />
							<h2
								class="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-50">
								Verify your email
							</h2>
							<h4
								class="mt-2 text-sm leading-9 tracking-tight text-gray-200">
								We've sent you a code by mail at
								<strong class="font-bold">{{
									email || user?.email
								}}</strong
								>. Please enter it below.
							</h4>
						</div>

						<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
							<form
								class="space-y-6"
								action="#"
								method="POST"
								@submit.prevent="verifyEmail">
								<div>
									<label
										for="email"
										class="block text-sm font-medium leading-6 text-gray-50"
										>Security code:</label
									>
									<div class="mt-2">
										<InputCMInput
											icon="ic:round-perm-identity"
											name="code"
											:value="code"
											placeholder="A1B2C3D4"
											autocomplete="username"
											required
											pattern="^[a-zA-Z0-9]{8}$"
											class="block w-full rounded-md"
											:loading="loading"
											@input="
												code = ($event.target as any)
													.value
											" />
									</div>
								</div>

								<div
									v-if="error"
									class="rounded-md bg-red-200 p-4">
									<div class="flex">
										<div class="flex-shrink-0">
											<Icon
												name="tabler:circle-x-filled"
												class="h-5 w-5 text-red-400"
												aria-hidden="true" />
										</div>
										<div class="ml-3">
											<h3
												class="text-sm font-medium text-red-800">
												An error occured
											</h3>
											<div
												class="mt-2 text-sm text-red-700">
												{{ error.message }}
											</div>
										</div>
									</div>
								</div>

								<div>
									<Button
										:loading="loading"
										type="submit"
										theme="orange"
										class="flex w-full">
										Validate
									</Button>
								</div>
							</form>
						</div>
					</div>
				</Transition>
			</div>
		</div>
		<div class="relative hidden w-0 flex-1 lg:block">
			<img
				class="absolute inset-0 h-full w-full object-cover"
				src="/wallpaper.webp"
				alt="" />
		</div>
	</div>
</template>
