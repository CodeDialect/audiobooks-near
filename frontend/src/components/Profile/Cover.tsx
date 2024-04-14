import {
  Button,
  Flex,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { changeProfilePic } from "../../utils/audiobook";
import Addbook from "./Addbook";

interface CoverProps {
  accountName: string;
  collection: number;
  user: {
    id: string;
    loginStatus: boolean;
    profilePic?: string;
  };
}

const Cover = ({ accountName, collection, user }: CoverProps) => {
  let boxBg = useColorModeValue("white !important", "#111c44 !important");
  let mainText = useColorModeValue("gray.800", "white");
  let secondaryText = useColorModeValue("gray.400", "gray.400");
  const [showModal, setShowModal] = useState(false);
  const [newImageLink, setNewImageLink] = useState("");
  const toast = useToast();
  const handleImageChange = () => {
    if (!newImageLink) {
      toast({
        title: "Error",
        description: "Please enter a valid image link",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const img = document.createElement("img");
    img.src = newImageLink;
    img.onload = async () => {
      await changeProfilePic(newImageLink);
      toast({
        title: "success",
        description: "Image Updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      setShowModal(false);
    };
    img.onerror = () => {
      toast({
        title: "Error",
        description: "Invalid image link",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    };
  };

  return (
    <Flex
      borderRadius="20px"
      bg={boxBg}
      p="20px"
      alignItems="center"
      direction="column"
    >
      <Flex
        backgroundImage={"linear-gradient(#111c44, purple)"}
        width="100%"
        height="200px"
        borderRadius="20px"
      />

      <Flex flexDirection="column" mb="30px">
        {showModal && (
          <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Change Profile Image</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Input
                  placeholder="Enter new image link"
                  value={newImageLink}
                  onChange={(e) => setNewImageLink(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={handleImageChange}>
                  Submit
                </Button>
                <Button variant="ghost" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
        <Image
          src={user.loginStatus ? user.profilePic : ""}
          border="5px solid red"
          mx="auto"
          borderColor={boxBg}
          width="10rem"
          height="10rem"
          mt="-100px"
          borderRadius="50%"
          onClick={() => setShowModal(true)}
          _hover={{
            opacity: 0.7,
          }}
        />
        <Text
          fontWeight="600"
          color={mainText}
          textAlign="center"
          fontSize="xl"
        >
          {accountName}
        </Text>
      </Flex>
      <Flex direction="row" justify="space-between" w="100%" px="36px">
        <Flex flexDirection="column">
          <Text
            fontWeight="600"
            color={mainText}
            fontSize="xl"
            textAlign="center"
          >
            {collection}
          </Text>
          <Text color={secondaryText} fontWeight="500">
            Collections
          </Text>
        </Flex>
        <Addbook />
      </Flex>
    </Flex>
  );
};

export default Cover;
