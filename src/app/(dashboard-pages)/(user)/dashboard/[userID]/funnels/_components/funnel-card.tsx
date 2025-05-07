"use client";

import { Eye, MinusCircleIcon, MoreVertical, Pencil, Settings, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { BlurImage } from "~/components/miscellaneous/blur-image";
import { LoadingSpinner } from "~/components/miscellaneous/loading-spinner";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { FunnelService } from "~/features/funnel";
import { useSession } from "~/hooks/use-session";
import { useAppDispatch } from "~/store";
import { setTemplate } from "~/store/features/template/template-slice";
import { Toast } from "~/utils/notificationManager";
import { cn, formatDate, formatTime } from "~/utils/utils";

interface FunnelCardProperties {
  template: IFunnel;
  service: FunnelService;
}

export const FunnelCard = ({ template, service }: FunnelCardProperties) => {
  const [isDeletePending, startDeleteTransition] = useTransition();
  const [isDraftPending, startDraftTransition] = useTransition();
  // const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { user } = useSession();
  const dispatch = useAppDispatch();

  const { title, thumbnail, created_at, status, url, id } = template;

  const handleDelete = () => {
    startDeleteTransition(async () => {
      const response = await service.deleteFunnel(id);
      if (response) {
        Toast.getInstance().showToast({
          title: `Funnel Status`,
          description: `Funnel ${response.data.title} has been deleted successfully!`,
          variant: "warning",
        });
        router.push(`/dashboard/${user?.id}/funnels?tab=deleted`);
      }
    });
  };

  const handlePreview = () => {
    window.open(url, "_blank");
  };

  const handleEdit = () => {
    dispatch(setTemplate(template?.template as string));
    router.push(`/dashboard/${user?.id}/funnels/editor?funnel-title=${title}&funnelID=${id}`);
  };

  const handleReturnToDraft = () => {
    startDraftTransition(async () => {
      const response = await service.updateFunnel({ ...template, status: `draft` });
      if (response) {
        Toast.getInstance().showToast({
          title: `Funnel Status`,
          description: `Funnel ${response.data.title} has been moved to draft successfully!`,
          variant: "default",
        });
        router.push(`/dashboard/${user?.id}/funnels?tab=drafts`);
      }
    });
  };

  return (
    <div className="max-w-[450px] rounded-lg border border-gray-200 p-6">
      <Card className="h-[150px] overflow-hidden rounded-md bg-purple-200">
        <BlurImage
          src={typeof thumbnail === "string" ? thumbnail : `/images/question_mark.png`}
          alt="template"
          width={419}
          height={150}
          className="h-full w-full object-cover"
        />
      </Card>
      <div className="my-3 flex items-center justify-between font-bold">
        <div>
          <p className="text-lg">{title}</p>
          <div className="flex items-center text-sm text-gray-400">
            <span>{formatDate(created_at)}</span>
            <span className="mx-1">•</span>
            <span>{formatTime(created_at)}</span>
          </div>
        </div>
        <DropdownActionDraft
          onReturn={handleReturnToDraft}
          onEdit={handleEdit}
          onPreview={handlePreview}
          onDelete={handleDelete}
          templateID={id}
          status={status}
          loading={{ isDeletePending, isDraftPending }}
        />
      </div>
      <Badge
        className={cn(
          "rounded-sm",
          status === "draft" && "bg-low-warning text-high-warning",
          status === "published" && "bg-low-success text-mid-success",
          status === "deleted" && "bg-low-danger text-mid-danger",
        )}
      >
        {status}
      </Badge>
    </div>
  );
};

interface DropdownActionDraftProperties {
  templateID?: string;
  onEdit: () => void;
  onPreview: () => void;
  onDelete: () => void;
  onReturn: () => void;
  status: string;
  loading: {
    isDeletePending: boolean;
    isDraftPending: boolean;
  };
}

const DropdownActionDraft = ({
  onEdit,
  onPreview,
  onDelete,
  onReturn,
  loading,
  status,
  templateID,
}: DropdownActionDraftProperties) => {
  const { user } = useSession();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={loading.isDeletePending || loading.isDraftPending} asChild>
        <Button variant="ghost" size="icon">
          {loading.isDeletePending || loading.isDraftPending ? (
            <LoadingSpinner />
          ) : (
            <MoreVertical className="h-5 w-5" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {status === `draft` && (
          <>
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Edit Funnel Template</span>
            </DropdownMenuItem>
            <Link href={`/dashboard/${user?.id}/funnels/settings?funnelID=${templateID}`} passHref>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem onClick={onDelete} className="text-red-500">
              <Trash className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </>
        )}
        {status === `published` && (
          <>
            <DropdownMenuItem onClick={onPreview}>
              <Eye className="mr-2 h-4 w-4" />
              <span>Preview</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onReturn}>
              <MinusCircleIcon className="mr-2 h-4 w-4" />
              <span>Return To Draft</span>
            </DropdownMenuItem>
          </>
        )}
        {status === `deleted` && (
          <>
            <DropdownMenuItem onClick={onPreview}>
              <Eye className="mr-2 h-4 w-4" />
              <span>Preview</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onReturn}>
              <MinusCircleIcon className="mr-2 h-4 w-4" />
              <span>Return To Draft</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FunnelCard;
