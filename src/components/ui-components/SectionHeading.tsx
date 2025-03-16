
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  badge?: ReactNode;
  withLine?: boolean;
}

export const SectionHeading = ({
  title,
  subtitle,
  align = "center",
  className,
  titleClassName,
  subtitleClassName,
  badge,
  withLine = false,
}: SectionHeadingProps) => {
  const alignment =
    align === "left"
      ? "text-left"
      : align === "right"
      ? "text-right"
      : "text-center";

  return (
    <div
      className={cn(
        "max-w-3xl mx-auto mb-12",
        alignment,
        className
      )}
    >
      {badge && (
        <div className="mb-4 flex justify-center">
          {badge}
        </div>
      )}
      
      <h2
        className={cn(
          "heading-lg",
          align === "center" && "mx-auto",
          titleClassName
        )}
      >
        {title}
      </h2>
      
      {withLine && (
        <div
          className={cn(
            "h-1 w-20 bg-accent1 rounded-full my-4",
            align === "center" ? "mx-auto" : align === "right" ? "ml-auto" : ""
          )}
        />
      )}
      
      {subtitle && (
        <p
          className={cn(
            "mt-4 body-lg text-muted-foreground",
            subtitleClassName
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
