import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
        credentials: {
          username: { label: "Username", type: "text"},
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials, req) {      
          const user = { id: "1", name: credentials.username, email: credentials.username+"@example.com" }
          if (user) {
            return user
          } else {
            return null
          }
        }
      })
  ]
}

export default NextAuth(authOptions)