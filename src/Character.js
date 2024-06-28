import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Text,
  Stack,
  Heading,
  Tag,
  Divider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react';

const DetailsPage = () => {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [films, setFilms] = useState([]);
  const cardBg = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const fetchCharacterData = async (id) => {
    if (id) {
      try {
        const response = await axios.get(`https://swapi.dev/api/people/${id}/`);
        setCharacter(response.data);
        const filmRequests = response.data.films.map(filmUrl => axios.get(filmUrl));
        const filmResponses = await Promise.all(filmRequests);
        setFilms(filmResponses.map(film => film.data));
      } catch (error) {
        console.error("Error fetching character data:", error);
      }
    }
  };
  useEffect(() => {
    fetchCharacterData(id)
  }, [id]);

  if (!character) return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Spinner size="xl" color="teal.500" />
    </Box>
  );

  return (
    <Box p={4}>
      <Stack spacing={4} align="center" bg={cardBg} p={6} borderRadius="md" boxShadow="lg">
        <Heading as="h1" size="2xl" color={textColor}>{character?.name}</Heading>
        <Stack direction="row" spacing={4}>
          <Tag size="lg" colorScheme="teal">Height: {character?.height} cm</Tag>
          <Tag size="lg" colorScheme="teal">Mass: {character?.mass} kg</Tag>
          <Tag size="lg" colorScheme="teal">Hair Color: {character?.hair_color}</Tag>
        </Stack>
        <Stack direction="row" spacing={4}>
          <Tag size="lg" colorScheme="teal">Skin Color: {character?.skin_color}</Tag>
          <Tag size="lg" colorScheme="teal">Eye Color: {character?.eye_color}</Tag>
          <Tag size="lg" colorScheme="teal">Birth Year: {character?.birth_year}</Tag>
        </Stack>
        <Tag size="lg" colorScheme="teal">Gender: {character?.gender}</Tag>
      </Stack>

      <Divider my={6} />

      <Heading as="h2" size="lg" mb={4} color={textColor}>Films</Heading>
      <Accordion allowToggle>
        {films?.map((film, index) => (
          <Box mb={4} key={index}>
            <AccordionItem borderRadius="md" boxShadow="md">
              <AccordionButton _expanded={{ bg: "teal.500", color: "white" }}>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  {film?.title}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <Text><strong>Director:</strong> {film?.director}</Text>
                <Text><strong>Producer:</strong> {film?.producer}</Text>
                <Text><strong>Release Date:</strong> {film?.release_date}</Text>
              </AccordionPanel>
            </AccordionItem>
          </Box>
        ))}
      </Accordion>
    </Box>
  );
};

export default DetailsPage;
