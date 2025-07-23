'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MoreHorizontal, Edit, Copy, Trash2, Mail, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ActionButtonsProps {
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onSend?: () => void;
  deleteTitle?: string;
  deleteDescription?: string;
  sendLabel?: string;
}

export function ActionButtons({
  onEdit,
  onDuplicate,
  onDelete,
  onSend,
  deleteTitle = "Delete Item",
  deleteDescription = "Are you sure you want to delete this item? This action cannot be undone.",
  sendLabel = "Send Email"
}: ActionButtonsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    onDelete?.();
    setShowDeleteDialog(false);
    toast({
      title: "Deleted",
      description: "Item has been deleted successfully."
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {onEdit && (
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
          )}
          {onDuplicate && (
            <DropdownMenuItem onClick={onDuplicate}>
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
          )}
          {onSend && (
            <DropdownMenuItem onClick={onSend}>
              <Send className="mr-2 h-4 w-4" />
              {sendLabel}
            </DropdownMenuItem>
          )}
          {(onEdit || onDuplicate || onSend) && onDelete && <DropdownMenuSeparator />}
          {onDelete && (
            <DropdownMenuItem 
              onClick={() => setShowDeleteDialog(true)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{deleteTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}