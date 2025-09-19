import { RefreshCcwIcon } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex h-screen w-full flex-1 flex-col items-center justify-center gap-4">
      <div className="flex h-20 w-20 animate-spin items-center justify-center rounded-full border-4 border-transparent border-t-secondary text-4xl text-blue-400">
        <div className="flex h-16 w-16 animate-spin items-center justify-center rounded-full border-4 border-transparent border-t-primary text-2xl text-red-400"></div>
      </div>
    </div>
  );
};

export default Loading;
