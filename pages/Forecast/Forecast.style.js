import { StyleSheet } from "react-native";

const s = StyleSheet.create({
  header: {
    flexDirection: "row",
  },
  header_texts: {
    flex: 1,
    alignItems: "center",
    marginRight: 30,
  },
  back_btn: {
    width: 30,
  },
  subtitle: {
    fontSize: 20,
  },
  forecastList:{
    marginTop:20,
    flex: 1,
    justifyContent: "space-evenly",
  }
});

export { s };