"use client"

import { useSession } from "next-auth/react";
import { Productpage } from "./Product";

export default function WelcomePage() {
    const { data: session, status } = useSession();
    return (
        <>
            {session?.user && status === "authenticated" ? (
                <>
                    <Productpage />
                </>
            ) : (
                <>
                    <div className="min-h-screen flex justify-center items-center">
                        <h1 className="text-xl md:text-3xl font-bold text-center">
                            Welcome, Please Login
                        </h1>
                    </div>
                </>
            )}
        </>
    );
}
