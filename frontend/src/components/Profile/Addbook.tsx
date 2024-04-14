import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { createAudioBook } from "../../utils/audiobook";

const Addbook = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef(null);
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [formData, setFormData] = useState({
    id: uuidv4(),
    title: "",
    description: "",
    image: "",
    audio: "",
    price: "",
  });

  useEffect(() => {
    if (reload) {
      window.location.reload();
    }
  }, [reload]);

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    try {
      setLoading(true);
      e.preventDefault();
      if (parseFloat(formData.price) <= 0) {
        alert("Price must be greater than 0");
        return;
      }
      if (
        formData.title === "" ||
        formData.description === "" ||
        formData.image === "" ||
        formData.audio === "" ||
        formData.price === ""
      ) {
        alert("Please fill in all required fields");
        return;
      }

      const isValidImage = await checkImageURL(formData.image);
      if (!isValidImage) {
        formData.image = "/not-found.png";
      }
      const isAudioValid = await checkAudioURL(formData.audio);
      if (!isAudioValid) {
        toast({
          title: "Error",
          description: "Invalid audio link.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }
      await createAudioBook(formData);
      toast({
        title: "Success",
        description: "Your book has been Added.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setLoading(false);
    onClose();
    setTimeout(() => {
      setReload(true);
    }, 1000);
  };

  const checkImageURL = (url: string) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  const checkAudioURL = (url: string) => {
    return new Promise((resolve) => {
      const audio = new Audio(url);
      audio.oncanplaythrough = () => resolve(true);
      audio.onerror = () => resolve(false);
    });
  };

  return (
    <>
      <Button
        bgColor="lightgray"
        borderRadius="20px"
        _hover={{
          bg: "purple.300",
          transition: "background-color ease-in 0.5s",
        }}
        onClick={onOpen}
        disabled={loading}
      >
        Add Book
      </Button>

      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        {loading && <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999 }}></div>}
        <ModalContent>
          <ModalHeader>Add an Audio Book</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Input type="hidden" value={formData.id} name="id" />
              <FormLabel>Title</FormLabel>
              <Input
                placeholder="Title"
                name="title"
                onChange={handleChange}
                required
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Input
                placeholder="Description"
                name="description"
                onChange={handleChange}
                required
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Image URL</FormLabel>
              <Input
                placeholder="Image URL"
                name="image"
                onChange={handleChange}
                required
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Audio URL</FormLabel>
              <Input
                placeholder="Audio URL"
                name="audio"
                onChange={handleChange}
                required
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Price</FormLabel>
              <Input
                type="number"
                placeholder="Price"
                name="price"
                onChange={handleChange}
                required
              />
            </FormControl>

            {/* <FormControl mt={4}>
              <FormLabel>Supply</FormLabel>
              <Input
                type="number"
                placeholder="Supply"
                name="supply"
                onChange={handleChange}
                required
              />
            </FormControl> */}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleSubmit}
              loadingText="Adding"
              disabled={loading}
              isLoading={loading} // Show loading spinner inside the button when loading is true
              spinner={<Spinner size="sm" color="white.500" />} // Define the spinner to be used
            >
              Add
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Addbook;
