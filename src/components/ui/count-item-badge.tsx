import { Badge, BadgeProps } from "./badge";
import { twMerge } from "tailwind-merge";

const CounterItemBadge = ({ children, className, ...props }: BadgeProps) => {
  return (
    <Badge
      {...props}
      className={twMerge(
        "relative h-5 w-5 rounded-full bg-secondary p-1 ",
        className,
      )}
    >
      {children}
    </Badge>
  );
};

export default CounterItemBadge;
