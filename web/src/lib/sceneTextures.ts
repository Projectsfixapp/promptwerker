import * as THREE from "three";
import type { ToolLogo } from "./toolLogos";

/* Alle Texturen der Zauberring-Szene werden zur Laufzeit auf Canvas
   gezeichnet statt als Bilddateien geladen. Grund: keine zusätzlichen
   HTTP-Anfragen und keine Abhängigkeit von Fremd-Assets für Rauch und
   Licht — die 150 Freisteller-Frames sind schon Ladelast genug. */

/** Weicher radialer Verlauf — Basis für Strahler-Schein und Rauchkern. */
export function makeGlowTexture(innen = 0.0, aussen = 0.5): THREE.CanvasTexture {
  const groesse = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = groesse;
  const ctx = canvas.getContext("2d")!;

  const verlauf = ctx.createRadialGradient(
    groesse / 2,
    groesse / 2,
    groesse * innen,
    groesse / 2,
    groesse / 2,
    groesse * aussen
  );
  verlauf.addColorStop(0, "rgba(255,255,255,1)");
  verlauf.addColorStop(0.35, "rgba(255,255,255,0.42)");
  verlauf.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = verlauf;
  ctx.fillRect(0, 0, groesse, groesse);

  const textur = new THREE.CanvasTexture(canvas);
  textur.colorSpace = THREE.SRGBColorSpace;
  return textur;
}

/* Werterauschen mit fester Permutation: bewusst kein Math.random() im
   Renderpfad, damit derselbe Startwert immer dieselbe Wolke ergibt und
   Rauchschwaden zwischen Reloads nicht springen. */
function pseudoZufall(x: number, y: number, saat: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7 + saat * 74.7) * 43758.5453;
  return n - Math.floor(n);
}

function glatt(t: number): number {
  return t * t * (3 - 2 * t);
}

function wertRauschen(x: number, y: number, saat: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = glatt(x - xi);
  const yf = glatt(y - yi);

  const a = pseudoZufall(xi, yi, saat);
  const b = pseudoZufall(xi + 1, yi, saat);
  const c = pseudoZufall(xi, yi + 1, saat);
  const d = pseudoZufall(xi + 1, yi + 1, saat);

  return (a + (b - a) * xf) * (1 - yf) + (c + (d - c) * xf) * yf;
}

/** Geschichtetes Rauschen (fBm) mit radialem Abfall — eine Nebelschwade. */
export function makeSmokeTexture(saat: number): THREE.CanvasTexture {
  const groesse = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = groesse;
  const ctx = canvas.getContext("2d")!;
  const bild = ctx.createImageData(groesse, groesse);

  for (let y = 0; y < groesse; y++) {
    for (let x = 0; x < groesse; x++) {
      let wert = 0;
      let amplitude = 0.5;
      let frequenz = 3.5;
      for (let oktave = 0; oktave < 5; oktave++) {
        wert += wertRauschen((x / groesse) * frequenz, (y / groesse) * frequenz, saat + oktave) * amplitude;
        amplitude *= 0.5;
        frequenz *= 2.1;
      }

      // Radial ausblenden, damit die Schwade keine sichtbaren Kanten hat
      const dx = x / groesse - 0.5;
      const dy = y / groesse - 0.5;
      const abstand = Math.sqrt(dx * dx + dy * dy) * 2;
      const rand = Math.max(0, 1 - abstand);
      const alpha = Math.pow(Math.max(0, wert) * rand * rand, 1.5);

      const i = (y * groesse + x) * 4;
      bild.data[i] = 210;
      bild.data[i + 1] = 226;
      bild.data[i + 2] = 255;
      bild.data[i + 3] = Math.min(255, alpha * 320);
    }
  }

  ctx.putImageData(bild, 0, 0);
  const textur = new THREE.CanvasTexture(canvas);
  textur.colorSpace = THREE.SRGBColorSpace;
  return textur;
}

/* Ein Logo-Badge als Textur: mattierte Glasscheibe mit Icon darin —
   dieselbe Optik wie .logo-badge-frost im CSS-Karussell, damit die Szene
   nicht wie ein Fremdkörper wirkt. */
export async function makeBadgeTexture(tool: ToolLogo): Promise<THREE.CanvasTexture> {
  const groesse = 160;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = groesse;
  const ctx = canvas.getContext("2d")!;
  const mitte = groesse / 2;
  const radius = groesse * 0.44;

  // Glasscheibe
  const glas = ctx.createLinearGradient(0, 0, groesse, groesse);
  glas.addColorStop(0, "rgba(255,255,255,0.96)");
  glas.addColorStop(0.55, "rgba(214,228,250,0.88)");
  glas.addColorStop(1, "rgba(255,255,255,0.94)");
  ctx.beginPath();
  ctx.arc(mitte, mitte, radius, 0, Math.PI * 2);
  ctx.fillStyle = glas;
  ctx.fill();
  ctx.lineWidth = groesse * 0.018;
  ctx.strokeStyle = "rgba(255,255,255,0.85)";
  ctx.stroke();

  const iconGroesse = groesse * 0.46;
  const iconOben = mitte - iconGroesse / 2;

  if (tool.kind === "path") {
    ctx.save();
    ctx.translate(iconOben, iconOben);
    ctx.scale(iconGroesse / 24, iconGroesse / 24); // simple-icons nutzen viewBox 0 0 24 24
    ctx.fillStyle = tool.hex;
    ctx.fill(new Path2D(tool.path));
    ctx.restore();
  } else if (tool.kind === "initial") {
    ctx.beginPath();
    ctx.arc(mitte, mitte, iconGroesse * 0.62, 0, Math.PI * 2);
    ctx.fillStyle = tool.hex;
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${Math.round(groesse * 0.26)}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(tool.letter, mitte, mitte + groesse * 0.01);
  } else {
    await new Promise<void>((fertig) => {
      const bild = new Image();
      bild.onload = () => {
        // Seitenverhältnis wahren, sonst werden Wortmarken gestaucht
        const faktor = Math.min(iconGroesse / bild.width, iconGroesse / bild.height);
        const b = bild.width * faktor;
        const h = bild.height * faktor;
        ctx.drawImage(bild, mitte - b / 2, mitte - h / 2, b, h);
        fertig();
      };
      bild.onerror = () => fertig();
      bild.src = tool.src;
    });
  }

  const textur = new THREE.CanvasTexture(canvas);
  textur.colorSpace = THREE.SRGBColorSpace;
  textur.anisotropy = 4;
  return textur;
}
