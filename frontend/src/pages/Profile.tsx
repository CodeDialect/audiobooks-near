import { Divider, Flex, Spinner, useToast } from "@chakra-ui/react";
import CardComponent from "../components/Profile/Card";
import Cover from "../components/Profile/Cover";
import { SellBook } from "../components/Profile/Sellbook";
import { utils } from "near-api-js";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { RefObject, useEffect, useRef, useState } from "react";
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
  const [currentPlayingUrl, setCurrentPlayingUrl] = useState("");
  const audioRef: RefObject<AudioPlayer> = useRef(null);
  const toast = useToast();

  useEffect(() => {
    let currentAudioRef = audioRef.current;
    return () => {
      if (currentAudioRef && currentAudioRef.audio.current) {
        const audioElement = currentAudioRef.audio.current;
        audioElement.pause();
      }
    };
  }, []);

  const handleAudio = (e: React.MouseEvent, url: string) => {
    if (currentPlayingUrl !== "") {
      const currentAudio = new Audio(currentPlayingUrl);
      currentAudio.pause();
      setCurrentPlayingUrl("");
      setAudioUrl("");
    }

    setAudioPlayerVisible(false);

    const audio = new Audio(url);
    audio.oncanplaythrough = () => {
      setCurrentPlayingUrl(url);
      setAudioPlayerVisible(true);
      setAudioUrl(url);
    };

    audio.onerror = () => {
      toast({
        title: "Error",
        description: "Failed to load audio file.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    };

    e.preventDefault();
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
      <Flex
        direction="row"
        flexWrap="wrap"
        justifyContent="center"
        alignItems="center"
      >
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
                  currentPlayingUrl === book.audio && audioPlayerVisible
                    ? "Stop"
                    : "Play"
                }
                buttonWidth="100px"
                deleteAudioBook={(
                  e: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined
                ) => handleDelete(e, book.id)}
                spinning={removingStatus}
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
      {audioPlayerVisible && (
        <AudioPlayer autoPlay src={audioUrl} ref={audioRef} />
      )}
    </Flex>
  );
}

export default Profile;
