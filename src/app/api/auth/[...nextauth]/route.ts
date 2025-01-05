import NextAuth, { AuthOptions } from "next-auth"
import { Provider } from "next-auth/providers"
import GithubProvider from "next-auth/providers/github"

export const authOptions: AuthOptions = {
    secret: process.env.NO_SECRET,
    // Configure one or more authentication providers
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        // ...add more providers here
    ],
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }