/* Laden der freigestellten Dennis-Sequenz.

   150 Einzelbilder statt eines Videos, weil sich `video.currentTime` nicht
   zuverlässig ruckelfrei am Scrollrad ziehen lässt — Browser springen beim
   Seeken auf Keyframes. Einzelbilder als ImageBitmap sind sofort
   zeichenbar und machen das Scrubbing exakt.

   Zwei Auflösungen: 720 px für Desktop, 420 px für schmale Geräte und
   sparsame Verbindungen. */

export const FRAME_ANZAHL = 150;

type Verbindung = { saveData?: boolean; effectiveType?: string };

export function waehleSequenz(): { pfad: string; breite: number } {
  const schmal = window.matchMedia("(max-width: 900px)").matches;
  const verbindung = (
    navigator as Navigator & { connection?: Verbindung }
  ).connection;
  const sparsam =
    verbindung?.saveData === true ||
    (verbindung?.effectiveType ? /2g/.test(verbindung.effectiveType) : false);

  return schmal || sparsam
    ? { pfad: "/dennis-sequenz/mobil", breite: 420 }
    : { pfad: "/dennis-sequenz/desktop", breite: 720 };
}

/** Lädt alle Frames in Blöcken und meldet den Fortschritt (0..1). */
export async function ladeSequenz(
  pfad: string,
  beiFortschritt: (anteil: number) => void,
  abbruch: AbortSignal
): Promise<ImageBitmap[]> {
  const frames = new Array<ImageBitmap>(FRAME_ANZAHL);
  const BLOCK = 8; // gleichzeitige Anfragen — mehr bringt nichts, blockiert aber andere Assets
  let fertig = 0;

  for (let start = 0; start < FRAME_ANZAHL; start += BLOCK) {
    if (abbruch.aborted) throw new DOMException("abgebrochen", "AbortError");

    const block = Array.from(
      { length: Math.min(BLOCK, FRAME_ANZAHL - start) },
      (_, versatz) => start + versatz
    );

    await Promise.all(
      block.map(async (i) => {
        const name = String(i).padStart(3, "0");
        const antwort = await fetch(`${pfad}/${name}.webp`, { signal: abbruch });
        if (!antwort.ok) throw new Error(`Frame ${name} fehlt (${antwort.status})`);
        // Bewusst ohne `imageOrientation`: die Ausrichtung wird in der Szene
        // über die UV-Koordinaten der Fläche geregelt (siehe MagicRingScene),
        // weil weder three.js' `flipY` noch `imageOrientation` bei
        // ImageBitmap-Texturen verlässlich greifen.
        frames[i] = await createImageBitmap(await antwort.blob());
        fertig += 1;
        beiFortschritt(fertig / FRAME_ANZAHL);
      })
    );
  }

  return frames;
}
