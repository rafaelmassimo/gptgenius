import React from 'react';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import ToursPage from '@/app/components/ToursPage';
import { getAllTours } from '@/utils/action';

const AllToursPage = async () => {
	const queryClient = new QueryClient();
	// prefetchQuery is used to fetch the data before rendering the component
	await queryClient.prefetchQuery({
		queryKey: ['tours'],
		queryFn: () => getAllTours,
	});
	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<ToursPage />
		</HydrationBoundary>
	);
};

export default AllToursPage;
