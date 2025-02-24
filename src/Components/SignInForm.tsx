import React from "react";
import { Button } from "~/Components/ui/button";
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
import { toast } from "sonner";
import { signInSchema } from "~/lib/zod";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { api } from "~/utils/api";
import { Loader2 } from "lucide-react";

export default function SignIn({
  setIsOpened,
}: {
  setIsOpened?: (isOpened: boolean) => void;
}) {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const signInMutation = api.auth.signin.useMutation()
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof signInSchema>) {
    try {
      setLoading(true);
      await signInMutation.mutateAsync(data, {
        onSuccess: async (res) => {
          if (!res.success) {
            toast.error(res.message)
            return;
          }

          const result = await signIn("credentials", {
            redirect: false,
            email: data.email,
            password: data.password,
          });

          if (!result || !result.ok) {
            toast.error("Something went wrong. Please try again.");
          } else {
            toast.success("Signed in successfully")
            if (setIsOpened) {
              setIsOpened(false);
            }
            router.replace("/");
          }
        },
        onError: (err) => {
          toast.error("Something went wrong. Please try again.");
        }
      })

    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    }
    setLoading(false)
  }

  return (
    <div className="flex w-full items-center justify-center min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 p-4">
      <Card className="w-full max-w-md bg-neutral-800 bg-opacity-50 backdrop-blur-md rounded-2xl p-8 border border-gray-700 shadow-xl">
        <CardHeader className="flex flex-col items-center gap-4">
          <Image src="/logo.svg" alt="Logo" width="120" height="120" />
          <CardTitle className="text-white text-4xl font-bold">Sign In</CardTitle>
          <p className="text-gray-200 text-lg">Welcome back! Please log in.</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                disabled={loading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-100 text-lg">Email</FormLabel>
                    <FormControl>
                      <Input className="w-full bg-neutral-700 text-white text-lg border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-400 text-base" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                disabled={loading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-100 text-lg">Password</FormLabel>
                    <FormControl>
                      <Input type="password" className="bg-neutral-700 text-white text-lg border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-400 text-base" />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 rounded-lg py-3 text-xl font-semibold transition duration-300 ease-in-out transform hover:scale-105">
                {loading ? <>
                  <Loader2 /> Signin In
                </> : "Sign In"}
              </Button>
              <div className="text-center">
                <Button
                  type="button"
                  onClick={() => {
                    if (setIsOpened) {
                      setIsOpened(false);
                      router.replace("/auth/sign-up");
                    } else {
                      window.location.replace("/auth/sign-up");
                    }
                  }}
                  className="text-indigo-300 hover:text-indigo-200 text-base"
                  variant="link"
                >
                  Don&apos;t have an account? Sign up
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}