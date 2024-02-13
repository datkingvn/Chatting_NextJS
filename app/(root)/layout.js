import {Inter} from "next/font/google";
import "../globals.css";
import Provider from "@components/Provider";

const inter = Inter({subsets: ["latin"]});

export const metadata = {
    title: "DChat App",
    description: "Khu vực chát của DChat App",
};

export default function RootLayout({children}) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <Provider>
            {children}
        </Provider>
        </body>
        </html>
    );
}
