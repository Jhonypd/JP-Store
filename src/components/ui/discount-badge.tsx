import { ArrowDownIcon } from "lucide-react";
import { Badge, BadgeProps } from "./badge";
import { twMerge } from "tailwind-merge";

const DiscountBadge = ({ children, className, ...props }: BadgeProps) => {
  return (
    <Badge
      {...props}
      className={twMerge(
        "bg-secondary px-2 py-[2px] hover:bg-secondary",
        className,
      )}
    >
      <ArrowDownIcon size={14} />
      {children}%
    </Badge>
  );
};

export default DiscountBadge;
