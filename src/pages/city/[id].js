import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Box, Text, Button } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { Alert } from "@/components/ui/alert";

export default function CityPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const [cityData, setCityData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertStatus, setAlertStatus] = useState("success"); // Success by default
  const [showAlert, setShowAlert] = useState(false);

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
            fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&hourly=temperature_2m,relative_humidity_2m,rain,snowfall,wind_speed_10m`
            )
              .then((res) => res.json())
              .then((weather) => setWeatherData(weather.hourly));
          }
        })
        .catch((error) => console.error("Eroare la obținerea datelor:", error));
    }
  }, [id]);

  const handleToggleFavorite = async () => {
    if (session && session.user.email) {
      try {
        const response = await fetch("/api/favorite", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            city: {
              name: cityData.name,
              country: cityData.country,
              latitude: cityData.latitude,
              longitude: cityData.longitude,
            },
            userEmail: session.user.email, // Send user email to the API
          }),
        });

        const data = await response.json();

        if (response.status === 200) {
          setAlertMessage(data.message); 
          setAlertStatus(data.isAlreadyFavorite ? "warning" : "success"); 
          setShowAlert(true); 
        } else {
          setAlertMessage(data.message); 
          setAlertStatus("error");
          setShowAlert(true); 
        }
      } catch (error) {
        console.error("Error managing favorites:", error);
        setAlertMessage("An error occurred while managing favorites.");
        setAlertStatus("error"); 
        setShowAlert(true);
      }
    } else {
      setAlertMessage("You must be logged in to save cities as favorites.");
      setAlertStatus("error"); 
      setShowAlert(true);
    }
  };

  return (
    <Box p={4} textAlign="center" mt={5}>
      {cityData ? (
        <>
          <Text fontSize="3xl" fontWeight="bold">
            {cityData.name}, {cityData.country}
          </Text>
          <Text>Latitude: {cityData.latitude}</Text>
          <Text>Longitude: {cityData.longitude}</Text>
        </>
      ) : (
        <Text>Loading city data...</Text>
      )}

      {weatherData ? (
        <>
          <Text fontSize="2xl" mt={4} fontWeight="bold">
            Current Weather
          </Text>
          <Text>Temperature: {weatherData.temperature_2m[0]}°C</Text>
          <Text>Rain: {weatherData.rain[0]} mm</Text>
          <Text>Snow: {weatherData.snowfall[0]} cm</Text>
          <Text>Humidity: {weatherData.relative_humidity_2m[0]}%</Text>
          <Text>Wind Speed: {weatherData.wind_speed_10m[0]} km/h</Text>
        </>
      ) : (
        <Text>Loading weather data...</Text>
      )}
      {session && (
        <Button
          mt={4}
          colorScheme="teal"
          onClick={handleToggleFavorite}
          bg={"teal.600"}
          size="sm"
          fontSize={"md"}
          fontWeight={600}
          color={"white"}
          p={2}
          _hover={{
            bg: "teal.400",
          }}
        >
          Add to Favorites
        </Button>
      )}
       <Box  textAlign="center"  position="relative" minHeight="100vh">
      {showAlert && (
        <Alert
         status={alertStatus}
          mt={4}
          variant="surface"
          width="40%"
          position="absolute"
          top={2}
          p={1}
          left="50%"
          transform="translate(-50%, -50%)"
          textAlign="center"
        >
          
          {alertMessage}
        </Alert>
      )}
      </Box>
    </Box>
  );
}
