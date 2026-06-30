"use client";

import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type AuthRequiredDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loginHref?: string;
};

export default function AuthRequiredDialog({
  open,
  onOpenChange,
  loginHref = "/login?callbackUrl=%2Fdashboard%2Fnew-scenario",
}: AuthRequiredDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px] border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-950">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-center text-xl font-semibold text-slate-900 dark:text-white">
            Login required
          </DialogTitle>
          <DialogDescription className="text-center text-sm leading-6 text-slate-500 dark:text-slate-400">
            You need to log in before starting a scenario analysis.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
          <Button
            type="button"
            variant="outline"
            className="min-w-[110px]"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            asChild
            className="min-w-[110px] bg-[#0f172a] text-white hover:bg-[#0f172a]/90"
          >
            <Link href={loginHref}>Login</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
