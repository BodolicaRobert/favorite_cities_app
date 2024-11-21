import {
  Box,
  Text,
  Input,
  Button,
  List,
  ListItem,
  Spinner,
  Flex,
  Link,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState([]);
  const [randomCities, setRandomCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Functia pentru a naviga catre pagina de cautare
  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?query=${searchQuery}`);
    }
  };

  useEffect(() => {
    const fetchRandomCities = async () => {
      try {
        let attempts = 0;
        let data = null;

        // Continuăm să încercăm până obținem date valide sau atingem un număr maxim de încercări
        while (
          (!data || !data.results || data.results.length === 0) &&
          attempts < 5
        ) {
          const randomLetters = Array.from({ length: 3 })
            .map(() => String.fromCharCode(Math.floor(Math.random() * 26) + 97))
            .join("");

          const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${randomLetters}&count=5`
          );

          if (response.status === 200) {
            data = await response.json();
          }

          attempts++;
        }

        if (data && data.results) {
          setRandomCities(data.results.slice(0, 5)); // Alegem 5 orașe
        } else {
          console.error("Failed to load random cities after multiple attempts");
        }
      } catch (error) {
        console.error("Error fetching random cities", error);
      }
    };
    if (session) {
      const fetchFavorites = async () => {
        try {
          const response = await fetch(
            `/api/favorites?email=${session.user.email}`
          );
          const data = await response.json();
          if (response.status === 200) {
            setFavorites(data.favorites.slice(0, 5)); // Limitează la 5 orașe favorite
          } else {
            console.error("Failed to load favorites");
          }
        } catch (error) {
          console.error("Error fetching favorites", error);
        }
      };

      fetchFavorites();
      fetchRandomCities();
    } else {
      setFavorites([]);
      fetchRandomCities();
    }

    setLoading(false);
  }, [session]);

  return (
    <Box p={5}>
      <Flex direction="row">
        <Box flex="1">
          <Text fontSize="2xl" fontWeight="bold">
            Welcome to Favorite Cities
          </Text>
          <Text mt={2}>Find and save your favorite cities here!</Text>
          {session ? (
            <Text mt={2}>Signed in as {session.user.email}</Text>
          ) : (
            <Text mt={2}>You are not signed in!</Text>
          )}
        </Box>

        {/* Câmpul de căutare */}
        <Box flex="3" width="80%" textAlign="center" mt={4}>
          <Input
            colorPalette="white"
            color="white"
            placeholder="Search for a city"
            _placeholder={{ color: "inherit" }}
            variant="outline"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            mb={4}
            pl={2}
            borderColor="teal.600" // Border color for better contrast
            bg="gray.800" // Background color for more visibility
            fontSize="lg" // Increased font size
            _focus={{
              borderColor: "teal.400",
              boxShadow: "0 0 0 2px rgba(236, 72, 153, 0.6)", // Slight box shadow on focus
            }}
          />
          <Button
            onClick={handleSearch}
            width="40%"
            mt={2}
            fontSize={"md"}
            fontWeight={600}
            color={"white"}
            bg={"pink.400"}
            size="sm"
            _hover={{
              bg: "pink.300",
            }}
          >
            Search
          </Button>
        </Box>
      </Flex>
      <Flex>
        <Box
          flex="2"
          display="flex"
          justifyContent="center"
          alignItems="flex-start"
        >
          {/* Orașele preferate */}
          {session && (
            <>
              <Box>
                <Text fontSize="lg" mt={5} fontWeight="bold" textAlign="center">
                  Your Favorite Cities
                </Text>
                {loading ? (
                  <Spinner mt={2} />
                ) : favorites.length > 0 ? (
                  <List.Root mt={2} alignItems="center">
                    {favorites.map((favorite) => (
                      <ListItem key={favorite.id} p={2}>
                        <Link href={`/city/${favorite.cityName}`}>
                          <Box
                            p="4"
                            borderWidth="2px"
                            borderColor="teal.400"
                            borderRadius="md"
                            bg="gray.800"
                            fontSize="lg"
                          >
                            <Text fontSize="md" fontWeight="bold">
                              {favorite.cityName}
                            </Text>
                            <Text>
                              Latitude: {favorite.latitude} Longitude:{" "}
                              {favorite.longitude}
                            </Text>
                          </Box>
                        </Link>
                      </ListItem>
                    ))}
                  </List.Root>
                ) : (
                  <Text mt={2}>You have no favorite cities saved.</Text>
                )}
              </Box>
            </>
          )}
        </Box>
        <Box
          flex="2"
          display="flex"
          justifyContent="center"
          alignItems="flex-start"
        >
          <Box>
            {/* Orașe random */}
            <Text fontSize="lg" mt={5} textAlign="center" fontWeight="bold">
              Random Cities
            </Text>
            {loading ? (
              <Spinner mt={2} alignItems="center" />
            ) : randomCities.length > 0 ? (
              <List.Root mt={2} alignItems="center">
                {randomCities.map((city, index) => (
                  <ListItem key={index} p={2}>
                    <Link href={`/city/${city.name}`}>
                      <Box
                        p="4"
                        borderWidth="2px"
                        borderColor="teal.400"
                        borderRadius="md"
                        bg="gray.800"
                        fontSize="lg"
                      >
                        <Text fontSize="md" fontWeight="bold">
                          {city.name}, {city.country}
                        </Text>
                        <Text>
                          Latitude: {city.latitude} Longitude: {city.longitude}
                        </Text>
                      </Box>
                    </Link>
                  </ListItem>
                ))}
              </List.Root>
            ) : (
              <Spinner mt={2} alignItems="center" />
            )}
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
