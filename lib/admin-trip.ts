export type TripFormValues = {
  title: string;
  route: string;
  distanceKm: string;
  description: string;
  youtubeUrl: string;
};

export type TripField = keyof TripFormValues;
export type TripFieldErrors = Partial<Record<TripField, string>>;

export type TripInsert = {
  title: string;
  route: string;
  distance_km: number;
  description: string;
  youtube_url: string | null;
};

const limits = {
  title: 120,
  route: 160,
  description: 2000,
  youtubeUrl: 300,
} as const;

function requiredText(
  value: string,
  label: string,
  max: number,
): { value: string } | { error: string } {
  const trimmed = value.trim();

  if (!trimmed) {
    return { error: `Enter a ${label}.` };
  }

  if (trimmed.length > max) {
    return { error: `${label} should be ${max} characters or fewer.` };
  }

  return { value: trimmed };
}

function parseDistance(value: string): { distance: number } | { error: string } {
  const trimmed = value.trim();

  if (!/^[1-9]\d*$/.test(trimmed)) {
    return { error: "Enter a positive whole number of kilometres." };
  }

  const distance = Number(trimmed);

  if (!Number.isSafeInteger(distance) || distance > 2_147_483_647) {
    return { error: "Enter a positive whole number of kilometres." };
  }

  return { distance };
}

function parseYoutube(value: string): { url: string | null } | { error: string } {
  const trimmed = value.trim();

  if (!trimmed) {
    return { url: null };
  }

  if (trimmed.length > limits.youtubeUrl) {
    return {
      error: `YouTube link should be ${limits.youtubeUrl} characters or fewer.`,
    };
  }

  try {
    const url = new URL(trimmed);

    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return { error: "Enter a valid link, or leave YouTube blank." };
    }

    return { url: url.toString() };
  } catch {
    return { error: "Enter a valid link, or leave YouTube blank." };
  }
}

export function validateTrip(values: TripFormValues): {
  fieldErrors: TripFieldErrors;
  trip: TripInsert | null;
} {
  const fieldErrors: TripFieldErrors = {};
  const title = requiredText(values.title, "title", limits.title);
  const route = requiredText(values.route, "route", limits.route);
  const description = requiredText(
    values.description,
    "description",
    limits.description,
  );
  const distance = parseDistance(values.distanceKm);
  const youtube = parseYoutube(values.youtubeUrl);

  if ("error" in title) {
    fieldErrors.title = title.error;
  }

  if ("error" in route) {
    fieldErrors.route = route.error;
  }

  if ("error" in description) {
    fieldErrors.description = description.error;
  }

  if ("error" in distance) {
    fieldErrors.distanceKm = distance.error;
  }

  if ("error" in youtube) {
    fieldErrors.youtubeUrl = youtube.error;
  }

  if (
    "error" in title ||
    "error" in route ||
    "error" in description ||
    "error" in distance ||
    "error" in youtube
  ) {
    return { fieldErrors, trip: null };
  }

  return {
    fieldErrors,
    trip: {
      title: title.value,
      route: route.value,
      distance_km: distance.distance,
      description: description.value,
      youtube_url: youtube.url,
    },
  };
}
