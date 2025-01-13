
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AuthSignIn from "@/components/auth/auth.signin";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
/**
 * Page for signing in
 * @returns {React.ReactElement} Sign in page
 */
const SignInPage = async () => {
    const session = await getServerSession(authOptions);
    if (session) {
        redirect('/')
    }

    return (
        <>
            <AuthSignIn />
        </>
    );
}

export default SignInPage;
