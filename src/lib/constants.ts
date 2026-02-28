export const API_BASE_URL = "http://localhost:5000/api";
export const ACCESS_TOKEN_KEY = "accessToken";
export const ADMIN_TOKEN_KEY = "adminAccessToken";

export const TIER_STYLES: Record<
  string,
  { badge: string; border: string; bg: string; text: string }
> = {
  FREE: {
    badge: "bg-tier-free tier-free border-tier-free",
    border: "border-tier-free",
    bg: "bg-tier-free",
    text: "tier-free",
  },
  SILVER: {
    badge: "bg-tier-silver tier-silver border-tier-silver",
    border: "border-tier-silver",
    bg: "bg-tier-silver",
    text: "tier-silver",
  },
  GOLD: {
    badge: "bg-tier-gold tier-gold border-tier-gold",
    border: "border-tier-gold",
    bg: "bg-tier-gold",
    text: "tier-gold",
  },
  DIAMOND: {
    badge: "bg-tier-diamond tier-diamond border-tier-diamond",
    border: "border-tier-diamond",
    bg: "bg-tier-diamond",
    text: "tier-diamond",
  },
};

export const FILE_TYPE_LABELS: Record<string, string> = {
  IMAGE: "Images",
  VIDEO: "Videos",
  PDF: "PDFs",
  AUDIO: "Audio",
};
