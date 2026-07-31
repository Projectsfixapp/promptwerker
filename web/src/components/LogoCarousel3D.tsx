import { toolLogos } from "@/lib/toolLogos";
import ToolIcon from "./ToolIcon";

// Echtes 3D-Rotations-Karussell: alle Logos als Icon-Badges auf einem Ring
// angeordnet (rotateY + translateZ pro Item), der Ring selbst dreht sich
// langsam und durchgängig per CSS-Animation. Ein statischer Tilt-Wrapper
// kippt den ganzen Ring leicht zum Betrachter, ohne mit der Rotation zu
// kollidieren (zwei verschachtelte 3D-Ebenen statt einer gemeinsamen).
const COUNT = toolLogos.length;

export default function LogoCarousel3D() {
  return (
    <div
      className="relative mx-auto flex h-[280px] items-center justify-center sm:h-[360px] lg:h-[440px]"
      style={{ perspective: 1600 }}
    >
      <div
        className="relative"
        style={{ transformStyle: "preserve-3d", transform: "rotateX(14deg)", width: 1, height: 1 }}
      >
        <div
          className="carousel-ring absolute [--radius:300px] sm:[--radius:400px] lg:[--radius:500px]"
          style={{ transformStyle: "preserve-3d", width: 1, height: 1 }}
        >
          {toolLogos.map((tool, i) => {
            const angle = (360 / COUNT) * i;
            return (
              <div
                key={`${tool.name}-${i}`}
                className="absolute left-0 top-0"
                style={{
                  transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(var(--radius))`,
                }}
              >
                <span
                  className="logo-badge-frost flex h-16 w-16 items-center justify-center rounded-full sm:h-20 sm:w-20 lg:h-24 lg:w-24"
                  title={tool.name}
                >
                  <ToolIcon tool={tool} size={30} />
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
