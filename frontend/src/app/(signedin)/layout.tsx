import { AiProvider } from "@/providers/ai-provider";

const SignedInLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AiProvider>
      <div className="w-full h-full">{children}</div>
    </AiProvider>
  );
};

export default SignedInLayout;
