import { Home } from "./pages/Home/Home";
import AlataRegular from "./assets/fonts/Alata-Regular.ttf";
import { useFonts } from "expo-font"; //npm i expo-font
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Forecast } from "./pages/Forecast/Forecast";
import { useEffect } from "react";

import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
//npx expo install @react-navigation/native react-native-screens @react-navigation/native-stack

//"softwareKeyboardLayoutMode": "pan"  dans app.json permet de faire passer le clavier de saisi de l'utilisateur 
// au dessus des élèments lors de son ouverture.Le comportement par défaut pousse les élèments de la page.

const Stack = createNativeStackNavigator();

//Supprime le theme(blanc) d'origine de react-navigation.
const navTheme = {
  colors: {
    background: "transparent",
  },
};

export default function App() {
  const [isFontLoaded] = useFonts({
    "Alata-Regular": AlataRegular,
  });

  //Envoie d'une notification à l'utilisateur depuis la vérification coté serveur.
  //https://docs.expo.dev/push-notifications/push-notifications-setup/
  async function subscribeToNotifications() {
    if (Device.isDevice) {
      //Vérification du status des notifications de l'utilisateur.
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      //Si le status de l'utilisateur n'est pas déjà autorisé fait une demande à l'utilisateur pour autoriser les notifications.
      if (existingStatus !== "granted") {
        const { status } =
          await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      //Si l'utilisateur refuse la demande de notification, on envoie une notification à l'utilisateur.
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      const token = (await Notifications.getExpoPushTokenAsync())
        .data;
        //console.log(token);
      // Envoi du token a un vrai serveur ici
    } else {
      alert("Must use physical device for Push Notifications"); // impossible d'effectuer un test sur un émulateur.
    }

    //Code a rajouter pour un utilisateur android.
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
  }


  useEffect(()=>{
    //Récupération des données envoyés par la notification.
    Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log(
          "data",
          response.notification.request.content.data
        );
      }
    );
    subscribeToNotifications();
  },[]) // tableau vide => ne se lance qu'une seule fois au démarrage de l'application.


  return (
    <NavigationContainer theme={navTheme}>
      {isFontLoaded ? (
        <Stack.Navigator
        // supprime le header d'origine de react-navigation + type d'animation lors d'une navigation.
          screenOptions={{ headerShown: false, animation:"fade" }} 
          initialRouteName="Home"
        >
          {/* LISTE DES ROUTES */}
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Forecast" component={Forecast} />
        </Stack.Navigator>
      ) : null}
    </NavigationContainer>
  );
}
