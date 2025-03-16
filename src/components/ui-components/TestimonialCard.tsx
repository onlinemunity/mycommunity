
import { cn } from "@/lib/utils";
import { StarIcon } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  author: string;
  role?: string;
  avatar?: string;
  rating?: number;
  className?: string;
  animated?: boolean;
  delay?: number;
}

export const TestimonialCard = ({
  quote,
  author,
  role,
  avatar,
  rating = 5,
  className,
  animated = true,
  delay = 0,
}: TestimonialCardProps) => {
  return (
    <div
      className={cn(
        "glassmorphism p-6 rounded-xl flex flex-col",
        animated && "animate-scale-in",
        className
      )}
      style={animated ? { animationDelay: `${delay}ms` } : {}}
    >
      {rating > 0 && (
        <div className="flex mb-4">
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              className={cn(
                "h-4 w-4 mr-1",
                i < rating ? "text-accent1 fill-accent1" : "text-metal"
              )}
            />
          ))}
        </div>
      )}

      <blockquote className="flex-1 mb-6 text-foreground/90 italic">
        "{quote}"
      </blockquote>

      <div className="flex items-center">
        {avatar ? (
          <div className="mr-3 h-10 w-10 rounded-full overflow-hidden">
            <img
              src={avatar}
              alt={author}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="mr-3 h-10 w-10 rounded-full bg-metal-medium flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {author.charAt(0)}
            </span>
          </div>
        )}

        <div>
          <div className="font-medium">{author}</div>
          {role && <div className="text-sm text-muted-foreground">{role}</div>}
        </div>
      </div>
    </div>
  );
};
