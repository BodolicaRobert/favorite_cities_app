// pages/favorites.js
import { Box, Text } from '@chakra-ui/react';

export default function Favorites() {
  return (
    <Box p={5}>
      <Text fontSize="2xl" fontWeight="bold">Your Favorite Cities</Text>
      <Text mt={2}>Here you can see all your saved favorite cities!</Text>
    </Box>
  );
}
