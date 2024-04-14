import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Checkbox, // Import Checkbox component from Chakra UI
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import {
  cancelListing,
  editListing,
  listAudioBook,
} from "../../utils/audiobook";

interface sellBookProps {
  audioBookId: string;
  status?: boolean;
  buttonWidth?: string;
}

export function SellBook({ audioBookId, status, buttonWidth }: sellBookProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const key = audioBookId + (status ? "sell" : "edit");
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const [price, setPrice] = useState("");
  const [disablePriceInput, setDisablePriceInput] = useState(false); // State for checkbox
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (reload) {
      window.location.reload();
    }
  }, [reload]);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!disablePriceInput && (price === "" || price === "0")) {
        toast({
          title: "Invalid Price",
          description: "Price cannot be empty or zero.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        if (status) {
          await listAudioBook(audioBookId, price);
          toast({
            title: "Success",
            description: "Your book has been listed.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } else {
          if (!disablePriceInput) {
            await editListing(audioBookId, price);
            toast({
              title: "Success",
              description: "Your book price has been updated.",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
          }
        }

        if (disablePriceInput) {
          await cancelListing(audioBookId);
          toast({
            title: "Success",
            description: "Listing has been cancelled.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      onClose();
      setTimeout(() => {
        setReload(true);
      }, 1000);
    }
  };

    return (
      <div key={key}>
        <Button
          flex="1"
          onClick={onOpen}
          mr="2"
          bg={status ? "red.500" : "green.500"}
          color="white"
          _hover={{ bg: "blue.600" }}
          w={buttonWidth}
          h="32px"
          isLoading={loading}
          loadingText={loading ? "Selling" : "Updating"}
        >
          {status ? "Sell" : "Update"}
        </Button>
        <Modal
          initialFocusRef={initialRef}
          finalFocusRef={finalRef}
          isOpen={isOpen}
          onClose={onClose}
        >
          {loading && <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999 }}></div>}
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Sell your Book</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Price</FormLabel>
                <Input
                  ref={initialRef}
                  placeholder="Selling Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  isDisabled={disablePriceInput} // Conditionally disable input based on checkbox state
                />
              </FormControl>
              {!status && (
                <Checkbox
                  onChange={() => setDisablePriceInput(!disablePriceInput)}
                >
                  Cancel Listing
                </Checkbox>
              )}
            </ModalBody>

            <ModalFooter>
              <Button
                isLoading={loading}
                loadingText={loading ? "Selling" : "Updating"}
                onClick={(e: { preventDefault: () => void }) => {
                  handleSubmit(e);
                }}
                colorScheme="blue"
                mr={3}
              >
                {status ? "Sell" : "Update"}
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    );
}
