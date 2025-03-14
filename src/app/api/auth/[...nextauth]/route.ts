import { sendRequest } from "@/utils/api";
import NextAuth, { AuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

import GithubProvider from "next-auth/providers/github";

export const authOptions: AuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    // Configure one or more authentication providers
    providers: [

        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "website",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                // Add logic here to look up the user from the credentials supplied
                const res = await sendRequest<IBackendRes<JWT>>({
                    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login`,
                    method: 'POST',
                    body: { username: credentials?.username, password: credentials?.password }
                });

                if (res.data) {
                    // Any object returned will be saved in `user` property of the JWT
                    return res.data as any;
                } else {
                    // If you return null then an error will be displayed advising the user to check their details.
                    // Trả về lỗi khi thông tin đăng nhập sai
                    throw new Error(res.message);

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

        // lấy token ở cookie mỗi khi có 1 request gửi lên next server rồi giả mã (decode), sau đó thì mình modify lại, thêm hay bớt data gì đó
        // khi dùng useSession ở client thì nó sẽ chay tự động gửi token xuống để check
        async jwt({ token, user, account, profile, trigger }) {
            if (trigger === 'signIn' && account?.provider === 'github') {
                const res = await sendRequest<IBackendRes<JWT>>({
                    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/social-media`,
                    method: 'POST',
                    body: { type: "GITHUB", username: user.email }
                });
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
            return token
        },

        // sau khi modify cái token thì nạp ngược lại cho session
        session({ session, token, user }) {
            session.user = token.user
            session.access_token = token.access_token
            session.refresh_token = token.refresh_token
            return session
        },


    },
    // pages: {
    //     signIn: "/auth/signin",
    // },


}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST };
