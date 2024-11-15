// pages/city/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';

export default function CityPage() {
  const router = useRouter();
  const { id } = router.query;
  const [cityData, setCityData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    if (id) {
      // Obține detalii despre oraș de la API-ul de geocoding
      fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.results && data.results[0]) {
            const city = data.results[0];
            setCityData(city);

            // Obține datele meteo pentru orașul respectiv
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&hourly=temperature_2m,relative_humidity_2m,rain,snowfall,wind_speed_10m`)
              .then((res) => res.json())
              .then((weather) => setWeatherData(weather.hourly));
          }
        })
        .catch((error) => console.error('Eroare la obținerea datelor:', error));
    }
  }, [id]);
  console.log(weatherData);
  return (
    <Box p={4} textAlign="center" mt={5}>
      {cityData ? (
        <>
          <Text fontSize="3xl" fontWeight="bold">
            {cityData.name}, {cityData.country}
          </Text>
          <Text>Latitudine: {cityData.latitude}</Text>
          <Text>Longitudine: {cityData.longitude}</Text>
        </>
      ) : (
        <Text>Se încarcă datele orașului...</Text>
      )}
      
      {weatherData ? (
        <>
          <Text fontSize="2xl" mt={4} fontWeight="bold">
            Vremea actuală
          </Text>
          <Text>Temperatură: {weatherData.temperature_2m[0]}°C</Text>
          <Text>Ploaie: {weatherData.rain[0]} mm</Text>
          <Text>Zăpadă: {weatherData.snowfall[0]} cm</Text>
          <Text>Umiditate: {weatherData.relative_humidity_2m[0]}%</Text>
          <Text>Viteza vântului: {weatherData.wind_speed_10m[0]} km/h</Text>
        </>
      ) : (
        <Text>Se încarcă datele meteo...</Text>
      )}
    </Box>
  );
}
