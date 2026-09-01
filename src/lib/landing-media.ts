/** Logos y enlaces de prensa para la landing de conversión (desde `press-items.ts`). */

import {
  getLandingCoverageHighlights,
  LANDING_TV_FEATURE,
  MEDIA_LOGOS,
  PRESS_TYPE_I18N_KEYS,
  type PressItemType,
} from "@/lib/press-items";

export const LANDING_MEDIA_LOGOS = MEDIA_LOGOS;

export type LandingCoverageType = PressItemType;

export const LANDING_COVERAGE_HIGHLIGHTS = getLandingCoverageHighlights();

export { LANDING_TV_FEATURE };

export const PRESS_TYPE_KEYS = PRESS_TYPE_I18N_KEYS;
