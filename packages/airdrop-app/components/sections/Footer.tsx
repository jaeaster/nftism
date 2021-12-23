import { Flex } from "@chakra-ui/react";
import { FaTelegram, FaTwitter } from "react-icons/fa";
import { TELEGRAM_LINK, TWITTER_LINK } from "../../utils/constants";
import SocialLink from "../ui/SocialLink";

const Footer: React.FC = () => {
  return (
    <Flex
      align="center"
      justify="space-around"
      direction="row"
      wrap="nowrap"
      width="100%"
      height="100%"
      px={8}
      py={6}
      opacity={1}
    >
      <SocialLink href={TWITTER_LINK} icon={FaTwitter} hoverColor="blue.500" />
      <SocialLink href={TELEGRAM_LINK} icon={FaTelegram} hoverColor="white" />
    </Flex>
  );
};

export default Footer;