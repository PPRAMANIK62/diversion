import Container from "@/components/ui/container";
import MagicBadge from "@/components/ui/magic-badge";
import { PERKS } from "@/constants/perks";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

const Perks = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center py-12 md:py-16 lg:py-24">
      <Container>
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <MagicBadge title="Perks" />
          <h2 className="font-heading mt-6 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-4xl font-medium !leading-snug text-transparent md:text-4xl lg:text-5xl">
            Discover the benefits
          </h2>
          <p className="text-accent-foreground/80 mt-6 text-center text-base md:text-lg">
            Explore the powerful features and advantages that Luro offer to help
            you grow your social media presence
          </p>
        </div>
      </Container>
      <Container>
        <div className="mt-16 w-full">
          <div className="relative grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {PERKS?.map((perk, index) => (
              <Perk key={index} index={index} {...perk} />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};

const Perk = ({
  title,
  description,
  icon: Icon,
  index,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "group/feature relative flex transform-gpu flex-col border-neutral-800 py-10 lg:border-r",
        (index === 0 || index === 3) && "lg:border-l",
        index < 3 && "lg:border-b",
      )}
    >
      {index < 3 && (
        <div className="from-neutral-80 pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-t from-violet-950/25 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100" />
      )}
      {index >= 3 && (
        <div className="from-neutral-80 pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-b from-violet-950/25 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100" />
      )}
      <div className="flex w-full transform-gpu flex-col transition-all duration-300 group-hover/feature:-translate-y-1">
        <div className="relative z-10 mb-4 px-10">
          <Icon
            strokeWidth={1.3}
            className="group-hover/feature:text-foreground h-10 w-10 origin-left transform-gpu text-neutral-500 transition-all duration-300 ease-in-out group-hover/feature:scale-75"
          />
        </div>
        <div className="font-heading relative z-10 mb-2 px-10 text-lg font-medium">
          <div className="absolute -inset-y-0 left-0 h-6 w-1 origin-center rounded-br-full rounded-tr-full bg-neutral-700 transition-all duration-500 group-hover/feature:h-8 group-hover/feature:bg-violet-600" />
          <span className="group-hover/feature:-translate-y- group-hover/feature:text- heading inline-block transition duration-500">
            {title}
          </span>
        </div>
        <p className="relative z-10 max-w-xs px-10 text-sm text-neutral-300">
          {description}
        </p>
      </div>
    </div>
  );
};

export default Perks;
