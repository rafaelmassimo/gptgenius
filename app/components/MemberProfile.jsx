import React from 'react';
import { UserButton } from '@clerk/nextjs';
import { auth, currentUser } from '@clerk/nextjs/server'
import { fetchOrGenerateTokens } from '@/utils/action';



//* check https://clerk.com/docs/references/nextjs/auth
//* check https://clerk.com/docs/references/nextjs/current-user

// Here I'm using the Clerk SDK to get the current user
const MemberProfile = async  () => {
    const user = await currentUser();
	const {userId} = auth();
	console.log(userId);
	
	await fetchOrGenerateTokens(userId);

    
	return (
		<div className="px-4 flex items-center gap-2">
			<UserButton afterSignOutUrl="/" />
            <p>{user.emailAddresses[0].emailAddress}</p>
		</div>
	);
};

export default MemberProfile;
