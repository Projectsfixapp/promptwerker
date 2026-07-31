import type { ToolLogo } from "@/lib/toolLogos";

export default function ToolIcon({ tool, size = 20 }: { tool: ToolLogo; size?: number }) {
  if (tool.kind === "image") {
    return (
      <span
        className="flex shrink-0 items-center justify-center rounded-full bg-white p-1"
        style={{ width: size + 8, height: size + 8 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={tool.src}
          alt={tool.name}
          width={size}
          height={size}
          className="object-contain"
          style={{ width: size, height: size }}
        />
      </span>
    );
  }

  if (tool.kind === "initial") {
    return (
      <span
        className="flex shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
        style={{ width: size + 8, height: size + 8, background: tool.hex }}
        aria-label={tool.name}
      >
        {tool.letter}
      </span>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className="shrink-0"
      role="img"
      aria-label={tool.name}
    >
      <path fill={tool.hex} d={tool.path} />
    </svg>
  );
}
