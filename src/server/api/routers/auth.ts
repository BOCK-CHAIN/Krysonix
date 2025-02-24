import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { signInSchema, signUpSchema } from "~/lib/zod";
import { signIn, signOut } from "next-auth/react";
import bcrypt from "bcryptjs";

export const authRouter = createTRPCRouter({
  signin: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const { email, password } = input;
        const isValidType = signInSchema.safeParse({
          email,
          password,
        });

        if (!isValidType.success) {
          return {
            success: false,
            message: "Invalid email or password",
          };
        }

        const user = await ctx.prisma.user.findUnique({
          where: { email: email },
        });

        if (!user) {
          return {
            success: false,
            message: "User not found or Email does not match",
          };
        }
        if (!user.password) {
          return {
            success: false,
            message: "Invalid Credentials",
          };
        }
        // if(!user.emailVerified){
        //   const verificationToken = await generateVerificationToken(user.email);

        //   return {
        //     success: true,
        //     message: "Confirmation Email has been sent",
        //   }
        // }
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
          return {
            success: false,
            message: "Wrong password. Please try again",
          };
        }

        return {
          success: true,
          data: user,
        };
      } catch (error: any) {
        return {
          success: false,
          message: (error as Error).message,
        };
      }
    }),

  signup: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(6),
        confirmPassword: z.string().min(6),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const isValid = signUpSchema.safeParse(input);
        if(!isValid.success){
          return {
            success: false,
            message: "Invalid input",
          }
        }
        const {email, password, name} = input;

        const existedUser = await ctx.prisma.user.findUnique({
          where: {
            email,
          },
        });
        if (existedUser) {
          return {
            success: false,
            message: "User already exists.",
          };
        }
        const hash = await bcrypt.hash(password, 10);

        const user = await ctx.prisma.user.create({
          data: {
            name,
            email,
            password: hash,
          },
        });
        return {
          success: true,
          data: user,
        };
      } catch (error: any) {
        return {
          success: false,
          message: error.message,
        };
      }
    }),
  signOut: publicProcedure.query(async ({ ctx }) => {
    try {
      await signOut({
        redirect: false,
      });
      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
      };
    }
  }),
});
