'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import OpenAI from 'openai';
import { auth, currentUser } from '@clerk/nextjs/server';

const openai = new OpenAI(process.env.OPENAI_API_KEY);

//* Create an instance of PrismaClient before using it
const prisma = new PrismaClient();

export const generateChatResponse = async (chatMessage) => {
	try {
		const response = await openai.chat.completions.create({
			//The first message is the role of the AI
			//The content is to explain to the AI what is it about this conversation
			//...chatMessage is the array of messages that the AI will use to generate a response you need to send them together all the time 
			messages: [{ role: 'system', content: 'You are a helpful assistant.' }, ...chatMessage],
			model: 'gpt-4o-mini',
			temperature: 0,
			max_tokens: 100,
		});
		console.log('this is tour data', response);

		return response.choices[0].message;
	} catch (error) {
		console.log(error);
		return null;
	}
};

export const generateTourResponse = async ({ city, country }) => {
	const query = `Find a ${city} in this ${country}.
If ${city} in this ${country} exists, create a list of things families can do in this ${city}, ${country}. 
Once you have a list, create a one-day tour. Response should be in the following JSON format: 
{
    "tour": {
    "city": "${city}",
    "country": "${country}",
    "title": "title of the tour",
    "description": "description of the city and tour",
    "stops": ["short paragraph on the stop 1 ", "short paragraph on the stop 2","short paragraph on the stop 3"]
    }
}
If you can't find info on the exact ${city}, or ${city} does not exist, or its population is less than 1, or it is not located in the following ${country}, return { "tour": null }, with no additional characters.`;

	try {
		const response = await openai.chat.completions.create({
			messages: [
				{ role: 'system', content: 'You are a tour guide.' },
				{ role: 'user', content: query },
			],
			model: 'gpt-4o-mini',
			temperature: 0,
			max_tokens: 1000,
			temperature: 0,
		});
		const tourData = JSON.parse(response.choices[0].message.content);
		
		if (!tourData.tour) {
			return null;
		}

		

		return { tour:tourData.tour, tokens:response.usage.total_tokens };
	} catch (error) {
		console.log(error);

		return null;
	}
};

export const getExistingTours = async ({ city, country }) => {
	return prisma.tour.findUnique({
		where: {
			city_country: {
				city,
				country,
			},
		},
	});
};

export const createNewTour = async (tourData) => {
    const tour = tourData.tour; // Extract the nested tour object
    return prisma.tour.create({
        data: {
            city: tour.city,
            country: tour.country,
            title: tour.title,
            description: tour.description,
            stops: tour.stops,
            tokens: tour.tokens
        }
    });
};

//If i'm not receiving any search term which is the city and country, I will return all the tours in the database
export const getAllTours = async (searchTerm) => {
	if (!searchTerm) {
		const tours = prisma.tour.findMany({
			orderBy: {
				city: 'asc',
			},
		});
		return tours;
	}

	const tours = await prisma.tour.findMany({
		where: {
			OR: [
				{
					city: {
						contains: searchTerm,
						mode: 'insensitive',
					},
				},
				{
					country: {
						contains: searchTerm,
						mode: 'insensitive',
					},
				},
			],
		},
		orderBy: {
			city: 'asc',
		},
	});
	return tours;
};

export const getSingleTour = async (id) => {
	return prisma.tour.findUnique({
		where: {
			id,
		},
	});
};

// export const generateTourImage = async ({ city, country }) => {
// 	try {
// 		const tourImage = await openai.images.generate({
// 			prompt: `a panoramic view of ${city}, ${country}`,
// 			n: 1,
// 			size: '256x256',
// 		});
// 		return tourImage?.data[0]?.url;
// 	} catch (error) {
// 		console.log(error);
// 		return null;
// 	}
// };

export const fetchUserTokensById = async (clerkId) => {
	const result = await prisma.token.findUnique({
		where: {
			clerkId,
		},
	});

	return result?.tokens;
};

export const generateUserTokensForId = async (clerkId) => {
	const result = await prisma.token.create({
		data: {
			clerkId,
		},
	});
	return result?.tokens;
};

export const fetchOrGenerateTokens = async (clerkId) => {
	const result = await fetchUserTokensById(clerkId);
	if (result) {
		return result.tokens;
	}
	return (await generateUserTokensForId(clerkId)).tokens;
};

export const subtractTokens = async (clerkId, tokens) => {
	const result = await prisma.token.update({
		where: {
			clerkId,
		},
		data: {
			tokens: {
				decrement: tokens,
			},
		},
	});
	revalidatePath('/profile');
	// Return the new token value
	return result.tokens;
};

export const getUserFromClerk = async () => {
	const { userId } = auth();
	return userId;
};
