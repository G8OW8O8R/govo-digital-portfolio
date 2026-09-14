import { type HTMLAttributes } from "react";

interface ProtectedImageProps extends HTMLAttributes<HTMLDivElement> {
  src: string;
  ariaLabel: string;
  className?: string;
  eager?: boolean;
}

/**
 * Optimised version: uses direct backgroundImage to allow browser-level preloading
 * and parallel fetching, while keeping the visual/interaction protection layer.
 */
export default function ProtectedImage({
  src,
  ariaLabel,
  className = "",
  eager = false,
  style,
  ...props
}: ProtectedImageProps) {
  const block = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
  };

  return (
    <div
      onContextMenu={block}
      onDragStart={block}
      className={`relative overflow-hidden select-none ${className}`}
      style={{
        WebkitUserSelect: "none",
        userSelect: "none",
        WebkitTouchCallout: "none",
        ...style,
      }}
      {...props}
    >
      <img
        src={src}
        alt={ariaLabel}
        draggable={false}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={eager ? "high" : "auto"}
        className="h-full w-full object-cover"
      />
      {/* Transparent overlay intercepts saves/drags on the visual layer */}
      <div
        className="absolute inset-0"
        style={{ background: "transparent" }}
        aria-hidden="true"
      />
    </div>
  );
}
