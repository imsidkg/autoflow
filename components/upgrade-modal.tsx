"use client";

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
} from "@/components/ui/alert-dialog";

import { authClient } from "@/lib/auth-client";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UpgradeModal = ({ open, onOpenChange }: UpgradeModalProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Upgrade to pro</AlertDialogTitle>
          <AlertDialogDescription>
            You need an active subscription to perform this action. Upgrade to
            Pro to unlock all features
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {/* todo: add polar integration , it will also be added in the sidebar
           */}
          {/* <AlertDialogAction onClick={() => authClient.checkout({slug:'pro'})}>Continue</AlertDialogAction>  */}
          <AlertDialogAction>Upgrade Now</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
