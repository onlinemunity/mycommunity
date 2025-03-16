
import { ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingCardProps {
  title: string;
  description: string;
  price: string;
  period: string;
  features: PricingFeature[];
  ctaText: string;
  ctaAction: () => void;
  highlighted?: boolean;
  badge?: ReactNode;
  className?: string;
  animated?: boolean;
  delay?: number;
}

export const PricingCard = ({
  title,
  description,
  price,
  period,
  features,
  ctaText,
  ctaAction,
  highlighted = false,
  badge,
  className,
  animated = true,
  delay = 0,
}: PricingCardProps) => {
  return (
    <div
      className={cn(
        "relative flex flex-col",
        animated && "animate-scale-in",
        className
      )}
      style={animated ? { animationDelay: `${delay}ms` } : {}}
    >
      <div
        className={cn(
          "h-full rounded-xl p-6 border",
          highlighted
            ? "border-accent1/30 shadow-lg shadow-accent1/5"
            : "glassmorphism"
        )}
      >
        {/* Badge if provided */}
        {badge && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            {badge}
          </div>
        )}

        {/* Pricing header */}
        <div className={cn("text-center mb-6", highlighted && "pt-2")}>
          <h3 className="heading-md mb-2">{title}</h3>
          <p className="text-muted-foreground mb-4">{description}</p>
          <div className="flex items-baseline justify-center">
            <span className="text-3xl font-bold">{price}</span>
            <span className="text-sm text-muted-foreground ml-1">
              {period}
            </span>
          </div>
        </div>

        {/* Feature list */}
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li
              key={index}
              className="flex items-start"
            >
              <span
                className={cn(
                  "mr-2 h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                  feature.included
                    ? "bg-accent1/10 text-accent1"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Check className="h-3 w-3" />
              </span>
              <span
                className={cn(
                  feature.included
                    ? "text-foreground/80"
                    : "text-muted-foreground line-through"
                )}
              >
                {feature.text}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <div className="mt-auto">
          <Button
            onClick={ctaAction}
            className={cn(
              "w-full",
              highlighted
                ? "bg-accent1 hover:bg-accent1/90"
                : "bg-secondary hover:bg-secondary/90 text-foreground"
            )}
          >
            {ctaText}
          </Button>
        </div>
      </div>
    </div>
  );
};
