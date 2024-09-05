'use client';
import toast from 'react-hot-toast';
import { generateChatResponse } from '@/utils/action';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';

const Chat = () => {
	const [text, setText] = useState('');
	const [messages, setMessages] = useState([]);

	const { mutate, isPending } = useMutation({
		mutationFn: (query) => generateChatResponse([...messages, query]),
		onSuccess: (data) => {
			if (!data) {
				toast.error('Failed to generate response');
				return;
			}
			setMessages((prev) => [...prev, data]);
		},
	});
	console.log(messages);
	

	const handleSubmit = (e) => {
		e.preventDefault();
		const query = { role: 'user', content: text };
		mutate(query);
		setMessages((prev) => [...prev, query]);
		setText('');
	};

	const clearChat = () => {
		setMessages([]);
	}

	return (
		// it's important to do not forget to remove all the spaces inside the [ ] brackets
		<div className="min-h-[calc(100vh-6rem)] grid grid-rows-[1fr,auto]">
			<button className="btn btn-secondary join-item w-fit" onClick={clearChat} disabled={isPending}>
				Clear Chat
			</button>
			<div>
				{messages.map(({ role, content }, index) => {
					const avatar = role === 'user' ? '👤' : '🐸';
					const bcg = role === 'user' ? 'bg-base-200' : 'bg-base-100';
					return (
						<div
							key={index}
							className={`${bcg} flex py-6 -mx-8 px-8 text-xl leading-loose border-b border-base-300`}
						>
							<span className="mr-4">{avatar}</span>
							<p className="max-w-3xl">{content}</p>
						</div>
					);
				})}
				{isPending ? <span className="loading pt-2"></span> : null}
			</div>
			<form onSubmit={handleSubmit} className="max-w-4xl pt-12">
				<div className="join w-full">
					<input
						type="text"
						placeholder="Message GeniusGPT "
						className="input input-bordered join-item w-full"
						value={text}
						required
						onChange={(e) => setText(e.target.value)}
					/>
					<button className="btn btn-primary join-item" type="submit" disabled={isPending}>
						{isPending ? 'Loading...' : 'Ask Question'}
					</button>
				</div>
			</form>
		</div>
	);
};

export default Chat;
