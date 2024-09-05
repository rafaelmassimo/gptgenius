'use client';
import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	getExistingTours,
	createNewTour,
	generateTourResponse,
	fetchUserTokensById,
	subtractTokens,
	getUserFromClerk,
} from '../../utils/action';
import TourInfo from './TourInfo';
import { toast } from 'react-hot-toast';

const NewTour = () => {
	const queryClient = useQueryClient();
	const [userId, setUserId] = useState('');

	useEffect(() => {
		async function fetchUserId() {
			const id = await getUserFromClerk();
			setUserId(id);
		}

		fetchUserId();
	}, []);

	const {
		mutate,
		data: tour,
		isPending,
	} = useMutation({
		mutationFn: async (destination) => {
			//First check if the tour already exists in the database
			const existingTour = await getExistingTours(destination);
			if (existingTour) {
				return existingTour;
			}

			const currentTokens = await fetchUserTokensById(userId);
			if (currentTokens < 300) {
				toast.error('You need at least 300 tokens to generate a new tour');
				return;
			}

			//if the tour does not exist in the database, generate a new tour
			const newTour = await generateTourResponse(destination);
			console.log(newTour);

			if (!newTour.tour) {
				toast.error('No matching city found...');
				return null;
			}

			const response = await createNewTour(newTour);
			// this will invalidate the cache and refetch the data once the mutation is successful
			queryClient.invalidateQueries({ queryKey: ['tours'] });
			const newTokens = await subtractTokens(userId, newTour.tokens);
			toast.success(`${newTokens} tokens left`);
			return newTour;
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const destination = Object.fromEntries(formData.entries());

		// Here we are calling the mutate function to trigger the mutation and then will trigger all the function inside the mutationFn
		mutate(destination);
	};

	if (isPending) {
		return <span className="loading loading-lg"></span>;
	}

	return (
		<>
			<form onSubmit={handleSubmit} className="max-w-2xl">
				<h2 className="mb-4">Select Your Dream Destination</h2>
				<div className="join w-full">
					<input
						type="text"
						className="input input-bordered join-item w-full"
						placeholder="City"
						name="city"
						required
					/>
					<input
						type="text"
						className="input input-bordered join-item w-full"
						placeholder="Country"
						name="country"
						required
					/>
					<button className="btn btn-primary join-item" type="submit">
						Generate Tour
					</button>
				</div>
			</form>
			<div className="mt-16">
				{tour ? <TourInfo tour={tour} /> : null}
				<TourInfo />
			</div>
		</>
	);
};

export default NewTour;
