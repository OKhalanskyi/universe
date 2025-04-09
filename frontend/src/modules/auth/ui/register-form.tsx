'use client';

import React from 'react';
import Link from 'next/link';
import { Github, Loader2 } from 'lucide-react';
import { useRegisterForm } from '@/modules/auth/model/use-register-form';
import { useRegisterSubmit } from '@/modules/auth/model/use-register-submit';
import { cn } from '@/shared/lib/utils';
import { Card, CardContent } from '@/shared/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { GithubLoginButton } from '@/modules/auth/ui/github-login-button';

export function RegisterForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const form = useRegisterForm();
  const { onSubmit, isLoading, error, isError } = useRegisterSubmit();

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="p-6 md:p-8"
              data-testid="register-form"
            >
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Створити обліковий запис</h1>
                  <p className="text-balance text-muted-foreground">
                    Приєднуйтесь до GitHub CRM і керуйте своїми проєктами
                  </p>
                </div>

                {isError && (
                  <div className="p-4 border rounded-lg bg-destructive/10 border-destructive/20 flex flex-col gap-1.5 text-sm">
                    <p className="font-medium text-destructive">{error || 'Щось пішло не так'}</p>
                  </div>
                )}

                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ім&rsquo;я</FormLabel>
                        <FormControl>
                          <Input placeholder="Іван Петренко" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Електронна пошта</FormLabel>
                        <FormControl>
                          <Input placeholder="example@mail.com" type="email" required {...field} />
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
                        <FormLabel>Пароль</FormLabel>
                        <FormControl>
                          <Input placeholder="••••••" required type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Підтвердження паролю</FormLabel>
                        <FormControl>
                          <Input placeholder="••••••" required type="password" {...field} />
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
                      Реєстрація...
                    </>
                  ) : (
                    'Зареєструватися'
                  )}
                </Button>

                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 bg-background px-2 text-muted-foreground">
                    Або продовжити з
                  </span>
                </div>

                <GithubLoginButton />

                <div className="text-center text-sm">
                  Вже маєте обліковий запис?{' '}
                  <Link href="/login" className="underline underline-offset-4">
                    Увійти
                  </Link>
                </div>
              </div>
            </form>
          </Form>

          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-primary/90 flex flex-col items-center justify-center text-white p-6 mr-6 rounded-xl">
              <Github className="h-20 w-20 mb-4" />
              <h2 className="text-2xl font-bold mb-4">Приєднуйтесь до нас</h2>
              <p className="text-center mb-6">
                Створіть обліковий запис і отримайте доступ до потужних інструментів для керування
                вашими GitHub проєктами.
              </p>
              <div className="grid grid-cols-1 gap-4 w-full">
                <div className="bg-white/10 p-3 rounded">
                  <h3 className="font-medium mb-1">Швидкий старт</h3>
                  <p className="text-sm opacity-90">
                    Авторизуйтесь через GitHub для швидкого доступу
                  </p>
                </div>
                <div className="bg-white/10 p-3 rounded">
                  <h3 className="font-medium mb-1">Безкоштовно</h3>
                  <p className="text-sm opacity-90">
                    Отримайте доступ до всіх функцій без прихованих платежів
                  </p>
                </div>
                <div className="bg-white/10 p-3 rounded">
                  <h3 className="font-medium mb-1">Приватність</h3>
                  <p className="text-sm opacity-90">
                    Ми цінуємо вашу конфіденційність і безпеку ваших даних
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        Натискаючи &quot;Зареєструватися&quot;, ви погоджуєтесь з нашими <a href="#">Умовами використання</a>{' '}
        та <a href="#">Політикою конфіденційності</a>.
      </div>
    </div>
  );
}
