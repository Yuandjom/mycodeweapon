import { ApiKeyProvider } from "@/providers/apikey-provider"


const SignedInLayout = ({
    children
}: {
    children: React.ReactNode
}) => {

    return (
        <ApiKeyProvider>
            <div className="w-full h-full">
                {children}
            </div>
        </ApiKeyProvider>
    )
}

export default SignedInLayout