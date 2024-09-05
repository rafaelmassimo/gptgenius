import React from 'react';
import TourInfo from '../../../components/TourInfo';
import { getSingleTour } from '../../../../utils/action';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import axios from 'axios';

const url = `https://api.unsplash.com/search/photos?client_id=${process.env.UNSPLASH_API_KEY}&query=`;

const SingleTourPage = async ({ params }) => {
	const tour = await getSingleTour(params.id);

	if (!tour) {
		redirect('/tours');
	}
	//Here I'm using the Unsplash API to get an image of the city
	const { data } = await axios(`${url}${tour.city}`, {
		headers:{
			Authorization: `Client-ID ${process.env.UNSPLASH_SECRET_API_KEY}`
		},
		
	});
	const tourImage = data?.results[0]?.urls?.full;

	// const tourImage = await generateTourImage({
	// 	city: tour.city,
	// 	country: tour.country,
	// });
	return (
		<div>
			<Link href={'/tours'} className="btn btn-secondary mb-12">
				Back to Tours
			</Link>
			{tourImage ? (
				<>
					<div>
						<Image
							src={tourImage}
							width={250}
							height={250}
							alt="Tour Image"
							className="rounded-xl shadow-xl mb-16 h-auto w-auto object-cover"
							priority
						/>
					</div>
				</>
			) : null}
			<TourInfo tour={tour} />
		</div>
	);
};

export default SingleTourPage;
