import Head from "next/head";
import Image from "next/image";
import localFont from "next/font/local";
import styles from "@/styles/Home.module.css";
import { Box, Text } from '@chakra-ui/react';

export default function Home() {
  return (
    <Box p={5}>
      <Text fontSize="2xl" fontWeight="bold">Welcome to Favorite Cities</Text>
      <Text mt={2}>Find and save your favorite cities here!</Text>
    </Box>
  );
}