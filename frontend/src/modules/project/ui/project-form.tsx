import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Button } from '@/shared/ui/button';
import { Loader2 } from 'lucide-react';

const projectSchema = z.object({
  name: z
    .string()
    .min(3, 'Назва повинна мати мінімум 3 символи')
    .max(100, 'Назва не може перевищувати 100 символів'),
  description: z.string().max(500, 'Опис не може перевищувати 500 символів').optional(),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  defaultValues?: ProjectFormValues;
  onSubmit: (values: ProjectFormValues) => void;
  isLoading?: boolean;
  submitText?: string;
}

export function ProjectForm({
  defaultValues = {
    name: '',
    description: '',
  },
  onSubmit,
  isLoading = false,
  submitText = 'Зберегти',
}: ProjectFormProps) {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Назва проєкту</FormLabel>
              <FormControl>
                <Input placeholder="Введіть назву проєкту" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Опис</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Опишіть ваш проєкт (необов'язково)"
                  className="min-h-32 resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Завантаження...
            </>
          ) : (
            submitText
          )}
        </Button>
      </form>
    </Form>
  );
}
