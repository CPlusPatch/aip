// eslint-disable-next-line import/no-named-as-default
import OpenAI from "openai";

export default defineEventHandler(async event => {
	event.node.res.writeHead(200, { "Content-Type": "text/plain" });

	const messages = await readBody<{
		messages: { role: string; content: string }[];
	}>(event);

	const openai = new OpenAI({
		apiKey: "",
		baseURL: "http://192.168.2.109:2864/v1",
	});

	const stream = await openai.chat.completions.create({
		messages: messages as any,
		model: "/models/13B_U/wizardlm-1.0-uncensored-llama2-13b.ggmlv3.q2_K.bin",
		stream: true,
		max_tokens: 4096,
	});

	for await (const part of stream) {
		event.node.res.write(part.choices[0]?.delta?.content || "");
	}

	event.node.res.end();
});
