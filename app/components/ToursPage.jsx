'use client';

import React, { useState } from 'react';
import { getAllTours } from '@/utils/action';
import ToursList from './ToursList';
import { useQuery } from '@tanstack/react-query';

const ToursPage = () => {
	const [searchValue, setSearchValue] = useState('');
	//When you start a new instance of useQuery, and if you pass the queryKey it will get the same data from the cache that was stored in the previous instance of useQuery.
	const { data, isPending } = useQuery({
		queryKey: ['tours', searchValue],
		queryFn: () => getAllTours(searchValue),
	});
	return (
		<>
			<form className="max-w-lg mb-12">
				<div className="join w-full">
					<input
						type="text"
						placeholder="enter city or country here..."
						className="input input-bordered join-item w-full"
						value={searchValue}
						onChange={(e) => setSearchValue(e.target.value)}
						required
					/>
					<button
						className="btn btn-primary join-item"
						type="button"
						disabled={isPending}
						onClick={() => setSearchValue('')}
					>
						{isPending ? 'please wait...' : 'reset'}
					</button>
				</div>
			</form>
			{isPending ? <span className="loading"></span> : <ToursList data={data} />}
		</>
	);
};

export default ToursPage;
