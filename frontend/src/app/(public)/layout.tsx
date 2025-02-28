import Footer from "@/components/utils/Footer";

export default function SignedOutLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex_col_center w-full">
      {children}
      <Footer />
    </div>
  );
}
