'use server';

import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';

const openai = new OpenAI(process.env.OPENAI_API_KEY);

//* Create an instance of PrismaClient before using it
const prisma = new PrismaClient();

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
			max_tokens: 100,
		});
		const tourData = JSON.parse(response.choices[0].message.content);
		if (!tourData.tour) {
			return null;
		}

		return tourData.tour;
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

export const createNewTour = async (tour) => {
	return prisma.tour.create({
		data: tour,
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

export const getSingleTour = async (id)=> {
	return prisma.tour.findUnique({
		where: {
			id,
		},
	})
}

export const generateTourImage = async ({city, country}) => {
	try {
		const tourImage =  await openai.images.generate({
			prompt: `a panoramic view of ${city}, ${country}`,
			n:1,
			size:"256x256",
		
			
		})
		return tourImage?.data[0]?.url;
	} catch (error) {
		console.log(error);
		return null;
		
	}
}

export const fetchUserTokensById= async(clerkId) => {
	const result = await prisma.token.findUnique({
		where: {
			clerkId
		}
	})
	return result?.tokens;
}