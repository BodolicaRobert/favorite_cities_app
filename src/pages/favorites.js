import { Box, Text, List, Button, Card, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function Favorites() {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (session) {
      const fetchFavorites = async () => {
        try {
          const response = await fetch(
            `/api/favorites?email=${session.user.email}`
          );
          const data = await response.json();
          console.log(data.favorites);
          if (response.status === 200) {
            setFavorites(data.favorites); // Setează favoritele în stare
          } else {
            setError(data.message || "Failed to load favorites");
          }
        } catch (err) {
          setError("An error occurred while fetching favorites");
        } finally {
          setLoading(false);
        }
      };

      fetchFavorites();
    }
  }, [session]);

  if (!session) {
    return (
      <Box p={5}>
        <Text fontSize="2xl" fontWeight="bold">
          Your Favorite Cities
        </Text>
        <Text mt={2}>Please sign in to see your favorite cities.</Text>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box p={5}>
        <Text fontSize="2xl" fontWeight="bold">
          Your Favorite Cities
        </Text>
        <Spinner />
      </Box>
    );
  }

  // Handler pentru ștergerea unui oraș din favorite
  const handleRemoveFavorite = async (cityId) => {
    try {
      const response = await fetch(`/api/deleteCity`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cityId,
        }),
      });

      const data = await response.json();
      if (response.status === 200) {
        // Îndepărtează orașul din lista locală
        setFavorites((prevFavorites) =>
          prevFavorites.filter((favorite) => favorite.id !== cityId)
        );
      } else {
        setError(data.message || "Failed to remove favorite");
      }
    } catch (err) {
      setError("An error occurred while removing favorite");
    }
  };

  return (
    <Box p={5}>
      <Text fontSize="2xl" fontWeight="bold">
        Your Favorite Cities
      </Text>

      {favorites.length > 0 ? (
        <Box
          mt={4}
          display="grid"
          gridTemplateColumns="repeat(auto-fill, minmax(320px, 1fr))"
          gap={4}
        >
          {favorites.map((favorite) => (
            <Card.Root key={favorite.id}  borderColor="teal.400" borderWidth={2}>
              <Card.Body >
                <Card.Title fontSize="xl" fontWeight="bold" p={2}>
                  {favorite.cityName}
                </Card.Title>
                <Card.Description ml={2}>
                  <Text>Latitude: {favorite.latitude}</Text>
                  <Text>Longitude: {favorite.longitude}</Text>
                </Card.Description>
              </Card.Body>
              <Card.Footer justifyContent="flex-end">
                <Button
                  variant="outline"
                  fontSize={"sm"}
                  fontWeight={600}
                  color={"white"}
                  bg={"red.600"}
                  size="sm"
                  _hover={{
                    bg: "red.500",
                  }}
                  p={2}
                  m={2}
                  onClick={() => handleRemoveFavorite(favorite.id)}
                >
                  Remove
                </Button>
              </Card.Footer>
            </Card.Root>
          ))}
        </Box>
      ) : (
        <Text mt={4}>You have no favorite cities saved.</Text>
      )}

      {error && (
        <Text color="red.500" mt={4}>
          {error}
        </Text>
      )}
    </Box>
  );
}
