import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Image,
  Spinner,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { useState } from "react";

interface CardComponentProps {
  image: string;
  title: string;
  description: string;
  price?: string | null;
  button1Text?: string;
  func: (e: React.MouseEvent<HTMLButtonElement>) => void;
  deleteAudioBook?: (e: React.MouseEvent<HTMLButtonElement> | undefined) => void;
  component?: React.ReactNode;
  buttonWidth?: string;
  spinning?: boolean;
}

const CardComponent = ({
  image,
  spinning,
  title,
  description,
  price,
  button1Text,
  component,
  func,
  buttonWidth,
  deleteAudioBook,
}: CardComponentProps) => {
  const [showCloseButton, setShowCloseButton] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const handleDeleteConfirmation = () => {
    setShowModal(true);
  }

  const handleDelete = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!spinning && deleteAudioBook) {
      handleDeleteConfirmation();
    }
  }
  

  return (
    <Box
      maxW="xs"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      bg="white"
      w="100%"
      margin="10px"
      position="relative"
      height="300px" // Set a fixed height for the card
      onMouseEnter={() => setShowCloseButton(true)}
      onMouseLeave={() => setShowCloseButton(false)}
    >
      <Image
        src={image}
        alt=""
        w="100%"
        h="50%" // Adjust the height of the image to fit within the fixed height of the card
        objectFit="cover" // Use cover to maintain aspect ratio and cover the entire space
        borderTopRadius="lg"
      />

      {showCloseButton && (
        <>
        <Box
          position="absolute"
          top="0"
          right="0"
          p="2"
          bg="#fb6666"
          onClick={handleDelete}
          cursor={spinning ? "not-allowed" : "pointer"}
        >
          {spinning ? <Spinner /> : "X"}
        </Box>
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmation</ModalHeader>
          <ModalBody>
            Are you sure you want to delete?
          </ModalBody>
          <ModalFooter>
            <Button isLoading={spinning} loadingText="Deleting" colorScheme="red" mr={3}  onClick={
            spinning
              ? undefined
              : (e: React.MouseEvent<HTMLButtonElement> | undefined) =>
                  deleteAudioBook && deleteAudioBook(e)
          }>
              Yes
            </Button>
            <Button onClick={() => setShowModal(false)}>No</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
      )}

      <Box p="3">
        <Heading
          as="h1"
          size="md"
          mt="2"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
        >
          {title}
        </Heading>
        <Text
          color="gray.700"
          mt="1"
          lineHeight="1.4"
          minHeight="1rem"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
        >
          {description}
        </Text>
        <Text color="gray.500" fontSize="sm">
          {price === "Not Listed"
            ? "Not Listed"
            : `Listed Price: ${price} NEAR`}
        </Text>
        <Flex mt="2">
          <Button
            flex="1"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => func(e)}
            mr="2"
            bg="blue.500"
            color="white"
            _hover={{ bg: "blue.600" }}
            size="sm"
            width={buttonWidth}
          >
            {button1Text}
          </Button>
          {component}
        </Flex>
      </Box>
    </Box>
  );
};

export default CardComponent;
