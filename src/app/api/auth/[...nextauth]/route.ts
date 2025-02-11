import { sendRequest } from "@/utils/api";
import NextAuth, { AuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
    secret: process.env.NO_SECRET,
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: { label: "username", type: "text", placeholder: "jsmith" },
                password: { label: "password", type: "password" }
            },
            async authorize(credentials, req) {
                // Add logic here to look up the user from the credentials supplied
                const res = await sendRequest<IBackendRes<JWT>>({
                    url: 'http://localhost:8000/api/v1/auth/login',
                    method: 'POST',
                    body: { username: credentials?.username, password: credentials?.password }
                })

                if (res.data) {
                    // Any object returned will be saved in `user` property of the JWT
                    return res.data as any
                } else {
                    // If you return null then an error will be displayed advising the user to check their details.
                    throw new Error('Invalid credentials')

                    // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
                }
            }
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),

    ],
    callbacks: {
        /*************  ✨ Codeium Command ⭐  *************/
        /**
         * The `jwt` callback is called after a user has been authenticated with a provider.
         * The `jwt` callback is called with the user object, the account object, the profile object, and the auth trigger.
         * The `jwt` callback should return a JSON Web Token (JWT) that will be stored in the user's session.
         * The JWT should contain the user's id, email, and any other relevant information.
         * The JWT will be used to authenticate the user on subsequent requests.
         * @param {Object} token The JWT that will be stored in the user's session.
         * @param {Object} user The user that has been authenticated.
         * @param {Object} account The account object that the user is logging in with.
         * @param {Object} profile The profile object that the user is logging in with.
         * @param {String} trigger The auth trigger that triggered the `jwt` callback.
         * @return {Promise<Object>} The JWT that will be stored in the user's session.
         */
        /******  377c8c8a-467b-45c4-8a05-36b38bd0d213  *******/
        async jwt({ token, user, account, profile, trigger }) {
            if (trigger === 'signIn' && account?.provider === 'github') {
                const res = await sendRequest<IBackendRes<JWT>>({
                    url: 'http://localhost:8000/api/v1/auth/social-media',
                    method: 'POST',
                    body: { type: "GITHUB", username: user.email }
                })
                if (res.data) {
                    token.access_token = res.data?.access_token;
                    token.refresh_token = res.data.refresh_token;
                    token.user = res.data.user;
                    token.user.image = user?.image as string;
                }
            }
            if (trigger === 'signIn' && account?.provider === 'credentials') {
                if (user) {
                    //@ts-ignore
                    token.access_token = user?.access_token;
                    //@ts-ignore
                    token.refresh_token = user?.refresh_token;
                    //@ts-ignore
                    token.user = user?.user;
                }

            }
            return token;
        },
        /*************  ✨ Codeium Command ⭐  *************/
        /**
         * The `session` callback is called whenever a session is checked. When a session is checked, the `session` callback is called with the session object, the token object, and the user object.
         * The `session` callback should return the updated session object.
         * @param {Object} session The session object that is being checked.
         * @param {Object} token The token object that is being checked.
         * @param {Object} user The user object that is being checked.
         * @return {Promise<Object>} The updated session object.
         */
        /******  8abae4f2-3b3e-4394-8ba4-f90cdd44d5e2  *******/
        session({ session, token, user }) {
            session.user = token.user
            session.access_token = token.access_token
            session.refresh_token = token.refresh_token
            return session
        },

    }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
