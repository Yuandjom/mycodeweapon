import type { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        template: "%s | My Code Weapon",
        default: "My Code Weapon"
    }
}

export default function SignedOutLayout({ children }: Readonly<{ children: React.ReactNode }>) {

    return <>{children}</>
}