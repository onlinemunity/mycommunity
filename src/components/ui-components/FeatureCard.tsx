
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
  iconClassName?: string;
  animated?: boolean;
  delay?: number;
}

export const FeatureCard = ({
  icon,
  title,
  description,
  className,
  iconClassName,
  animated = true,
  delay = 0,
}: FeatureCardProps) => {
  return (
    <div
      className={cn(
        "glassmorphism p-6 rounded-xl",
        animated && "animate-scale-in",
        className
      )}
      style={animated ? { animationDelay: `${delay}ms` } : {}}
    >
      <div
        className={cn(
          "w-12 h-12 flex items-center justify-center rounded-lg bg-accent1/10 text-accent1 mb-4",
          iconClassName
        )}
      >
        {icon}
      </div>
      <h3 className="heading-sm mb-2">{title}</h3>
      <p className="body-base text-muted-foreground">{description}</p>
    </div>
  );
};
