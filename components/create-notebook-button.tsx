"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";

type ButtonProps = React.ComponentProps<typeof Button>;
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createNotebook } from "@/server/notebooks";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useState, ReactNode } from "react";
import { Loader2, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
});

interface CreateNotebookButtonProps extends ButtonProps {
  children?: ReactNode;
}

export const CreateNotebookButton = ({
  children,
  ...props
}: CreateNotebookButtonProps) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const userId = (await authClient.getSession()).data?.user.id;

      if (!userId) {
        toast.error("You must be logged in to create a notebook");
        return;
      }

      const response = await createNotebook({
        ...values,
        userId,
      });
      
      if (response.success) {
        form.reset();
        toast.success("Notebook created successfully");
        router.refresh();
        setIsOpen(false);
      } else {
        toast.error(response.message || "Failed to create notebook");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button {...props}>
          {children || (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Notebook
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Notebook</DialogTitle>
          <DialogDescription>
            Organize your notes and code snippets in a new notebook.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notebook Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Project Ideas, Learning Notes" 
                      {...field} 
                      disabled={isLoading}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
                size="sm"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                size="sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Notebook'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
