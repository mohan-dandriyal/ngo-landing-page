
import bannerData  from "@/app/data/banner.json";
import type { BannerApiResponse, BannerData } from "@/app/types/home";

/**
 * Loads banner content.
 * - Set BANNER_API_URL in .env.local (e.g. http://localhost:3000/api/banner or your CMS URL).
 * - If it is missing or the request fails, the local data file is used.
 */
export async function getBannerData(): Promise<BannerData> {
  const url = process.env.BANNER_API_URL;
  if (!url) return bannerData as BannerData;

  try {
    const res = await fetch(url, { next: { revalidate: 60 } }); // refresh every 60s
    if (!res.ok) throw new Error(`Banner API responded ${res.status}`);
    const json = (await res.json()) as BannerApiResponse;
    return json.data;
  } catch (err) {
    console.error("getBannerData failed, using local data:", err);
    return bannerData as BannerData;
  }
}