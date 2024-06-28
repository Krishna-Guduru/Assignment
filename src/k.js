import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Grid, Image, Text, IconButton, HStack } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import { getShipId } from './ImageValue';

const HomePage = () => {
  const [characters, setCharacters] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://swapi.dev/api/people/?page=${page}`);
        setCharacters(response.data.results);
        setTotalPages(Math.ceil(response.data.count / itemsPerPage));
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

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
    } else if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
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
        >
          {pgNumber}
        </Button>
      ) : (
        <span key={index}>...</span>
      )
    );
  };

  return (
    <Box p={4}>
      <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={6}>
        {characters.map((character) => (
          <Box  key={getShipId(character?.url)} p={4} borderWidth="1px" borderRadius="lg">
            <Link to={`/detailsPage/${character.url.split('/').slice(-2, -1)[0]}`}>
              {/* <Image 
            //   src={`https://starwars-visualguide.com/assets/img/starships/${getShipId(
            //         character?.url
            //       )}.jpg`}
            src={`/images/${character.url}.jpg`}
                   alt={character.name} /> */}
              <Text mt={2} fontWeight="bold">{character.name}</Text>
            </Link>
            <IconButton
              icon={<StarIcon />}
              colorScheme={favorites.some(fav => fav.name === character.name) ? "yellow" : "gray"}
              onClick={() => toggleFavorite(character)}
              aria-label="Favorite"
            />
          </Box>
        ))}
      </Grid>
      <HStack mt={4} justifyContent="center">
        <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
          Previous
        </Button>
        {renderPageNumbers()}
        <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
          Next
        </Button>
      </HStack>
    </Box>
  );
};

export default HomePage;
