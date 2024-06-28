import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Grid, Image, Text, IconButton, HStack, Spinner, Heading } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const imageLinks = [
  "https://starwars-visualguide.com/assets/img/characters/1.jpg",
  "https://starwars-visualguide.com/assets/img/characters/2.jpg",
  "https://starwars-visualguide.com/assets/img/characters/3.jpg",
  "https://starwars-visualguide.com/assets/img/characters/4.jpg",
  "https://starwars-visualguide.com/assets/img/characters/5.jpg",
  "https://starwars-visualguide.com/assets/img/characters/6.jpg",
  "https://starwars-visualguide.com/assets/img/characters/7.jpg",
  "https://starwars-visualguide.com/assets/img/characters/8.jpg",
  "https://starwars-visualguide.com/assets/img/characters/9.jpg",
  "https://starwars-visualguide.com/assets/img/characters/10.jpg"
];

const HomePage = () => {
  const [characters, setCharacters] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true); // Set loading to true before fetching data
    try {
      const response = await axios.get(`https://swapi.dev/api/people/?page=${page}`);
      setCharacters(response.data.results);
      setTotalPages(Math.ceil(response.data.count / itemsPerPage));
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  useEffect(() => {
    fetchData();
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(savedFavorites);
  }, [page]);

  const toggleFavorite = (character) => {
    const updatedFavorites = favorites.some(fav => fav.name === character.name)
      ? favorites.filter(fav => fav.name !== character.name)
      : [...favorites, character];
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const renderPageNumbers = () => {
    const pages = [];
    if (totalPages <= 1) {
      pages.push(1);
    } else if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', page - 1, page, page + 1, '...', totalPages);
        
      }
    }

    return pages.map((pgNumber, index) =>
      typeof pgNumber === 'number' ? (
        <Button
          key={index}
          onClick={() => handlePageChange(pgNumber)}
          variant={page === pgNumber ? 'solid' : 'outline'}
          colorScheme={page === pgNumber ? 'blue' : 'gray'}
          mx={1}
        >
          {pgNumber}
        </Button>
      ) : (
        <Text key={index} mx={1} color="gray.500">...</Text>
      )
    );
  };

  return (
    <Box p={4}>
      <Heading as="h1" size="2xl" textAlign="center" mb={8}>
        Star Wars Characters
      </Heading>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <Spinner size="xl" color="teal.500" />
        </Box>
      ) : (
        <>
          <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={8} margin={"auto"}>
            {characters.map((character, index) => (
              <Box
                key={character.url}
                p={4}
                borderWidth="1px"
                borderRadius="lg"
                boxShadow="md"
                overflow="hidden"
                transition="transform 0.2s, box-shadow 0.2s, background-color 0.2s"
                _hover={{ transform: 'scale(1.05)', boxShadow: 'xl', backgroundColor: 'gray.100' }}
              >
                <Link to={`/detailsPage/${character.url.split('/').slice(-2, -1)[0]}`}>
                  <Image 
                    borderRadius={8}
                    src={imageLinks[index % imageLinks.length]} 
                    alt={character.name} 
                  /> 
                  <Text mt={2} fontWeight="bold" fontSize="lg" textAlign="center">{character.name}</Text>
                </Link>
                <HStack mt={4} justifyContent="space-between">
                  <IconButton
                    icon={favorites.some(fav => fav.name === character.name) ? <FaHeart /> : <FaRegHeart />}
                    colorScheme={favorites.some(fav => fav.name === character.name) ? "red" : "gray"}
                    onClick={() => toggleFavorite(character)}
                    aria-label="Favorite"
                    size="lg"
                  />
                  <Button
                    colorScheme="teal"
                    size="sm"
                    onClick={() => navigate(`/detailsPage/${character.url.split('/').slice(-2, -1)[0]}`)}
                  >
                    Learn More
                  </Button>
                </HStack>
              </Box>
            ))}
          </Grid>
          <HStack mt={7} justifyContent="center">
            <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} colorScheme="teal" size="sm">
              Previous
            </Button>
            {renderPageNumbers()}
            <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} colorScheme="teal" size="sm">
              Next
            </Button>
          </HStack>
        </>
      )}
    </Box>
  );
};

export default HomePage;
