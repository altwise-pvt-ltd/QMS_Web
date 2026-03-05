import React from "react";

/**
 * Skeleton loader component for providing visual feedback during data fetching.
 * Supports different variants, dimensions, and custom classes.
 *
 * @param {string} variant - 'text', 'circular', or 'rectangular' (default)
 * @param {string|number} width - Width of the skeleton (Tailwind class or CSS value)
 * @param {string|number} height - Height of the skeleton (Tailwind class or CSS value)
 * @param {string} className - Additional CSS classes
 */
const Skeleton = ({
  variant = "rectangular",
  width,
  height,
  className = "",
}) => {
  const baseClasses = "animate-pulse bg-slate-200 relative overflow-hidden";

  const variantClasses = {
    text: "rounded-md h-4 w-full mb-2",
    circular: "rounded-full",
    rectangular: "rounded-2xl",
  }[variant];

  const style = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses} ${className}`}
      style={style}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
};

export default Skeleton;
