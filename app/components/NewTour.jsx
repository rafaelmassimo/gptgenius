'use client';
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getExistingTours, createNewTour, generateTourResponse } from '@/utils/action';
import TourInfo from './TourInfo';
import { toast } from 'react-hot-toast';

const NewTour = () => {
	const {
		mutate,
		data: tour,
		isPending,
	} = useMutation({
		mutationFn: async (destination) => {
			const newTour = await generateTourResponse(destination);
			if (newTour) {
				return newTour;
			}
			toast.error('No matching city found...');
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
