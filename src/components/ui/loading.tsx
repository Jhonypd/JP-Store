import { RefreshCcwIcon } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex h-full w-full">
      <RefreshCcwIcon size={50} className="animate-spin text-[primary]" />
    </div>
  );
};

export default Loading;
