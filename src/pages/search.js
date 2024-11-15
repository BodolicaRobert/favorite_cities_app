// pages/search.js
import { useState } from "react";
import { Box, Input, Button, List,ListItem, Flex, Link,Text } from "@chakra-ui/react";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

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
          {" "}
          {/* Ajustează dimensiunea pentru a arăta mai bine */}
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
        mt={5}
      >
        <List.Root  alignItems="center">
          {results.map((city) => {
            console.log("Rendering city:", city);
            return (
              <ListItem key={city.id} p={2}>
                <Link href={`/city/${city.name}`}>
                  <Box
                    p="4"
                    borderWidth="2px"
                    borderColor="teal.200"
                    borderRadius="md"
                  >
                    <Text fontSize="md" fontWeight="bold">
                      {city.name}, {city.country}
                    </Text>
                    <Text>Latitudine: {city.latitude} Longitudine: {city.longitude}</Text>                   
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
