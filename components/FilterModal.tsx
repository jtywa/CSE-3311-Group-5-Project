import React from "react";
import { Modal, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: {
    restrooms: boolean;
    cafes: boolean;
    vending: boolean;
    study: boolean;
  };
  setFilters: (f: FilterModalProps["filters"]) => void;
}

export default function FilterModal({ visible, onClose, filters, setFilters }: FilterModalProps) {
  const toggle = (key: keyof typeof filters) => {
    setFilters({ ...filters, [key]: !filters[key] });
  };

  return (
    <Modal animationType="slide" visible={visible} transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Close Button */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={{ fontSize: 22 }}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Filters</Text>

          {/* Toggle rows */}
          {[
            ["Restrooms", "restrooms"],
            ["Cafes", "cafes"],
            ["Vending Machines", "vending"],
            ["Study Spots", "study"],
          ].map(([label, key]) => (
            <View key={key} style={styles.row}>
              <Text style={styles.label}>{label}</Text>
              <Switch value={filters[key as keyof typeof filters]} onValueChange={() => toggle(key as keyof typeof filters)} />
            </View>
          ))}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,

    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "85%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 14,
    elevation: 5,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  label: {
    fontSize: 18,
  },
});
