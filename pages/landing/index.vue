<script setup lang="ts">
const navigation = [
	{ name: "Product", href: "#" },
	{ name: "Features", href: "#" },
	{ name: "Marketplace", href: "#" },
	{ name: "Company", href: "#" },
];

const tiers = [
	{
		name: "Freelancer",
		id: "tier-freelancer",
		href: "#",
		priceMonthly: "$24",
		description: "The essentials to provide your best work for clients.",
		features: [
			"5 products",
			"Up to 1,000 subscribers",
			"Basic analytics",
			"48-hour support response time",
		],
		mostPopular: false,
	},
	{
		name: "Startup",
		id: "tier-startup",
		href: "#",
		priceMonthly: "$32",
		description: "A plan that scales with your rapidly growing business.",
		features: [
			"25 products",
			"Up to 10,000 subscribers",
			"Advanced analytics",
			"24-hour support response time",
			"Marketing automations",
		],
		mostPopular: true,
	},
	{
		name: "Enterprise",
		id: "tier-enterprise",
		href: "#",
		priceMonthly: "$48",
		description: "Dedicated support and infrastructure for your company.",
		features: [
			"Unlimited products",
			"Unlimited subscribers",
			"Advanced analytics",
			"1-hour, dedicated support response time",
			"Marketing automations",
		],
		mostPopular: false,
	},
];
const faqs = [
	{
		id: 1,
		question: "What's the best thing about Switzerland?",
		answer: "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
	},
	// More questions...
];
const footerNavigation = {
	solutions: [
		{ name: "Hosting", href: "#" },
		{ name: "Data Services", href: "#" },
		{ name: "Uptime Monitoring", href: "#" },
		{ name: "Enterprise Services", href: "#" },
	],
	support: [
		{ name: "Pricing", href: "#" },
		{ name: "Documentation", href: "#" },
		{ name: "Guides", href: "#" },
		{ name: "API Reference", href: "#" },
	],
	company: [
		{ name: "About", href: "#" },
		{ name: "Blog", href: "#" },
		{ name: "Jobs", href: "#" },
		{ name: "Press", href: "#" },
		{ name: "Partners", href: "#" },
	],
	legal: [
		{ name: "Claim", href: "#" },
		{ name: "Privacy", href: "#" },
		{ name: "Terms", href: "#" },
	],
};

const features = [
	{
		name: "Unfiltered outputs",
		description:
			'No more "As an AI model...", our technology lets you create without being hindered by arbitrary rules imposed by other vendors',
		icon: "tabler:list-check",
	},
	{
		name: "Cloud storage for your chats",
		description:
			"All of your chats are stored in the cloud across your devices, for an easy uninterrupted experience",
		icon: "tabler:devices-check",
	},
	{
		name: "Coding, chat and RP models",
		description:
			"We include programming, chat and roleplay models for your uses cases",
		icon: "tabler:message-check",
	},
];

const mobileMenuOpen = ref(false);

definePageMeta({
	layout: "landing",
});

useHead({
	title: "AIP - Artificial Intelligence, working for you",
});
</script>

