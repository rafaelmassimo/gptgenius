import React from 'react';
import { UserButton } from '@clerk/nextjs';
import { auth, currentUser } from '@clerk/nextjs/server'
import { UserProfile } from '@clerk/nextjs';



// check https://clerk.com/docs/references/nextjs/auth
// check https://clerk.com/docs/references/nextjs/current-user


const MemberProfile = async  () => {
    const user = await currentUser();
	const {userId} = auth();

    console.log(user);
    
	return (
		<div className="px-4 flex items-center gap-2">
			<UserButton afterSignOutUrl="/" />
            <p>{user.emailAddresses[0].emailAddress}</p>
		</div>
	);
};

export default MemberProfile;
