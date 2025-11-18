import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";

type IconBubbleProps = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap | string;
  color: string;
  size?: number;
};

export const IconBubble = ({ icon, color, size = 22 }: IconBubbleProps) => {
  const isValidIcon = icon in MaterialCommunityIcons.glyphMap;

  return (
    <View
      style={{
        backgroundColor: color,
        padding: 6,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
      }}
    >
      {isValidIcon ? (
        <MaterialCommunityIcons name={icon as any} size={size} color="white" />
      ) : (
        <MaterialCommunityIcons name="alert-circle" size={size} color="white" />
      )}
    </View>
  );
};
