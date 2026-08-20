import luckySalon from "../../images/lucky-salon.png";
import bus from "../../images/bus.png";
import bhojpuriBangers from "../../images/bhojpuri-bangers.png";
import bartanTime from "../../images/bartan-time.png";
import rajuMistri from "../../images/raju-mistri.png";
import papaKeGaane from "../../images/papa-ke-gaane.png";

const UNSPLASH_OFFICE =
  "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200";
const UNSPLASH_RAIN =
  "https://images.unsplash.com/photo-1519692933481-e162a57d6721?q=80&w=1200";

export interface ThemeVisualConfig {
  slug: string;
  textColor: string;
  accentColor: string;
  description: string;
  quote: string;
  bgPattern: string;
  backgroundImage?: string;
}

export const THEME_VISUALS: Record<string, ThemeVisualConfig> = {
  "deluxe-salon": {
    slug: "deluxe-salon",
    textColor: "#e9d5ff",
    accentColor: "#8b5cf6",
    description: "लक्की Salon",
    quote: "बा'ल कटाओ, गाने सुनो...",
    bgPattern:
      "radial-gradient(circle at 20% 50%, rgba(168,85,247,0.1) 0%, transparent 10%), radial-gradient(circle at 80% 20%, rgba(139,92,246,0.08) 0%, transparent 10%)",
    backgroundImage: luckySalon,
  },
  "bus-driver": {
    slug: "bus-driver",
    textColor: "#fef3c7",
    accentColor: "#f59e0b",
    description: "Bus Driver",
    quote: "Agla stop — Bollywood!",
    bgPattern:
      "radial-gradient(circle at 30% 60%, rgba(245,158,11,0.08) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(234,179,8,0.06) 0%, transparent 50%)",
    backgroundImage: bus,
  },
  "bhojpuri-bangers": {
    slug: "bhojpuri-bangers",
    textColor: "#dcfce7",
    accentColor: "#10b981",
    description: "Bhojpuri Bangers",
    quote: "Jai Bhole Baba!",
    bgPattern:
      "radial-gradient(circle at 40% 50%, rgba(34,197,94,0.1) 0%, transparent 10%), radial-gradient(circle at 60% 20%, rgba(16,185,129,0.07) 0%, transparent 10%)",
    backgroundImage: bhojpuriBangers,
  },
  "bartan-time": {
    slug: "bartan-time",
    textColor: "#e0e7ff",
    accentColor: "#6366f1",
    description: "Bartan Time",
    quote: "Bartan maajhte maajhte gaana...",
    bgPattern:
      "radial-gradient(circle at 50% 50%, rgba(99,102,241,0.1) 0%, transparent 50%)",
    backgroundImage: bartanTime,
  },
  "raju-mistri": {
    slug: "raju-mistri",
    textColor: "#ffedd5",
    accentColor: "#f97316",
    description: "Raju Mistri",
    quote: "Kaam chhodo, gaana suno!",
    bgPattern:
      "radial-gradient(circle at 30% 40%, rgba(249,115,22,0.08) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(234,88,12,0.06) 0%, transparent 50%)",
    backgroundImage: rajuMistri,
  },
  "papa-ke-gaane": {
    slug: "papa-ke-gaane",
    textColor: "#dbeafe",
    accentColor: "#3b82f6",
    description: "Papa Ke Gaane",
    quote: "Woh zamana, woh gaane...",
    bgPattern:
      "radial-gradient(circle at 50% 60%, rgba(59,130,246,0.1) 0%, transparent 50%), radial-gradient(circle at 20% 20%, rgba(37,99,235,0.08) 0%, transparent 50%)",
    backgroundImage: papaKeGaane,
  },
  "working-time": {
    slug: "working-time",
    textColor: "#cffafe",
    accentColor: "#0891b2",
    description: "ऑफिस टाइम",
    quote: "Deadline kal tak hai... kal tak!",
    bgPattern:
      "radial-gradient(circle at 30% 50%, rgba(8,145,178,0.1) 0%, transparent 50%), radial-gradient(circle at 70% 20%, rgba(6,182,212,0.07) 0%, transparent 50%)",
    backgroundImage: UNSPLASH_OFFICE,
  },
  "mood-off": {
    slug: "mood-off",
    textColor: "#ede9fe",
    accentColor: "#7c3aed",
    description: "मूड Off",
    quote: "Dil ye kya chahta hai...",
    bgPattern:
      "radial-gradient(circle at 40% 60%, rgba(124,58,237,0.12) 0%, transparent 50%), radial-gradient(circle at 60% 30%, rgba(109,40,217,0.08) 0%, transparent 50%)",
    backgroundImage: UNSPLASH_RAIN,
  },
};

export const getThemeVisual = (slug: string | null): ThemeVisualConfig => {
  if (!slug) {
    return {
      slug: "default",
      textColor: "#c4b5fd",
      accentColor: "#6366f1",
      description: "Retro Radio India",
      quote: "Select a theme to begin your journey...",
      bgPattern: "",
    };
  }
  return THEME_VISUALS[slug] || THEME_VISUALS["deluxe-salon"];
};
