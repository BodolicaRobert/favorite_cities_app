// pages/search.js
import { useState } from "react";
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

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          searchTerm
        )}&count=5`
      );
      const data = await response.json();
      console.log(data); // Debugging pentru a verifica structura
      if (data.results) {
        setResults(data.results);
        console.log("Results type:", Array.isArray(results)); // Ar trebui să afișeze `true`
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Eroare la apelul API:", error);
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
  } else
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
              placeholder="Caută un oraș"
              _placeholder={{ color: "inherit" }}
              variant="outline"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
            {results.map((city) => {
              console.log("Rendering city:", city);
              return (
                <ListItem key={city.id} p={2}>
                  <Link href={`/city/${city.name}`}>
                    <Box
                      p="4"
                      borderWidth="2px"
                      borderColor="teal.400"
                      borderRadius="md"
                      bg="gray.800" // Background color for more visibility
                      fontSize="lg" // Increased font size
                    >
                      <Text fontSize="md" fontWeight="bold">
                        {city.name}, {city.country}
                      </Text>
                      <Text>
                        Latitudine: {city.latitude} Longitudine:{" "}
                        {city.longitude}
                      </Text>
                    </Box>
                  </Link>
                </ListItem>
              );
            })}
          </List.Root>
        </Box>
      </Flex>
    );
}
