"use client"

import { useBodyOverflow } from "@/app/contexts/body-overflow";

export default function Body({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { overflowY } = useBodyOverflow();

    return (
        <body style={{ overflowY: overflowY }}>
            {children}
        </body>
    );
}