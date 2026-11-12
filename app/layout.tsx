import { Geist } from "next/font/google"

// import { Navbar } from "@/components/navbar"
import { NavbarMega } from "@/components/navbar-mega"
import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={geist.variable}>
      <body className="bg-[#010103] font-sans">
        {/* <Navbar /> */}
        {/* <main className="pt-28">{children}</main> */}

        {/* in app/layout.tsx. It's sticky, so no top padding is
        needed. */}
        <NavbarMega />
        <main className="">{children}</main>
        {/* <ThemeProvider>{children}</ThemeProvider> */}
      </body>
    </html>
  )
}
