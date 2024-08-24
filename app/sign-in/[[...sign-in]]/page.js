import { SignIn } from '@clerk/nextjs';

export default function Page() {
	return (
		<div className="min-h-screen flex justify-center items-center mb-4 gap-4 px-4">
			<SignIn />
		</div>
	);
}
