const TRIPADVISOR_API_URL = "https://api.fetchlayer.dev/tripadvisor";
const FETCHLAYER_API_KEY = process.env.EXPO_PUBLIC_FETCHLAYER_API_KEY;

// Keep request formatting and HTTP error handling consistent across endpoints.
async function postTripadvisorRequest(endpoint, body) {
  if (!FETCHLAYER_API_KEY) {
    throw new Error("Missing EXPO_PUBLIC_FETCHLAYER_API_KEY.");
  }

  const response = await fetch(`${TRIPADVISOR_API_URL}/${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${FETCHLAYER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();

  if (!response.ok || data?.error) {
    throw new Error(
      data?.error || `Tripadvisor request failed with status ${response.status}.`,
    );
  }

  return data;
}

// Find a nearby Tripadvisor restaurant by cuisine, then return its reviews.
export async function getCuisineReviews({
  cuisineType,
  latitude,
  longitude,
}) {
  if (typeof cuisineType !== "string" || !cuisineType.trim()) {
    throw new Error("A cuisine type is required to search Tripadvisor.");
  }

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error("Valid coordinates are required to search Tripadvisor.");
  }

  // Use the selected truck's coordinates to bias cuisine search toward nearby places.
  const searchData = await postTripadvisorRequest("search-locations", {
    query: `${cuisineType.trim()} restaurant`,
    locationTypes: ["restaurant"],
    latitude,
    longitude,
    limit: 5,
  });

  if (!Array.isArray(searchData.locations)) {
    throw new Error("Tripadvisor returned an invalid restaurant search result.");
  }

  const restaurant = searchData.locations.find(
    (location) =>
      location?.locationType === "restaurant" &&
      typeof location.locationId === "string",
  );

  if (!restaurant) {
    return { restaurant: null, reviewCards: [] };
  }

  // The reviews endpoint needs the location ID returned by the search endpoint.
  const reviewData = await postTripadvisorRequest("location-reviews", {
    location: restaurant.locationId,
    sortBy: "recent",
    language: "en",
    photosPerReview: 1,
    limit: 10,
  });

  if (!Array.isArray(reviewData.reviews)) {
    throw new Error("Tripadvisor returned an invalid reviews result.");
  }

  // Pair one photo with its own review title, then show at most three cards.
  const reviewCards = reviewData.reviews
    .flatMap((review, index) => {
      const photoUrl = Array.isArray(review.photoUrls)
        ? review.photoUrls.find((url) => typeof url === "string" && url.length)
        : null;

      if (!photoUrl) {
        return [];
      }

      const title =
        typeof review.title === "string" && review.title.trim()
          ? review.title.trim()
          : "No review title";

      return [
        {
          id: review.reviewId || `${restaurant.locationId}-review-${index}`,
          photoUrl,
          title,
        },
      ];
    })
    .slice(0, 3);

  return {
    restaurant: {
      rating: Number.isFinite(restaurant.rating) ? restaurant.rating : null,
    },
    reviewCards,
  };
}

// Build the authenticated image URL used by React Native's Image component.
export function getReviewPhotoSource(photoUrl) {
  if (!FETCHLAYER_API_KEY) {
    throw new Error("Missing EXPO_PUBLIC_FETCHLAYER_API_KEY.");
  }

  return {
    uri: `${TRIPADVISOR_API_URL}/media?url=${encodeURIComponent(photoUrl)}`,
    headers: {
      Authorization: `Bearer ${FETCHLAYER_API_KEY}`,
    },
  };
}
