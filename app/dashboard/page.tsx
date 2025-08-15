import { CreateNotebookButton } from "@/components/create-notebook-button";
import NotebookCard from "@/components/notebook-card";
import { PageWrapper } from "@/components/page-wrapper";
import { getNotebooks } from "@/server/notebooks";
import { PlusCircle, Notebook as NotebookIcon } from "lucide-react";
import { Suspense } from "react";
import DashboardLoading from "./loading";

// This component is wrapped in a Suspense boundary in the layout
async function NotebooksList() {
  const notebooks = await getNotebooks();
  const hasNotebooks = notebooks.success && notebooks.notebooks && notebooks.notebooks.length > 0;

  if (!notebooks.success) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <div className="flex flex-col items-center space-y-2">
          <NotebookIcon className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Unable to load notebooks. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  if (!hasNotebooks) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted bg-muted/20 p-8 text-center transition-colors hover:border-primary/30">
        <NotebookIcon className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No notebooks yet</h3>
        <p className="mb-6 mt-2 max-w-md text-sm text-muted-foreground">
          Create your first notebook to start organizing your notes and code
          snippets
        </p>
        <CreateNotebookButton>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Notebook
        </CreateNotebookButton>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {notebooks.notebooks.map((notebook) => (
        <NotebookCard key={notebook.id} notebook={notebook} />
      ))}
    </div>
  );
}

export default async function Page() {
  const notebooks = await getNotebooks();
  const hasNotebooks = notebooks.success && notebooks.notebooks && notebooks.notebooks.length > 0;

  return (
    <PageWrapper breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }]}>
      <div className="mb-8 flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            My Notebooks
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Organize your notes and code snippets in one place
          </p>
        </div>
        
        {hasNotebooks && (
          <CreateNotebookButton className="mt-4 sm:mt-0">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Notebook
          </CreateNotebookButton>
        )}
      </div>

      <Suspense fallback={<DashboardLoading />}>
        <NotebooksList />
      </Suspense>
    </PageWrapper>
  );
}