<template>
	<div class="bg-black dark:bg-black dark w-full overflow-x-hidden">
		<!-- Header -->
		<header class="absolute inset-x-0 top-0 z-50">
			<div
				class="flex items-center justify-between gap-x-6 bg-dark-900 px-6 py-2.5 sm:pr-3.5 lg:pl-8">
				<div class="text-sm leading-6 text-white">
					<a href="#">
						<strong class="font-semibold">Early Access</strong
						><svg
							viewBox="0 0 2 2"
							class="mx-2 inline h-0.5 w-0.5 fill-current"
							aria-hidden="true">
							<circle cx="1" cy="1" r="1" />
						</svg>
						AIP is now available to a select group of users for
						Early Access&nbsp;
						<span aria-hidden="true">&rarr;</span>
					</a>
				</div>
				<button
					type="button"
					class="-m-3 flex-none p-3 focus-visible:outline-offset-[-4px]">
					<span class="sr-only">Dismiss</span>
					<XMarkIcon class="h-5 w-5 text-white" aria-hidden="true" />
				</button>
			</div>
			<nav
				class="flex items-center justify-between p-6 lg:px-8"
				aria-label="Global">
				<div class="flex lg:flex-1">
					<a href="#" class="-m-1.5 p-1.5">
						<span class="sr-only">Your Company</span>
						<img
							class="h-8 w-auto"
							src="/images/icons/logo.svg"
							alt="" />
					</a>
				</div>
				<div class="flex lg:hidden">
					<button
						type="button"
						class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-200"
						@click="mobileMenuOpen = true">
						<span class="sr-only">Open main menu</span>
						<Bars3Icon class="h-6 w-6" aria-hidden="true" />
					</button>
				</div>
				<div class="hidden lg:flex lg:gap-x-12">
					<a
						v-for="item in navigation"
						:key="item.name"
						:href="item.href"
						class="text-sm font-semibold leading-6 text-gray-100"
						>{{ item.name }}</a
					>
				</div>
				<div class="hidden lg:flex lg:flex-1 lg:justify-end">
					<a
						href="#"
						class="text-sm font-semibold leading-6 text-gray-50"
						>Log in <span aria-hidden="true">&rarr;</span></a
					>
				</div>
			</nav>
			<Dialog
				as="div"
				class="lg:hidden"
				:open="mobileMenuOpen"
				@close="mobileMenuOpen = false">
				<div class="fixed inset-0 z-50" />
				<DialogPanel
					class="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
					<div class="flex items-center justify-between">
						<a href="#" class="-m-1.5 p-1.5">
							<span class="sr-only">Your Company</span>
							<img
								class="h-8 w-auto"
								src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
								alt="" />
						</a>
						<button
							type="button"
							class="-m-2.5 rounded-md p-2.5 text-gray-700"
							@click="mobileMenuOpen = false">
							<span class="sr-only">Close menu</span>
							<XMarkIcon class="h-6 w-6" aria-hidden="true" />
						</button>
					</div>
					<div class="mt-6 flow-root">
						<div class="-my-6 divide-y divide-gray-500/10">
							<div class="space-y-2 py-6">
								<a
									v-for="item in navigation"
									:key="item.name"
									:href="item.href"
									class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
									>{{ item.name }}</a
								>
							</div>
							<div class="py-6">
								<a
									href="#"
									class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
									>Log in</a
								>
							</div>
						</div>
					</div>
				</DialogPanel>
			</Dialog>
		</header>

		<main class="isolate">
			<!-- Hero section -->
			<div class="relative pt-14">
				<div
					class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
					aria-hidden="true">
					<div
						class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-orange-500 to-red-200 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
						style="
							clip-path: polygon(
								74.1% 44.1%,
								100% 61.6%,
								97.5% 26.9%,
								85.5% 0.1%,
								80.7% 2%,
								72.5% 32.5%,
								60.2% 62.4%,
								52.4% 68.1%,
								47.5% 58.3%,
								45.2% 34.5%,
								27.5% 76.7%,
								0.1% 64.9%,
								17.9% 100%,
								27.6% 76.8%,
								76.1% 97.7%,
								74.1% 44.1%
							);
						" />
				</div>
				<div class="py-24 sm:py-32">
					<div class="mx-auto max-w-7xl px-6 lg:px-8">
						<div class="mx-auto max-w-3xl text-center">
							<h1
								class="text-4xl font-bold tracking-tight text-orange-100 sm:text-6xl">
								Artificial Intelligence, working for you
							</h1>
							<p class="mt-6 text-lg leading-8 text-gray-300">
								AIP provides a truly open AI platform that lets
								you write stories, engage in fascinating
								discussion, and even create your own
								personalized chatbot
							</p>
							<div
								class="mt-10 flex items-center justify-center gap-x-6 gap-y-4 md:flex-row flex-col">
								<Button
									theme="orange"
									class="px-3.5 py-2.5 relative"
									>Get started</Button
								>
								<a
									href="#"
									class="text-sm font-semibold leading-6 text-orange-100"
									>Learn more about our technology
									<span aria-hidden="true">→</span></a
								>
							</div>
						</div>
						<div class="mt-16 flow-root sm:mt-24">
							<div
								class="-m-2 rounded-xl relative bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
								<img
									src="/images/screenshots/screenshot1.webp"
									alt="App screenshot"
									width="2432"
									height="1442"
									class="rounded-md shadow-2xl ring-1 ring-gray-900/10" />
							</div>
						</div>
					</div>
				</div>
				<div
					class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
					aria-hidden="true">
					<div
						class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-orange-500 to-red-400 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
						style="
							clip-path: polygon(
								74.1% 44.1%,
								100% 61.6%,
								97.5% 26.9%,
								85.5% 0.1%,
								80.7% 2%,
								72.5% 32.5%,
								60.2% 62.4%,
								52.4% 68.1%,
								47.5% 58.3%,
								45.2% 34.5%,
								27.5% 76.7%,
								0.1% 64.9%,
								17.9% 100%,
								27.6% 76.8%,
								76.1% 97.7%,
								74.1% 44.1%
							);
						" />
				</div>
			</div>

			<!-- Feature section -->
			<div class="mx-auto max-w-7xl px-6 lg:px-8 py-20">
				<div
					class="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
					<div class="lg:pr-8 lg:pt-4">
						<div class="lg:max-w-lg">
							<h2
								class="text-base font-semibold leading-7 text-orange-300">
								Early Access
							</h2>
							<p
								class="mt-2 text-3xl font-bold tracking-tight text-gray-50 sm:text-4xl">
								Access various AI models
							</p>
							<p class="mt-6 text-lg leading-8 text-gray-300">
								Use our powerful open AI models with several new
								features, such as integrated personalities and
								different sizes to choose from
							</p>
							<dl
								class="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-300 lg:max-w-none">
								<div
									v-for="feature in features"
									:key="feature.name"
									class="relative pl-9">
									<dt
										class="inline font-semibold text-gray-50">
										<Icon
											:name="feature.icon"
											class="absolute left-1 top-1 h-5 w-5 text-orange-300"
											aria-hidden="true" />
										{{ feature.name }}
									</dt>
									{{ " " }}
									<dd class="inline">
										{{ feature.description }}
									</dd>
								</div>
							</dl>
						</div>
					</div>
					<img
						src="/images/screenshots/screenshot1.webp"
						alt="Product screenshot"
						class="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
						width="2432"
						height="1442" />
				</div>
			</div>

			<!-- Testimonial section -->
			<!-- <div class="mx-auto mt-32 max-w-7xl sm:mt-56 sm:px-6 lg:px-8">
				<div
					class="relative overflow-hidden bg-gray-900 px-6 py-20 shadow-xl sm:rounded-3xl sm:px-10 sm:py-24 md:px-12 lg:px-20">
					<img
						class="absolute inset-0 h-full w-full object-cover brightness-150 saturate-0"
						src="https://images.unsplash.com/photo-1601381718415-a05fb0a261f3?ixid=MXwxMjA3fDB8MHxwcm9maWxlLXBhZ2V8ODl8fHxlbnwwfHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1216&q=80"
						alt="" />
					<div
						class="absolute inset-0 bg-gray-900/90 mix-blend-multiply" />
					<div
						class="absolute -left-80 -top-56 transform-gpu blur-3xl"
						aria-hidden="true">
						<div
							class="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-r from-orange-300 to-red-400 opacity-[0.45]"
							style="
								clip-path: polygon(
									74.1% 44.1%,
									100% 61.6%,
									97.5% 26.9%,
									85.5% 0.1%,
									80.7% 2%,
									72.5% 32.5%,
									60.2% 62.4%,
									52.4% 68.1%,
									47.5% 58.3%,
									45.2% 34.5%,
									27.5% 76.7%,
									0.1% 64.9%,
									17.9% 100%,
									27.6% 76.8%,
									76.1% 97.7%,
									74.1% 44.1%
								);
							" />
					</div>
					<div
						class="hidden md:absolute md:bottom-16 md:left-[50rem] md:block md:transform-gpu md:blur-3xl"
						aria-hidden="true">
						<div
							class="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-r from-orange-300 to-red-400 opacity-25"
							style="
								clip-path: polygon(
									74.1% 44.1%,
									100% 61.6%,
									97.5% 26.9%,
									85.5% 0.1%,
									80.7% 2%,
									72.5% 32.5%,
									60.2% 62.4%,
									52.4% 68.1%,
									47.5% 58.3%,
									45.2% 34.5%,
									27.5% 76.7%,
									0.1% 64.9%,
									17.9% 100%,
									27.6% 76.8%,
									76.1% 97.7%,
									74.1% 44.1%
								);
							" />
					</div>
					<div class="relative mx-auto max-w-2xl lg:mx-0">
						<img
							class="h-12 w-auto"
							src="https://tailwindui.com/img/logos/workcation-logo-white.svg"
							alt="" />
						<figure>
							<blockquote
								class="mt-6 text-lg font-semibold text-white sm:text-xl sm:leading-8">
								<p>
									“Amet amet eget scelerisque tellus sit neque
									faucibus non eleifend. Integer eu praesent
									at a. Ornare arcu gravida natoque erat et
									cursus tortor consequat at. Vulputate
									gravida sociis enim nullam ultricies
									habitant malesuada lorem ac.”
								</p>
							</blockquote>
							<figcaption class="mt-6 text-base text-white">
								<div class="font-semibold">Judith Black</div>
								<div class="mt-1">CEO of Tuple</div>
							</figcaption>
						</figure>
					</div>
				</div>
			</div> -->

			<!-- Pricing section -->
			<!-- <div class="py-24 sm:pt-48">
				<div class="mx-auto max-w-7xl px-6 lg:px-8">
					<div class="mx-auto max-w-4xl text-center">
						<h2
							class="text-base font-semibold leading-7 text-indigo-600">
							Pricing
						</h2>
						<p
							class="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
							Pricing plans for teams of&nbsp;all&nbsp;sizes
						</p>
					</div>
					<p
						class="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
						Distinctio et nulla eum soluta et neque labore
						quibusdam. Saepe et quasi iusto modi velit ut non
						voluptas in. Explicabo id ut laborum.
					</p>
					<div
						class="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
						<div
							v-for="(tier, tierIdx) in tiers"
							:key="tier.id"
							:class="[
								tier.mostPopular
									? 'lg:z-10 lg:rounded-b-none'
									: 'lg:mt-8',
								tierIdx === 0 ? 'lg:rounded-r-none' : '',
								tierIdx === tiers.length - 1
									? 'lg:rounded-l-none'
									: '',
								'flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10',
							]">
							<div>
								<div
									class="flex items-center justify-between gap-x-4">
									<h3
										:id="tier.id"
										:class="[
											tier.mostPopular
												? 'text-indigo-600'
												: 'text-gray-900',
											'text-lg font-semibold leading-8',
										]">
										{{ tier.name }}
									</h3>
									<p
										v-if="tier.mostPopular"
										class="rounded-full bg-indigo-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-indigo-600">
										Most popular
									</p>
								</div>
								<p class="mt-4 text-sm leading-6 text-gray-600">
									{{ tier.description }}
								</p>
								<p class="mt-6 flex items-baseline gap-x-1">
									<span
										class="text-4xl font-bold tracking-tight text-gray-900"
										>{{ tier.priceMonthly }}</span
									>
									<span
										class="text-sm font-semibold leading-6 text-gray-600"
										>/month</span
									>
								</p>
								<ul
									role="list"
									class="mt-8 space-y-3 text-sm leading-6 text-gray-600">
									<li
										v-for="feature in tier.features"
										:key="feature"
										class="flex gap-x-3">
										<CheckIcon
											class="h-6 w-5 flex-none text-indigo-600"
											aria-hidden="true" />
										{{ feature }}
									</li>
								</ul>
							</div>
							<a
								:href="tier.href"
								:aria-describedby="tier.id"
								:class="[
									tier.mostPopular
										? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-500'
										: 'text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300',
									'mt-8 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
								]"
								>Buy plan</a
							>
						</div>
					</div>
				</div>
			</div> -->

			<!-- FAQs -->
			<!-- <div
				class="mx-auto max-w-2xl divide-y divide-gray-900/10 px-6 pb-8 sm:pb-24 sm:pt-12 lg:max-w-7xl lg:px-8 lg:pb-32">
				<h2
					class="text-2xl font-bold leading-10 tracking-tight text-gray-900">
					Frequently asked questions
				</h2>
				<dl class="mt-10 space-y-8 divide-y divide-gray-900/10">
					<div
						v-for="faq in faqs"
						:key="faq.id"
						class="pt-8 lg:grid lg:grid-cols-12 lg:gap-8">
						<dt
							class="text-base font-semibold leading-7 text-gray-900 lg:col-span-5">
							{{ faq.question }}
						</dt>
						<dd class="mt-4 lg:col-span-7 lg:mt-0">
							<p class="text-base leading-7 text-gray-600">
								{{ faq.answer }}
							</p>
						</dd>
					</div>
				</dl>
			</div> -->

			<!-- CTA section -->
			<!-- <div class="relative -z-10 mt-32 px-6 lg:px-8">
				<div
					class="absolute inset-x-0 top-1/2 -z-10 flex -translate-y-1/2 transform-gpu justify-center overflow-hidden blur-3xl sm:bottom-0 sm:right-[calc(50%-6rem)] sm:top-auto sm:translate-y-0 sm:transform-gpu sm:justify-end"
					aria-hidden="true">
					<div
						class="aspect-[1108/632] w-[69.25rem] flex-none bg-gradient-to-r from-orange-500 to-red-400 opacity-25"
						style="
							clip-path: polygon(
								73.6% 48.6%,
								91.7% 88.5%,
								100% 53.9%,
								97.4% 18.1%,
								92.5% 15.4%,
								75.7% 36.3%,
								55.3% 52.8%,
								46.5% 50.9%,
								45% 37.4%,
								50.3% 13.1%,
								21.3% 36.2%,
								0.1% 0.1%,
								5.4% 49.1%,
								21.4% 36.4%,
								58.9% 100%,
								73.6% 48.6%
							);
						" />
				</div>
				<div class="mx-auto max-w-2xl text-center">
					<h2
						class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
						Boost your productivity.<br />Start using our app today.
					</h2>
					<p
						class="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
						Incididunt sint fugiat pariatur cupidatat consectetur
						sit cillum anim id veniam aliqua proident excepteur
						commodo do ea.
					</p>
					<div class="mt-10 flex items-center justify-center gap-x-6">
						<a
							href="#"
							class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
							>Get started</a
						>
						<a
							href="#"
							class="text-sm font-semibold leading-6 text-gray-900"
							>Learn more <span aria-hidden="true">→</span></a
						>
					</div>
				</div>
				<div
					class="absolute left-1/2 right-0 top-full -z-10 hidden -translate-y-1/2 transform-gpu overflow-hidden blur-3xl sm:block"
					aria-hidden="true">
					<div
						class="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
						style="
							clip-path: polygon(
								74.1% 44.1%,
								100% 61.6%,
								97.5% 26.9%,
								85.5% 0.1%,
								80.7% 2%,
								72.5% 32.5%,
								60.2% 62.4%,
								52.4% 68.1%,
								47.5% 58.3%,
								45.2% 34.5%,
								27.5% 76.7%,
								0.1% 64.9%,
								17.9% 100%,
								27.6% 76.8%,
								76.1% 97.7%,
								74.1% 44.1%
							);
						" />
				</div>
			</div> -->
		</main>

		<!-- Footer -->
		<!-- <div class="mx-auto mt-32 max-w-7xl px-6 lg:px-8">
			<footer
				aria-labelledby="footer-heading"
				class="relative border-t border-gray-900/10 py-24 sm:mt-56 sm:py-32">
				<h2 id="footer-heading" class="sr-only">Footer</h2>
				<div class="xl:grid xl:grid-cols-3 xl:gap-8">
					<img
						class="h-7"
						src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
						alt="Company name" />
					<div
						class="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
						<div class="md:grid md:grid-cols-2 md:gap-8">
							<div>
								<h3
									class="text-sm font-semibold leading-6 text-gray-900">
									Solutions
								</h3>
								<ul role="list" class="mt-6 space-y-4">
									<li
										v-for="item in footerNavigation.solutions"
										:key="item.name">
										<a
											:href="item.href"
											class="text-sm leading-6 text-gray-600 hover:text-gray-900"
											>{{ item.name }}</a
										>
									</li>
								</ul>
							</div>
							<div class="mt-10 md:mt-0">
								<h3
									class="text-sm font-semibold leading-6 text-gray-900">
									Support
								</h3>
								<ul role="list" class="mt-6 space-y-4">
									<li
										v-for="item in footerNavigation.support"
										:key="item.name">
										<a
											:href="item.href"
											class="text-sm leading-6 text-gray-600 hover:text-gray-900"
											>{{ item.name }}</a
										>
									</li>
								</ul>
							</div>
						</div>
						<div class="md:grid md:grid-cols-2 md:gap-8">
							<div>
								<h3
									class="text-sm font-semibold leading-6 text-gray-900">
									Company
								</h3>
								<ul role="list" class="mt-6 space-y-4">
									<li
										v-for="item in footerNavigation.company"
										:key="item.name">
										<a
											:href="item.href"
											class="text-sm leading-6 text-gray-600 hover:text-gray-900"
											>{{ item.name }}</a
										>
									</li>
								</ul>
							</div>
							<div class="mt-10 md:mt-0">
								<h3
									class="text-sm font-semibold leading-6 text-gray-900">
									Legal
								</h3>
								<ul role="list" class="mt-6 space-y-4">
									<li
										v-for="item in footerNavigation.legal"
										:key="item.name">
										<a
											:href="item.href"
											class="text-sm leading-6 text-gray-600 hover:text-gray-900"
											>{{ item.name }}</a
										>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</footer>
		</div> -->
	</div>
</template>
