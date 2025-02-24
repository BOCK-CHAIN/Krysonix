import { AlertCircle, Users, Play, Loader2Icon, Loader2 } from "lucide-react";
import Loader from "~/Components/ui/loader";
import { cn } from "~/lib/utils";

export function ErrorMessage({
  children,
  message,
  description,
  icon,
}: {
  children?: React.ReactNode;
  icon?: string;
  message: string;
  description?: string;
}) {
  const IconSelection = ({
    icon,
    className,
  }: {
    icon?: string;
    className: string;
  }) => {
    if (icon === "GreenHorn") {
      return <AlertCircle className={className} />;
    } else if (icon === "GreenPeople") {
      return <Users className={className} />;
    } else {
      return <Play className={className} />;
    }
  };

  return (
    <div className="relative flex flex-col h-full w-full items-center justify-center gap-2 text-center">
      <IconSelection className="h-8 w-8 text-red-500" icon={icon} />
      <h1 className="text-2xl font-semibold text-white">{message}</h1>
      <p className="max-w-xs text-gray-400">{description}</p>
      {children}
    </div>
  );
}

export function LoadingMessage() {
  return (
    <div className="relative h-screen w-full flex items-center justify-center gap-2 text-center">
      <Loader state color="purple"></Loader>
    </div>
  );
}
