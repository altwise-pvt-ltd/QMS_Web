import { Loader2 } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Spinner = ({ className, size = 18, ...props }) => {
  return (
    <Loader2 
      className={cn("animate-spin text-current", className)} 
      size={size} 
      {...props} 
    />
  );
};

export { Spinner };
