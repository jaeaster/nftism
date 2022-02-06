import {
  Box,
  Center,
  useColorModeValue,
  Heading,
  Text,
  Stack,
  Image,
  Link,
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/react";

export type Props = {
  artist: string;
  title: string;
  imgSrc: string;
  href: string;
};

const FeaturedCard: React.FC<Props> = ({ artist, title, imgSrc, href }) => (
  <LinkBox passHref>
    <Center py={12}>
      <Box
        role={"group"}
        p={6}
        maxW={"330px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.800")}
        boxShadow={"2xl"}
        rounded={"lg"}
        pos={"relative"}
        zIndex={1}
      >
        <Box
          rounded={"lg"}
          mt={-12}
          pos={"relative"}
          height={"230px"}
          _after={{
            transition: "all .3s ease",
            content: '""',
            w: "full",
            h: "full",
            pos: "absolute",
            top: 5,
            left: 0,
            backgroundImage: `url(${imgSrc})`,
            filter: "blur(15px)",
            zIndex: -1,
          }}
          _groupHover={{
            _after: {
              filter: "blur(20px)",
            },
          }}
        >
          <Image
            rounded={"lg"}
            height={230}
            width={282}
            objectFit={"cover"}
            src={imgSrc}
            alt={title}
          />
        </Box>
        <Stack pt={10} align={"center"}>
          <Text color={"red.300"} fontSize={"sm"} textTransform={"uppercase"}>
            {artist}
          </Text>
          <LinkOverlay href={href}>
            <Heading fontSize={"2xl"} fontFamily={"body"} fontWeight={500}>
              {title}
            </Heading>
          </LinkOverlay>
        </Stack>
      </Box>
    </Center>
  </LinkBox>
);

export default FeaturedCard;