import { StyleSheet } from "react-native";

const s = StyleSheet.create({
  input: {
    backgroundColor: "white",
    height: 75,
    paddingLeft: 20,
    borderRadius: 15,
    fontFamily: "Alata-Regular",
    shadowColor: "#000",
    marginTop:90,
    fontSize:25,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 0,

    elevation: 5,
  },
});

export { s };