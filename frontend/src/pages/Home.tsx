import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import CarouselComponent from "../components/Home/Carousel ";
import CardComponent from "../components/Profile/Card";
import { utils } from "near-api-js";
import { buyAudioBook } from "../utils/audiobook";

interface HomeProps {
  loading: boolean;
  audioBooks: any[];
  user: {
    id: string;
    loginStatus: boolean;
    profilePic?: string;
  };
}

const Home = ({ loading, audioBooks, user }: HomeProps) => {
  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100vh">
        <Spinner
          margin="auto"
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="purple.500"
          size="xl"
        />
      </Flex>
    );
  }

  const carouselSlides = audioBooks.map((book, index) => ({
    title: book.title,
    description: book.description,
    image: book.image,
  }));
  
  return (
    <>
      <Flex direction="column">
        <CarouselComponent slides={carouselSlides} />
        <Box
          margin="20px 0px 0px 10px"
          fontSize="larger"
          color={"gray.600"}
          fontWeight="600"
        >
          Collections
        </Box>
      </Flex>
      <Flex
        direction="row"
        flexWrap="wrap"
        justifyContent="start"
        alignItems="center"
      >
        {audioBooks
          .filter((book) => book.owner !== user.id && !book.sellStatus)
          .map((book, index) => (
            <CardComponent
              key={index}
              image={book.image}
              title={book.title}
              description={book.description}
              price={utils.format.formatNearAmount(book.price)}
              deletebutton={false}
              func={() => buyAudioBook(book.id, book.price, book.owner)}
              button1Text={`Buy for ${utils.format.formatNearAmount(
                book.price
              )} NEAR`}
            />
          ))}
        {audioBooks.filter((book) => book.owner !== user.id && !book.sellStatus)
          .length === 0 && (
          <Box textAlign="center" width="100%" p={4}>
            <Text style={{ fontSize: "xl", color: "gray.500" }}>
              No Audiobooks Listed by Others
            </Text>
          </Box>
        )}
      </Flex>
    </>
  );
};

export default Home;
