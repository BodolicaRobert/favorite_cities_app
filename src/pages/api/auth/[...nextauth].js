import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "../../../../entity/User";
import AppDataSource from "../../../../utils/data-source";


export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Get the data source (AppDataSource)        
        const dataSource = await AppDataSource.initialize(); // Initialize the data source     
        const userRepository = dataSource.getRepository(User); // Get the User repository      
        
        // Find the user by email
        const user = await userRepository.findOne({ where: { email: credentials.email } });
        console.log(user);     
        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          // If user exists and password matches, return the user
          console.log("passwords matched");
          return { id: user.id, email: user.email };
        }
        // If user not found or password doesn't match, return null
        return null;
      },
    }),
  ]
});
