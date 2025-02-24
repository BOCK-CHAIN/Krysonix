import { prisma } from "./db";
import bcryptjs from "bcryptjs";

export async function checkuser(email: string, password: string) {
  try {
    const existedUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!existedUser) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    if (!existedUser.password) {
      return {
        success: false,
        message: "Invalid Credentials.",
      };
    }

    // if (!existedUser.emailVerified) {
    //   const verificationToken = await generateVerificationToken(
    //     existedUser.email
    //   );

    //   return {};
    // }

    const isPasswordMatches = await bcryptjs.compare(
      password,
      existedUser.password
    );

    if (!isPasswordMatches) {
      return {
        success: false,
        message: "Password is incorrect.",
      };
    }

    return {
      success: true,
      data: existedUser,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  } catch (error: any) {
    return null;
  }
}
