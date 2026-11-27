import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Platform,
  ScrollView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@react-navigation/native";

import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { bottomStyles as styles } from "./styles.js";
import { getCuisineReviews, getReviewPhotoSource } from "./reviewApi.js";
import { useAppTheme } from "./themeMode.js";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

export default function BottomSheet({
  foodTrucks = [],
  selectedTruck = null,
  onSelectTruck,
  onClearSelection,
}) {
  const { colors } = useTheme();
  const { isDark } = useAppTheme();
  const mutedTextColor = isDark ? "#B0B0B0" : "#777777";
  const translateY = useSharedValue(350);
  const startY = useSharedValue(350);
  const [reviewState, setReviewState] = useState({
    truckId: null,
    status: "idle",
    data: null,
  });
  // Only show review data that belongs to the currently selected truck.
  const currentReviewState =
    selectedTruck && reviewState.truckId === selectedTruck.id
      ? reviewState
      : null;
  const reviewStatus = selectedTruck
    ? currentReviewState?.status ?? "loading"
    : "idle";
  const reviewData = currentReviewState?.data ?? null;

  function collapseSheet() {
    translateY.set(withSpring(350));
  }

  // Fetch reviews for each selection and ignore late results after switching trucks.
  useEffect(() => {
    if (!selectedTruck) {
      return undefined;
    }

    let isActive = true;
    const truck = selectedTruck;

    Promise.resolve()
      .then(() => {
        if (!isActive) return null;

        setReviewState({
          truckId: truck.id,
          status: "loading",
          data: null,
        });
        return getCuisineReviews({
          cuisineType: truck.cuisineType,
          latitude: truck.latitude,
          longitude: truck.longitude,
        });
      })
      .then((data) => {
        if (isActive && data) {
          setReviewState({
            truckId: truck.id,
            status: "loaded",
            data,
          });
        }
      })
      .catch((error) => {
        console.error("Failed to load Tripadvisor reviews.", error);
        if (isActive) {
          setReviewState({
            truckId: truck.id,
            status: "error",
            data: null,
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, [selectedTruck]);


  // https://stackoverflow.com/questions/45527549/react-native-opening-native-maps
  async function openDirections() {
    const latitude = selectedTruck?.latitude;
    const longitude = selectedTruck?.longitude;

    // check if location is valid
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      Alert.alert(
        "Location unavailable",
        "Directions can't be opened because this truck has no valid coordinates.",
      );
      return;
    }

    // set up the destination (food truck) and the platform's default maps app 
    const destination = encodeURIComponent(`${latitude},${longitude}`);
    const mapsUrl =
      Platform.OS === "ios"
        ? `http://maps.apple.com/?daddr=${destination}&dirflg=d`
        : `https://www.google.com/maps/dir/?api=1&destination=${destination}`;

    try {
      await Linking.openURL(mapsUrl);
    } catch (error) {
      console.error("Failed to open directions.", error);
      Alert.alert(
        "Maps unavailable",
        "Directions couldn't be opened. Please try again.",
      );
    }
  }

  // Handles dragging the bottom sheet
  const pan = Gesture.Pan()
    .onBegin(() => {
      startY.set(translateY.get());
    })
    .onUpdate((event) => {
      const newPosition = Math.max(
        0,
        Math.min(350, startY.get() + event.translationY),
      );

      translateY.set(newPosition);
    })
    .onEnd(() => {
      if (translateY.get() < 175) {
        translateY.set(withSpring(0));
      } else {
        translateY.set(withSpring(350));
      }
    });

  // Animates the bottom sheet position
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translateY.get(),
        },
      ],
    };
  });

  // The selected truck details and review results share a scrollable sheet area.
  return (
    <Animated.View
      style={[
        styles.bottomSheet,
        { backgroundColor: colors.card },
        animatedStyle,
      ]}
    >
      <GestureDetector gesture={pan}>
        <View style={styles.dragArea}>
          <View
            style={[
              styles.dragHandle,
              { backgroundColor: isDark ? "#666666" : "#CCCCCC" },
            ]}
          />

          <Text style={[styles.heading, { color: colors.text }]}>
            Nearby Food Trucks
          </Text>

          <TouchableOpacity
            style={[styles.closeTabButton, { backgroundColor: colors.text }]}
            onPress={selectedTruck ? onClearSelection : collapseSheet}
          >
            <Text style={[styles.buttonText, { color: colors.card }]}>X</Text>
          </TouchableOpacity>
        </View>
      </GestureDetector>

      {selectedTruck ? (
        <ScrollView style={styles.detailsScroll}>
          <View style={styles.truckDetails}>
            <View style={styles.truckNameRow}>
              <Text style={[styles.truckName, { color: colors.text }]}>
                {selectedTruck.name}
              </Text>
              {reviewData?.restaurant && (
                <View style={styles.truckRating}>
                  <Image
                    source={require("../assets/starIcon.png")}
                    style={styles.starIconStyle}
                  />
                  <Text
                    style={[styles.truckRatingText, { color: colors.text }]}
                  >
                    {reviewData.restaurant.rating ?? "—"}/5
                  </Text>
                </View>
              )}
            </View>
            <Text style={[styles.truckType, { color: mutedTextColor }]}>
              {selectedTruck.cuisineType}
            </Text>
            <Text style={[styles.truckDetails, { color: colors.text }]}>
              {selectedTruck.description}
            </Text>

            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: isDark ? "#333333" : "#F5F5F5",
                  borderColor: colors.border,
                },
              ]}
              onPress={openDirections}
            >
              <Text style={[styles.buttonText, { color: colors.text }]}>
                Get Directions
              </Text>
              <Image
                source={require("../assets/directionsIcon.png")}
                style={[styles.directionsIcon, { tintColor: colors.text }]}
              />
            </TouchableOpacity>

            {/* REVIEW SECTION */}
            <View
              style={[
                styles.reviewSection,
                { borderTopColor: colors.border },
              ]}
            >
              <Text style={[styles.reviewHeading, { color: colors.text }]}>
                Reviews
              </Text>
              {reviewStatus === "loading" && (
                <Text
                  style={[styles.reviewMessage, { color: mutedTextColor }]}
                >
                  Loading reviews...
                </Text>
              )}
              {reviewStatus === "error" && (
                <Text
                  style={[
                    styles.reviewMessage,
                    { color: mutedTextColor },
                  ]}
                >
                  Reviews could not be loaded.
                </Text>
              )}
              {reviewStatus === "loaded" && !reviewData?.restaurant && (
                <Text style={[styles.reviewMessage, { color: mutedTextColor }]}>
                  No matching restaurants found nearby.
                </Text>
              )}
              {reviewData?.restaurant && (
                <>
                  {reviewData.reviewCards.length > 0 ? (
                    <ScrollView
                      horizontal
                      style={styles.reviewCarousel}
                      contentContainerStyle={styles.reviewCarouselContent}
                      showsHorizontalScrollIndicator={false}
                    >
                      {reviewData.reviewCards.map((review) => (
                        <View
                          key={review.id}
                          style={[
                            styles.reviewCard,
                            {
                              backgroundColor: isDark ? "#333333" : "#FAFAFA",
                              borderColor: colors.border,
                            },
                          ]}
                        >
                          <Text
                            style={[styles.reviewTitle, { color: colors.text }]}
                            numberOfLines={3}
                          >
                            {review.title}
                          </Text>
                          <Image
                            source={getReviewPhotoSource(review.photoUrl)}
                            style={[
                              styles.reviewImage,
                              {
                                backgroundColor: isDark
                                  ? "#444444"
                                  : "#EEEEEE",
                              },
                            ]}
                            accessibilityLabel={review.title}
                          />
                        </View>
                      ))}
                    </ScrollView>
                  ) : (
                    <Text style={[styles.reviewMessage, { color: mutedTextColor }]}>
                      No review photos available.
                    </Text>
                  )}
                </>
              )}
            </View>
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={foodTrucks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.truckItem,
                { borderBottomColor: colors.border },
              ]}
              onPress={() => onSelectTruck?.(item)}
            >
              <View>
                <Text style={[styles.truckName, { color: colors.text }]}>
                  {item.name}
                </Text>

                <Text style={[styles.truckType, { color: mutedTextColor }]}>
                  {item.type || item.cuisineType}
                </Text>
              </View>

              <Text style={[styles.arrow, { color: mutedTextColor }]}>›</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: mutedTextColor }]}>
              No food trucks found nearby.
            </Text>
          }
        />
      )}
    </Animated.View>
  );
}
