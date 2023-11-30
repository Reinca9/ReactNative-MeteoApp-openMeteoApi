import { Container } from "../../components/Container/Container.jsx";
import { ForecastListItem } from "../../components/ForecastListItem/ForecastListItem.jsx";
import { Txt } from "../../components/Txt/Txt.jsx";
import { s } from "./Forecast.style.js";
import { useNavigation, useRoute } from "@react-navigation/native";
import { TouchableOpacity, View } from "react-native";
import { getWeatherInterpretation } from "../../services/meteo-service.js";
import { DAYS, dateToDDMM } from "../../services/date-service.js";

export function Forecast({}) {
  const { params } = useRoute();
  //console.log("parametre recu ", params);
  const nav = useNavigation();

  //Bouton de retour vers la page d'accueil
  const backButton = (
    <TouchableOpacity style={s.back_btn} onPress={() => nav.goBack()}>
      <Txt>{"<"}</Txt>
    </TouchableOpacity>
  );
  const header = (
    <>
      <View style={s.header}>
        {backButton}
        <View style={s.header_texts}>
          <Txt>{params.city}</Txt>
          <Txt style={s.subtitle}>Les 7 prochains jours</Txt>
        </View>
      </View>
    </>
  );

  const forecastList = (
    <View style={s.forecastList}>
      {params.time.map((time, index) => {
        const code = params.weathercode[index]; // récupération du code pour afficher l'image du temps qu'il prévu.
        const image = getWeatherInterpretation(code).image;
        const date = new Date(time);
        const day = DAYS[date.getDay()]; // récupére le jour de la semaine.
        const temperature = params.temperature_2m_max[index]; //
        //const d = `${date.getDate()}/${date.getMonth() + 1}`;
        return (
          <ForecastListItem
            image={image}
            day={day}
            key={time}
            date={dateToDDMM(date)}
            temperature={temperature.toFixed(0) }
          />
        );
      })}
    </View>
  );
  return (
    <Container>
      {header}
      {forecastList}
    </Container>
  );
}
