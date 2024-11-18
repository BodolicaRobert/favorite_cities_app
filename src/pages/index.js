import Head from "next/head";
import Image from "next/image";
import localFont from "next/font/local";
import styles from "@/styles/Home.module.css";
import { Box, Text } from '@chakra-ui/react';
import { useSession, signIn, signOut } from "next-auth/react";
export default function Home() {
  const { data: session } = useSession();
  return (
    <Box p={5}>
      <Text fontSize="2xl" fontWeight="bold">Welcome to Favorite Cities</Text>
      <Text mt={2}>Find and save your favorite cities here!</Text>
      {session?(<Text mt={2}>Signed in as {session.user.name}</Text>):(<Text mt={2}>You are not signed in!</Text>)}
    </Box>
  );
  


  }
