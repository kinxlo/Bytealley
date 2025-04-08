import { BlurImage } from "~/components/miscellaneous/blur-image";
import { Card, CardContent } from "~/components/ui/card";
import { cn } from "~/utils/utils";

export const StepCard: React.FC<StepCardProperties> = ({ title, description, imageSrc, className }) => {
  return (
    <Card className={cn(`shadow-neob h-full rounded-2xl border-black bg-white`, className)}>
      <CardContent className="flex h-full flex-col justify-between p-6">
        <div>
          <h4 className="text-h4 sm:text-h4-sm md:text-h4-md mb-2">{title}</h4>
          <p className="text-mid-grey-III">{description}</p>
        </div>
        {imageSrc && (
          <div className="flex justify-end">
            <BlurImage
              src={imageSrc || ""}
              alt={title}
              width={150}
              height={150}
              className="h-auto w-auto object-contain"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
