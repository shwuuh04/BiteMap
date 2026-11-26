import React from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";

import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { bottomStyles as styles } from "./styles.js";
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
  const translateY = useSharedValue(350);
  const startY = useSharedValue(350);

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

  return (
    <Animated.View style={[styles.bottomSheet, animatedStyle]}>
      <GestureDetector gesture={pan}>
        <View style={styles.dragArea}>
          <View style={styles.dragHandle} />

          <Text style={styles.heading}>
            {selectedTruck ? selectedTruck.name : "Nearby Food Trucks"}
          </Text>
        </View>
      </GestureDetector>

      {selectedTruck ? (
        <View style={styles.truckDetails}>
          <Text style={styles.truckName}>{selectedTruck.name}</Text>

          <Text style={styles.truckType}>
            {selectedTruck.type || selectedTruck.cuisineType}
          </Text>

          <Text style={styles.coordinates}>
            Latitude: {selectedTruck.latitude}
          </Text>

          <Text style={styles.coordinates}>
            Longitude: {selectedTruck.longitude}
          </Text>

          <Pressable style={styles.button} onPress={onClearSelection}>
            <Text style={styles.buttonText}>Back to food trucks</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={foodTrucks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              style={styles.truckItem}
              onPress={() => onSelectTruck?.(item)}
            >
              <View>
                <Text style={styles.truckName}>{item.name}</Text>

                <Text style={styles.truckType}>
                  {item.type || item.cuisineType}
                </Text>
              </View>

              <Text style={styles.arrow}>›</Text>
            </Pressable>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No food trucks found nearby.</Text>
          }
        />
      )}
    </Animated.View>
  );
}
