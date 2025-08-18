import NextAuth from "next-auth/next"
import CredentialsProvider from "next-auth/providers/credentials"

export default NextAuth ({
  providers: [
    CredentialsProvider({
      secret: process.env.NEXTAUTH_SECRET,
      name: "credentials",
      credentials: {
        username: { label: "Email", type: "text", placeholder: "Name"},
        password: { label: "Password", type: "Password"},
      },
      authorize: (credentials) => {
        if (credentials.username === 'jhonalabama' && credentials.password === 'justifycontentcenter') {
          return {
            id: 2,
          }
        }
        return null
      }
    })
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id === user.id
      }
      return token
    },
    session: ({ session, token }) => {
      if (token) {
        session.id === token.id
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    encryption: true,
  }
})