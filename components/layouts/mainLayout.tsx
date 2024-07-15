import { useIsOnline } from "react-use-is-online";
import Navbar from "./navbar";
import React, { PropsWithChildren } from "react";
import { useRouter } from "next/router";

const Layout = ({ children }: PropsWithChildren) => {
    const { isOnline, isOffline, error } = useIsOnline();
    const router = useRouter();

    if (router.pathname.startsWith('/app')) {
        return (
            <>
                <Navbar />
                <main className="m-2 antialiased">
                    {children}
                </main>
            </>
        )
    }

    return (
        <>
            <main className="m-2 antialiased">
                {children}
            </main>
        </>
    )


}

export default Layout;