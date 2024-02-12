import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "DChat Auth",
    description: "This is Auth Area Chat App",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body className={`${inter.className} bg-purple-1`}>{children}</body>
        </html>
    );
}
