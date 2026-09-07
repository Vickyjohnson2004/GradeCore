import './globals.css'; import type { Metadata } from 'next';
export const metadata:Metadata={title:'University of Port Harcourt Academic Result Portal',description:'Student Result Management System'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
