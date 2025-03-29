import { Navbar } from "@/components/utils/Navbar";

export default function SignedOutLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex flex-col w-full h-screen">
      <Navbar />
      <div className="w-full h-full">{children}</div>
    </main>
  );
}
