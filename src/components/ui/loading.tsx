import { RefreshCcwIcon } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <RefreshCcwIcon size={50} className="animate-spin text-[primary]" />
    </div>
  );
};

export default Loading;
