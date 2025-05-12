"use client";

// import Image from "next/image";
// import { HTMLAttributes, ReactNode } from "react";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "~/components/ui/dialog";
// import { cn } from "~/utils/utils";

// interface ReusableDialogProperties extends HTMLAttributes<HTMLDivElement> {
//   trigger: ReactNode;
//   title?: string;
//   img?: string;
//   description?: string;
//   children?: ReactNode;
//   headerClassName?: string;
//   wrapperClassName?: string;
//   open?: boolean;
//   onOpenChange?: (open: boolean) => void;
// }

// export function ReusableDialog({
//   trigger,
//   title,
//   description,
//   children,
//   headerClassName,
//   wrapperClassName,
//   className,
//   open,
//   img,
//   onOpenChange,
// }: ReusableDialogProperties) {
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogTrigger asChild>{trigger}</DialogTrigger>
//       {/* Add backdrop filter to the portal container */}
//       <div className={cn("fixed inset-0 z-50", open ? "backdrop-blur-sm" : "pointer-events-none")}>
//         <DialogContent className={cn("h-full items-center border-default sm:max-w-[425px] md:h-fit", className)}>
//           <section>
//             <DialogHeader className={cn("h-fit", wrapperClassName)}>
//               {img && (
//                 <Image width={100} height={100} src={img || ""} alt="dangerous" className="h-[100px] w-[100px]" />
//               )}
//               <DialogTitle className={cn("text-2xl", headerClassName)}>{title}</DialogTitle>
//               <DialogDescription>{description}</DialogDescription>
//             </DialogHeader>
//             {children}
//           </section>
//         </DialogContent>
//       </div>
//     </Dialog>
//   );
// }
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
  size?: "sm" | "md" | "lg" | "xl" | "full"; // Add size prop
  customSize?: string; // For completely custom dimensions
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
  size = "md", // Default size
  customSize, // Optional custom size
}: ReusableDialogProperties) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <div className={cn("fixed inset-0 z-50", open ? "backdrop-blur-sm" : "pointer-events-none")}>
        <DialogContent
          className={cn(
            "h-full items-center border-default sm:max-w-[425px] md:h-fit",
            className,
            {
              "sm:max-w-[425px]": size === "sm",
              "sm:max-w-[600px]": size === "md",
              "sm:max-w-[800px]": size === "lg",
              "sm:max-w-[1200px]": size === "xl",
              "sm:h-[95vh] sm:max-w-[95vw]": size === "full",
            },
            customSize,
          )}
        >
          <section className="h-full w-full">
            <DialogHeader className={cn("h-fit", wrapperClassName)}>
              {img && (
                <Image width={100} height={100} src={img || ""} alt="dangerous" className="h-[100px] w-[100px]" />
              )}
              <DialogTitle className={cn("text-2xl", headerClassName)}>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-auto p-2">{children}</div>
          </section>
        </DialogContent>
      </div>
    </Dialog>
  );
}
