'use server';

import OpenAI from 'openai';

const openai = new OpenAI(process.env.OPENAI_API_KEY);

export const generateChatResponse = async (chatMessage) => {
	try {
		const response = await openai.chat.completions.create({
			messages: [{ role: 'system', content: 'You are a helpful assistant.' }, ...chatMessage],
			model: 'gpt-4o-mini',
			temperature: 0,
			max_tokens: 100,
		});
		return response.choices[0].message;
	} catch (error) {
		console.log(error);
		return null;
	}
};
