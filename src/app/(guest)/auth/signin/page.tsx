import AuthSignIn from "@/components/auth/auth.signin"
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const SignInPage = async () => {
    const session = await getServerSession(authOptions);
    if (session) {
        redirect('/')
    }
    return (
        <AuthSignIn />
    )
}

export default SignInPage;