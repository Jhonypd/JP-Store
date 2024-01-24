import { Badge, BadgeProps } from "./badge";
import { twMerge } from "tailwind-merge";

const CounterItemBadge = ({ children, className, ...props }: BadgeProps) => {
  return (
    <Badge
      {...props}
      className={twMerge(" rounded-full bg-secondary p-1 ", className)}
    >
      {children}
    </Badge>
  );
};

export default CounterItemBadge;
