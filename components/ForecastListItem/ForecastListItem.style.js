import { StyleSheet } from "react-native";

const s = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
  },
  image: {
    height: 50,
    width: 50,
  },
  day: {
    fontSize: 20,
  },
  date: {
    fontSize: 20,
  },
  temperatureContainer: {
    flexDirection: "row", // Ensures that temperature and symbol are in the same row
    alignItems: "center", // Aligns items vertically in the center
  },
  temperature: {
    fontSize: 40,
  },
  temperatureSymbol: {
    fontSize: 40, // You can adjust this as needed
  },
});

export { s };
