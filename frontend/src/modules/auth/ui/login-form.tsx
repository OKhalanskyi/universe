"use client";

import React from "react";
import Link from "next/link";
import { Github, Loader2 } from "lucide-react";
import {useLoginForm} from "@/modules/auth/model/use-login-form";
import {useLoginSubmit} from "@/modules/auth/model/use-login-submit";
import {cn} from "@/shared/lib/utils";
import {Card, CardContent} from "@/shared/ui/card";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/shared/ui/form";
import {Input} from "@/shared/ui/input";
import {Button} from "@/shared/ui/button";
import {GithubLoginButton} from "@/modules/auth/ui/github-login-button";
import {useCurrentUser} from "@/modules/auth/model/use-get-current-user";
import {redirect} from "next/navigation";

export function LoginForm({
                            className,
                            ...props
                          }: React.ComponentPropsWithoutRef<"div">) {
  const form = useLoginForm();
  const { onSubmit, isLoading, error, isError } = useLoginSubmit();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="p-6 md:p-8"
              data-testid="login-form"
            >
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Вітаємо знову!</h1>
                  <p className="text-balance text-muted-foreground">
                    Увійдіть до вашого облікового запису GitHub CRM
                  </p>
                </div>

                {isError && (
                  <div className="p-4 border rounded-lg bg-destructive/10 border-destructive/20 flex flex-col gap-1.5 text-sm">
                    <p className="font-medium text-destructive">
                      {error || "Щось пішло не так"}
                    </p>
                  </div>
                )}

                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Електронна пошта</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="example@mail.com"
                            type="email"
                            required
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Пароль</FormLabel>
                          <div
                            className="text-sm underline-offset-2 hover:underline"
                          >
                            Забули пароль?
                          </div>
                        </div>
                        <FormControl>
                          <Input
                            placeholder="••••••"
                            required
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Вхід...
                    </>
                  ) : (
                    "Увійти"
                  )}
                </Button>

                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 bg-background px-2 text-muted-foreground">
                    Або продовжити з
                  </span>
                </div>

                <GithubLoginButton />

                <div className="text-center text-sm">
                  Не маєте облікового запису?{" "}
                  <Link href="/register" className="underline underline-offset-4">
                    Зареєструватися
                  </Link>
                </div>
              </div>
            </form>
          </Form>

          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-primary/90 flex flex-col items-center justify-center text-white p-6 mr-6 rounded-xl">
              <Github className="h-20 w-20 mb-4" />
              <h2 className="text-2xl font-bold mb-4">GitHub CRM</h2>
              <p className="text-center mb-6">
                Управляйте своїми GitHub проєктами з легкістю. Відстежуйте
                репозиторії, зірки та відкриті питання в одному місці.
              </p>
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="bg-white/10 p-3 rounded">
                  <h3 className="font-medium mb-1">Статистика</h3>
                  <p className="text-sm opacity-90">Зірки, форки, питання</p>
                </div>
                <div className="bg-white/10 p-3 rounded">
                  <h3 className="font-medium mb-1">Проєкти</h3>
                  <p className="text-sm opacity-90">Групуйте репозиторії</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        Натискаючи "Увійти", ви погоджуєтесь з нашими <a href="#">Умовами використання</a>{" "}
        та <a href="#">Політикою конфіденційності</a>.
      </div>
    </div>
  );
}