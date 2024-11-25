import { useState, useEffect } from "react";
import {
  Box,
  Input,
  Button,
  List,
  ListItem,
  Flex,
  Link,
  Text,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Verificăm dacă există un parametru "query" în URL
    if (router.query.query) {
      const initialQuery = decodeURIComponent(router.query.query);
      setSearchTerm(initialQuery);
      fetchSearchResults(initialQuery); // Inițiem căutarea
    }
  }, [router.query]);

  const fetchSearchResults = async (query) => {
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          query
        )}&count=5`
      );
      const data = await response.json();
      if (data.results) {
        setResults(data.results);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Eroare la apelul API:", error);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchTerm)}`);
      fetchSearchResults(searchTerm);
    }
  };

  if (!session) {
    return (
      <Box p={5}>
        <Text fontSize="2xl" fontWeight="bold">
          Welcome to Favorite Cities
        </Text>
        <Text mt={2}>Please sign in before using the search page!</Text>
      </Box>
    );
  }

  return (
    <Flex direction="row" minHeight="100vh">
      <Box
        flex="1"
        borderRight="3px solid"
        borderColor="teal.400"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Box width="80%" textAlign="center" mt={-10}>
          <Input
            colorPalette="white"
            color="white"
            placeholder="Search for a city"
            _placeholder={{ color: "inherit" }}
            variant="outline"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            mb={4}
            pl={2}
            borderColor="teal.600"
            bg="gray.800"
            fontSize="lg"
            _focus={{
              borderColor: "teal.400",
              boxShadow: "0 0 0 2px rgba(236, 72, 153, 0.6)",
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
            Caută
          </Button>
        </Box>
      </Box>
      <Box
        flex="2"
        p={2}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <List.Root alignItems="center">
          {results.map((city) => (
            <ListItem key={city.id} p={2}>
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
                    Latitudine: {city.latitude} Longitudine: {city.longitude}
                  </Text>
                </Box>
              </Link>
            </ListItem>
          ))}
        </List.Root>
      </Box>
    </Flex>
  );
}
