import { useProjects } from '@/modules/project/model/use-projects';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Button } from '@/shared/ui/button';
import { Loader2 } from 'lucide-react';

const repositorySchema = z.object({
  path: z.string().regex(/^[a-zA-Z0-9\-]+\/[a-zA-Z0-9\-_.]+$/, {
    message: 'Шлях повинен бути у форматі власник/назва-репозиторію',
  }),
  projectId: z.string().optional(),
});

export type RepositoryFormValues = z.infer<typeof repositorySchema>;

interface RepositoryFormProps {
  defaultValues?: RepositoryFormValues;
  onSubmit: (values: RepositoryFormValues) => void;
  isLoading?: boolean;
  submitText?: string;
}

export function RepositoryForm({
  defaultValues = {
    path: '',
  },
  onSubmit,
  isLoading = false,
  submitText = 'Зберегти',
}: RepositoryFormProps) {
  const { data: projects } = useProjects();
  const form = useForm<RepositoryFormValues>({
    resolver: zodResolver(repositorySchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="path"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Шлях до репозиторію</FormLabel>
              <FormControl>
                <Input placeholder="власник/назва-репозиторію" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="projectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Проєкт (необов&#39;язково)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Виберіть проєкт" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {projects?.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
