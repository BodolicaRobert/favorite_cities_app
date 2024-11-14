// pages/city/[id].js
import { Box, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';

export default function City() {
  const router = useRouter();
  const { id } = router.query; // Folosim id-ul orașului din URL

  return (
    <Box p={5}>
      <Text fontSize="2xl" fontWeight="bold">City Details</Text>
      <Text mt={2}>Details about the city with ID: {id}</Text>
    </Box>
  );
}