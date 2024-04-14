import { Box, Flex, Heading, Image, Stack } from '@chakra-ui/react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

interface CarouselProps {
  slides: any[];
}

const CarouselComponent = ({ slides }: CarouselProps) => {
  return (
    <Stack backgroundColor="#e5dceb">
    <Carousel showArrows={false} autoPlay autoFocus showStatus={false} showThumbs={false} infiniteLoop>
      {slides.slice(0, 4).map((slide: { image: string, title: string, description: string } , index) => {
        return ( 
        <Stack key={index} direction="row" height="350px" justifyContent="center" alignItems="center">
        <Flex direction="column" w="100%">
        <Heading fontSize="xl" wordBreak="break-word">{slide.title}</Heading>
        <Box>{slide.description}</Box>
        </Flex>
        <Box w="400px" m="0px 0px 0px 20px">
        <Image padding="50px" src={slide.image} height="400px"/>
        </Box>
        </Stack>
        );
      })}
    </Carousel>
    </Stack>
  );
};

export default CarouselComponent;