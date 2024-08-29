import TourInfo from '@/app/components/TourInfo';
import { getSingleTour } from '@/utils/action';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';

const SingleTourPage = async ({ params }) => {
	const tour = await getSingleTour(params.id);

	if (!tour) {
		redirect('/tours');
	}
	return (
		<div>
			<Link href={'/tours'} className="btn btn-secondary mb-12">
				Back to Tours
			</Link>
			<TourInfo tour={tour} />
		</div>
	);
};

export default SingleTourPage;
