'use client';

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";
import { Button } from "@/shared/ui/button";
import { Trash2 } from "lucide-react";
import { useDeleteRepository } from "../model/use-delete-repository";

interface DeleteRepositoryDialogProps {
  repositoryId: string;
  repositoryName: string;
  trigger?: React.ReactNode;
}

export function DeleteRepositoryDialog({
                                         repositoryId,
                                         repositoryName,
                                         trigger,
                                       }: DeleteRepositoryDialogProps) {
  const [open, setOpen] = useState(false);
  const { deleteRepository, isLoading } = useDeleteRepository();

  const handleDelete = () => {
    deleteRepository(repositoryId);
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {trigger || (
          <Button variant="destructive" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ви впевнені?</AlertDialogTitle>
          <AlertDialogDescription>
            Ви збираєтеся видалити репозиторій "{repositoryName}" з вашого CRM.
            Сам репозиторій на GitHub не буде видалено.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Скасувати</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? "Видалення..." : "Видалити"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
