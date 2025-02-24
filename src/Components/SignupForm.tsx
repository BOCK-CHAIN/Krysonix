import React, { useState } from "react";
import { Input } from "~/Components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/Components/ui/form";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { signUpSchema } from "~/lib/zod";
import { toast } from "sonner";
import { api } from "~/utils/api";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";

export default function SignUpForm({
  setIsOpened,
}: {
  setIsOpened?: (isOpened: boolean) => void;
}) {
  const [loading, setLoading] = useState(false)
  const router = useRouter();
  const registerMutation = api.auth.signup.useMutation();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof signUpSchema>) {
    setLoading(true)
    await registerMutation.mutateAsync(data, {
      onSuccess: async (res) => {
        if (res.success) {
          if (setIsOpened) {
            setIsOpened(false);
          }
          const result = await signIn("credentials", {
            redirect: false,
            email: data.email,
            password: data.password,
          });
          if (!result!.ok) {
            toast.error("something went wrong. Please SignIn")
          }
          toast.success("Account created successfully");
          router.replace("/");
          setLoading(false)
        } else {
          toast.error(res.message);
          setLoading(false)
        }
      },
    });
  }

  return (
    <div className="flex w-full items-center justify-center min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 p-4">
      <Card className="w-full max-w-md bg-neutral-800 bg-opacity-50 backdrop-blur-md rounded-2xl p-8 border border-gray-700 shadow-xl">
        <CardHeader className="flex flex-col items-center gap-3">
          <Image onClick={() => router.push('/')} src="/logo.svg" alt="Logo" width="120" height="120" className="cursor-pointer" />
          <CardTitle className="text-white text-4xl font-bold">Sign Up</CardTitle>
          <p className="text-gray-200 text-lg">Create an account to get started</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-100 text-lg">Name</FormLabel>
                    <FormControl>
                      <Input disabled={loading} className="w-full bg-neutral-700 text-white text-lg border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-400 text-base" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-100 text-lg">Email</FormLabel>
                    <FormControl>
                      <Input disabled={loading} className="w-full bg-neutral-700 text-white text-lg border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-400 text-base" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-100 text-lg">Password</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        type="password"
                        className="w-full bg-neutral-700 text-white text-lg border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-base" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-100 text-lg">Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        type="password"
                        className="w-full bg-neutral-700 text-white text-lg border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-base" />
                  </FormItem>
                )}
              />
              <div className="text-center">
                <Button
                  disabled={loading}
                  type="button"
                  onClick={() => {
                    if (setIsOpened) {
                      setIsOpened(false);
                      router.replace("/auth/sign-in");
                    } else {
                      window.location.replace("/auth/sign-in");
                    }
                  }}
                  className="text-indigo-300 hover:text-indigo-200 text-base"
                  variant="link"
                >
                  Already have an account? Sign in
                </Button>
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 rounded-lg p-3 text-xl font-semibold transition duration-300 ease-in-out transform hover:scale-105">
                {loading ? <>
                  <Loader2 />
                  Signing Up...
                </> : "Sign Up"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}