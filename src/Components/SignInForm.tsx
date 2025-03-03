import React from "react";
import { Button } from "~/Components/ui/button";
import { Input } from "~/Components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type z } from "zod";
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
  const signInMutation = api.auth.signin.useMutation();
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
            toast.error(res.message);
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
            toast.success("Signed in successfully");
            if (setIsOpened) {
              setIsOpened(false);
            }
            router.replace("/");
          }
        },
        onError: (err) => {
          toast.error("Something went wrong. Please try again.");
        },
      });
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 p-4">
      <Card className="w-full max-w-md rounded-2xl border border-gray-700 bg-neutral-800 bg-opacity-50 p-8 shadow-xl backdrop-blur-md">
        <CardHeader className="flex flex-col items-center gap-4">
          <Image src="/logo.svg" alt="Logo" width="120" height="120" />
          <CardTitle className="text-4xl font-bold text-white">
            Sign In
          </CardTitle>
          <p className="text-lg text-gray-200">Welcome back! Please log in.</p>
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
                    <FormLabel className="text-lg text-gray-100">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="w-full rounded-lg border border-gray-600 bg-neutral-700 text-lg text-white focus:ring-2 focus:ring-indigo-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-base text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                disabled={loading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg text-gray-100">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        className="rounded-lg border border-gray-600 bg-neutral-700 text-lg text-white focus:ring-2 focus:ring-indigo-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-base text-red-400" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={loading}
                className="w-full transform rounded-lg bg-indigo-600 py-3 text-xl font-semibold transition duration-300 ease-in-out hover:scale-105 hover:bg-indigo-500"
              >
                {loading ? (
                  <>
                    <Loader2 /> Signin In
                  </>
                ) : (
                  "Sign In"
                )}
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
                  className="text-base text-indigo-300 hover:text-indigo-200"
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
