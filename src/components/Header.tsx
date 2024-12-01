"use client"
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { handleSignIn } from '@/app/serverAction/serverAction';
import { Button } from './ui/button';

function SignOut() {
    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            signOut({ callbackUrl: '/' }); // Sign out and redirect to the homepage
        }}>
            <Button
                variant="secondary"
                type="submit"
                className='text-sm md:text-lg'
            >
                Sign out
            </Button>
        </form>
    );
}

function SignIn() {
    return (
        <form action={handleSignIn} >
            <Button
                variant='secondary'
                type="submit"
                className='text-sm md:text-lg'
            >
                Sign In
            </Button>
        </form >
    );
}
export default function Header() {
    const { data: session, status } = useSession();

    return (
        <div>
            <header className="flex justify-between p-4 bg-gray-100">
                <div className="text-lg md:text-2xl font-bold">
                    <Link href="/">{process.env.NEXT_PUBLIC_COMPANY_NAME}</Link>
                </div>
                <div>
                    {session?.user && status == "authenticated" ? (
                        <SignOut />
                    ) : (
                        <SignIn />
                    )}
                </div>
            </header>
        </div>
    );
}
