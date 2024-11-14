// pages/search.js
import { Box, Text } from '@chakra-ui/react';

export default function Search() {
  return (
    <Box p={5}>
      <Text fontSize="2xl" fontWeight="bold">Search Cities</Text>
      <Text mt={2}>Use the search bar to find cities and explore their details.</Text>
    </Box>
  );
}
