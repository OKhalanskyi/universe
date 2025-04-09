import { PrivateLayout } from '@/modules/auth';
import { ProjectList } from '@/modules/project/ui/project-list';
import { CreateProjectDialog } from '@/modules/project/ui/create-project-dialog';
import { PageHeader } from '@/widgets/page-header';
import { RepositoryList } from '@/modules/repository/ui/repository-list';
import { Separator } from '@/shared/ui/separator';

export default function Home() {
  return (
    <PrivateLayout>
      <div className="mx-auto pt-8 space-y-8">
        <PageHeader
          heading="Проєкти"
          subheading="Управляйте вашими проєктами та пов'язаними репозиторіями."
          actions={<CreateProjectDialog />}
        />

        <ProjectList />

        <Separator />

        <div>
          <RepositoryList showUnassigned={false} />
        </div>
      </div>
    </PrivateLayout>
  );
}
