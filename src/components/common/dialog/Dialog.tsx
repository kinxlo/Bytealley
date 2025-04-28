"use client";

import Image from "next/image";
import { HTMLAttributes, ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { cn } from "~/utils/utils";

interface ReusableDialogProperties extends HTMLAttributes<HTMLDivElement> {
  trigger: ReactNode;
  title?: string;
  img?: string;
  description?: string;
  children?: ReactNode;
  headerClassName?: string;
  wrapperClassName?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ReusableDialog({
  trigger,
  title,
  description,
  children,
  headerClassName,
  wrapperClassName,
  className,
  open,
  img,
  onOpenChange,
}: ReusableDialogProperties) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      {/* Add backdrop filter to the portal container */}
      <div className={cn("fixed inset-0 z-50", open ? "backdrop-blur-sm" : "pointer-events-none")}>
        <DialogContent className={cn("h-full items-center border-default sm:max-w-[425px] md:h-fit", className)}>
          <section>
            <DialogHeader className={cn("h-fit", wrapperClassName)}>
              {img && (
                <Image width={100} height={100} src={img || ""} alt="dangerous" className="h-[100px] w-[100px]" />
              )}
              <DialogTitle className={cn("text-2xl", headerClassName)}>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            {children}
          </section>
        </DialogContent>
      </div>
    </Dialog>
  );
}
