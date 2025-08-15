import { CreateNoteButton } from "@/components/create-note-button";
import NoteCard from "@/components/note-card";
import { PageWrapper } from "@/components/page-wrapper";
import { getNotebookById } from "@/server/notebooks";

type Params = Promise<{
  notebookId: string;
}>;

export default async function NotebookPage({ params }: { params: Params }) {
  const { notebookId } = await params;
  const { notebook } = await getNotebookById(notebookId);

  return (
    <PageWrapper
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        {
          label: notebook?.name ?? "Notebook",
          href: `/dashboard/notebook/${notebookId}`,
        },
      ]}
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            {notebook?.name}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {notebook?.notes?.length || 0} notes in this notebook
          </p>
        </div>
        <CreateNoteButton notebookId={notebookId} />
      </div>

      {/* Notes Grid */}
      
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {notebook?.notes?.map((note) => (
            <div
              key={note.id}
              className="transition-transform transform hover:scale-105"
            >
              <NoteCard note={note} />
            </div>
          ))}
        </div>
    </PageWrapper>
  );
}
