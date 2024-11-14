// components/Navbar.js
import { Box, Flex, Text, Link, Stack,Button } from '@chakra-ui/react';

export default function Navbar() {
  return (
    <Box bg="teal.500" p={4}>
      <Flex justify="space-between" gap={2}>
      <img src="/planet.png" alt="Logo" style={{ height: '40px',marginRight: '10px' }} />
        <Text color="white" fontSize="xl" fontWeight="bold" style={{ marginTop: '5px' }}>Favorite Cities</Text>
        <Flex flex={{ base: 3 }} justify={{ base: 'center', md: 'start' }} >
            
        <Link
            href="/"
            color="white"
            mx={4}
            _hover={{
              color: 'teal.200', // Schimbă culoarea pe hover
              textDecoration: 'underline', // Adaugă subliniere pe hover
            }}
          >
            Home
          </Link>
          <Link
            href="/search"
            color="white"
            mx={4}
            _hover={{
              color: 'teal.200',
              textDecoration: 'underline',
            }}
          >
            Search
          </Link>
          <Link
            href="/favorites"
            color="white"
            mx={4}
            _hover={{
              color: 'teal.200',
              textDecoration: 'underline',
            }}
          >
            Favorites
          </Link>
          <Stack direction={'row'}
            spacing={6}
            ml="auto" // Adaugă acest lucru pentru a muta butoanele la dreapta
            align="center">
          <Button as={'a'} fontSize={'md'} fontWeight={400} variant={'link'} href={'#'} mx={4}
            _hover={{
              color: 'pink.300',
              textDecoration: 'underline',
            }}>
            Sign In
          </Button>
          <Button
            as={'a'}
            display={{ base: 'none', md: 'inline-flex' }}
            fontSize={'md'}
            fontWeight={600}
            color={'white'}
            bg={'pink.400'}
            href={'#'}
            px={4}
            _hover={{
              bg: 'pink.300',
            }}>
            Sign Up
          </Button>
        </Stack>
        </Flex>
      </Flex>
    </Box>
  );
}
