import { Box, Divider, Flex, Spinner, useToast } from "@chakra-ui/react";
import CardComponent from "../components/Profile/Card";
import Cover from "../components/Profile/Cover";
import { SellBook } from "../components/Profile/Sellbook";
import { utils } from "near-api-js";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { RefObject, useRef, useState } from "react";
import { deleteAudioBook } from "../utils/audiobook";
interface ProfileProps {
  accountName: string;
  loading: boolean;
  audioBooks: any[];
  user: {
    id: string;
    loginStatus: boolean;
    profilePic?: string;
  };
}

function Profile({ accountName, loading, audioBooks, user }: ProfileProps) {
  const [audioPlayerVisible, setAudioPlayerVisible] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [removingStatus, setRemovingStatus] = useState(false);
  const audioRef: RefObject<AudioPlayer> = useRef(null);

  const toast = useToast();

  let isPlaying = false;

  const handleAudio = (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined, url: string) => {
    setAudioPlayerVisible(true);
    if (audioUrl === url) {
      if (audioRef.current) {
        if (audioRef.current.audio.current) {
          if (!isPlaying) {
            isPlaying = true;
            audioRef.current.audio.current
              .play()
              .then(() => {
                isPlaying = false;
              })
              .catch((error) => {
                console.error("Error playing audio:", error);
              });
            audioRef.current.audio.current.pause();
            setAudioPlayerVisible(false);
            console.log("Player is now visible (playing)");
          } else {
            audioRef.current.audio.current.pause();
            isPlaying = false;
            setAudioPlayerVisible(false);
            console.log("Player is now invisible (paused)");
          }
        }
      }
    } else {
      if (audioRef.current) {
        if (audioRef.current.audio.current) {
          audioRef.current.audio.current.src = url;
          isPlaying = true;
          audioRef.current.audio.current
            .play()
            .then(() => {
              isPlaying = false;
            })
            .catch((error) => {
              console.error("Error playing audio:", error);
            });
          setAudioPlayerVisible(true);
          console.log("Player is now visible (new audio)");
        }
      }
      setAudioUrl(url);
    }
  };

  const handleDelete = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined,
    id: string
  ) => {
    if (!e) {
      return;
    }
    e.preventDefault();
    try {
      setRemovingStatus(true);
      await deleteAudioBook(id);
      toast({
        title: "Success",
        description: "Your book has been deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete book.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setRemovingStatus(false);
    }
  };

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

  return (
    <Flex direction="column">
      <Cover
        accountName={accountName}
        user={user}
        collection={
          audioBooks.filter((book) => book.owner === accountName).length
        }
      />
      <Divider height="10px" />
      <Flex direction="column" flexWrap="wrap" justifyContent="flex-start">
        <Box
          margin="0px 0px 0px 10px"
          fontSize="larger"
          color={"gray.600"}
          fontWeight="600"
        >
          Your Collections
        </Box>
        <Flex direction="row" flexWrap="wrap" justifyContent="flex-start">
          {audioBooks.length > 0 ? (
            audioBooks
              .filter((book) => book.owner === accountName)
              .map((book, index) => (
                <CardComponent
                  key={index}
                  image={book.image}
                  title={book.title}
                  description={book.description}
                  price={
                    book.sellStatus
                      ? "Not Listed"
                      : utils.format.formatNearAmount(book.price)
                  }
                  button1Text={
                    audioUrl === book.audio && audioPlayerVisible
                      ? "Stop"
                      : "Play"
                  }
                  buttonWidth="100px"
                  deleteAudioBook={(
                    e:
                      | React.MouseEvent<HTMLButtonElement, MouseEvent>
                      | undefined
                  ) => handleDelete(e, book.id)}
                  spinning={removingStatus}
                  deletebutton={true}
                  func={(e) => handleAudio(e, book.audio)}
                  component={
                    <SellBook
                      buttonWidth="100px"
                      audioBookId={book.id}
                      status={book.sellStatus}
                    />
                  }
                />
              ))
          ) : (
            <p>No audio books available</p>
          )}
        </Flex>
      </Flex>
      {audioPlayerVisible && (
        <AudioPlayer autoPlay src={audioUrl} ref={audioRef} />
      )}
    </Flex>
  );
}

export default Profile;
