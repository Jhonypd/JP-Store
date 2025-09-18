import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CardsItemProps {
  title: string;
  description?: string;
  value?: string;
  dateBase?: string;
}

const CardsItem = ({ title, description, value, dateBase }: CardsItemProps) => {
  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 p-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
      <Card className="@container/card">
        <CardHeader>
          <div className="line-clamp-1 flex gap-2 font-medium">{title}</div>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {value}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <CardDescription>{description}</CardDescription>
          <div className="text-muted-foreground">
            <p>Período: {dateBase}</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CardsItem;
