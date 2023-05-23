import { Alert, View } from "react-native";
import { s } from "./Home.style";

import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
} from "expo-location";
import { useEffect, useState } from "react";
import { MeteoAPI } from "../../api/meteo";
import { MeteoBasic } from "../../components/MeteoBasic/MeteoBasic";
import { getWeatherInterpretation } from "../../services/meteo-service";
import { MeteoAdvanced } from "../../components/MeteoAdvanced/MeteoAdvanced";
import { useNavigation } from "@react-navigation/native";
import { Container } from './../../components/Container/Container';
import { Searchbar } from './../../components/Searchbar/Searchbar';

//npx expo install expo-location

export function Home({}) {
  const [coords, setCoords] = useState();
  const [weather, setWeather] = useState();
  const [city, setCity] = useState();
  const nav = useNavigation();
  const currentWeather = weather?.current_weather; // récupére la clé currentweather de l'api
  //console.log(currentWeather);

  useEffect(() => {
    getUserCoords();
  }, []); // tableau vide pour effectuer cette action une seule fois au lancement de la page.

  useEffect(() => {
    if (coords) {
      fetchWeather(coords);
      fetchCity(coords);
    }
  }, [coords]); // se lance a chaque fois que coords change.

  //Récupération des coordonnées GPS de l'utilisateur.
  async function getUserCoords() {
    //Demande la permission d'accéder aux coordonnées GPS de l'utilisateur.
    let { status } = await requestForegroundPermissionsAsync();
    //L'utilisateur à donnée son autorisation pour récupérer ses coordonnées GPS.
    if (status === "granted") {
      const location = await getCurrentPositionAsync();
      setCoords({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    } else {
      //Si l'utilisateur refuse la permission de reécupérer ses coordonnées gps, on affiche la ville de Paris.
      setCoords({ lat: "48.85", lng: "2.35" });
    }
  }
  //console.log(coords);

  //Récupération des données météo.
  async function fetchWeather(coordinates) {
    const weatherResponse = await MeteoAPI.fetchWeatherFromCoords(coordinates);
    setWeather(weatherResponse);
  }
  //console.log(weather);

  //Récupération des données de la ville.
  async function fetchCity(coordinates){
    const cityResponse = await MeteoAPI.fetchCityFromCoords(coordinates);
    //console.log(cityResponse);
    setCity(cityResponse);
  }

  //Fonction de récupération des données pour une recherche dans l'input.
  async function fetchCoordsByCity(city) {
    try {
      const coords = await MeteoAPI.fetchCoordsFromCity(city);
      setCoords(coords);
    } catch (e) {
      Alert.alert("Oups !", e);
    }
  }

  //Fonction de navigation vers la page Forecast
  function goToForecastPage(){
    //lien de navigation + (optionnel) les données transmises dans la page Forecast.
    nav.navigate("Forecast", {city, ...weather.daily});
  }

  //Affichage uniquement lorsque les données météo sont chargées.
  return currentWeather ? (
    <Container>
      <View style={s.meteo_basic}>
        <MeteoBasic 
        temperature={Math.round(currentWeather?.temperature)} 
        city={city}
        interpretation={getWeatherInterpretation(currentWeather?.weathercode)}
        onPress={goToForecastPage}
        />
      </View>
      <View style={s.searchbar_container}>
        <Searchbar onSubmit={fetchCoordsByCity}/>
      </View>
      <View style={s.meteo_advanced}>
        <MeteoAdvanced 
        wind={currentWeather.windspeed} 
        //decoupe la donnée récupéré en 2 tableaux. 1 avant la lettre T et l'autre après.[1] on afiche la 2eme partie récupérée.
        dawn={weather.daily.sunset[0].split("T")[1]}
        dusk={weather.daily.sunrise[0].split("T")[1]}         
        />
      </View>
    </Container>
  ) : null;
}
