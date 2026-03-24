const COLOR_MAP: Record<string, string> = {
  ectoplasm: "#05FFA1",
  vampire: "#FF5A8D",
  witchcraft: "#A890FF",
  gold: "#FFB800",
  pip: "#58a6ff",
  toxic: "#00FF41",
};

const COLOR_CYCLE = [
  "ectoplasm",
  "vampire",
  "witchcraft",
  "gold",
  "pip",
  "toxic",
] as const;

export function resolveColor(token: string | undefined, index: number): string {
  if (token && COLOR_MAP[token]) return COLOR_MAP[token];
  if (token && token.startsWith("#")) return token;
  const cycleName = COLOR_CYCLE[index % COLOR_CYCLE.length];
  return COLOR_MAP[cycleName];
}

export { COLOR_MAP, COLOR_CYCLE };
