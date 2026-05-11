import { describe, expect, it } from "vitest";

import { getDictionary } from "@/lib/i18n";
import { getProfileLocations, locationsToMarkers } from "@/lib/locations";
import { getProfile } from "@/lib/profile";

describe("profile footprint locations", () => {
  it("extracts canonical map locations from zh-tw profile city names", () => {
    const locations = getProfileLocations(getProfile("zh-tw"));

    expect(locations.primary.key).toBe("taipei");
    expect(locations.primary.displayName).toBe("台北");
    expect(locations.primary.roles.length).toBeGreaterThan(0);
    expect(locations.rest.map((location) => location.key)).toEqual([
      "berlin",
      "singapore",
      "bangkok",
      "san jose",
      "london",
      "manchester",
      "hsinchu",
    ]);
    expect(locations.rest.map((location) => location.displayName)).toEqual([
      "柏林",
      "新加坡",
      "曼谷",
      "聖荷西",
      "倫敦",
      "曼徹斯特",
      "台灣新竹",
    ]);
  });

  it("extracts canonical map locations from zh-cn profile city names", () => {
    const locations = getProfileLocations(getProfile("zh-cn"));

    expect(locations.primary.key).toBe("taipei");
    expect(locations.primary.displayName).toBe("台北");
    expect(locations.rest.map((location) => location.key)).toEqual([
      "berlin",
      "singapore",
      "bangkok",
      "san jose",
      "london",
      "manchester",
      "hsinchu",
    ]);
    expect(locations.rest.map((location) => location.displayName)).toEqual([
      "柏林",
      "新加坡",
      "曼谷",
      "圣何塞",
      "伦敦",
      "曼彻斯特",
      "台湾新竹",
    ]);
  });

  it("extracts canonical map locations from ja profile city names", () => {
    const locations = getProfileLocations(getProfile("ja"));

    expect(locations.primary.key).toBe("taipei");
    expect(locations.primary.displayName).toBe("台北");
    expect(locations.rest.map((location) => location.key)).toEqual([
      "berlin",
      "singapore",
      "bangkok",
      "san jose",
      "london",
      "manchester",
      "hsinchu",
    ]);
    expect(locations.rest.map((location) => location.displayName)).toEqual([
      "ベルリン",
      "シンガポール",
      "バンコク",
      "サンノゼ",
      "ロンドン",
      "マンチェスター",
      "台湾・新竹",
    ]);
  });

  it("uses localized labels for footprint markers", () => {
    const locations = getProfileLocations(getProfile("zh-tw"));
    const markers = locationsToMarkers(locations, getDictionary("zh-tw").footprintPage.currentBaseLabel);

    expect(markers[0]).toMatchObject({
      id: "taipei",
      label: "台北",
      sublabel: "目前所在地",
      primary: true,
    });
  });
});
