// 'use-client'

// import { SessionProvider } from "next-auth/react";
// import React from "react";
// export default function AuthProvider({
//     children

// } : {children: React.ReactNode}) {
//     return (
//         <SessionProvider >
//             {children}
//         </SessionProvider>
//     )
// }

"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
