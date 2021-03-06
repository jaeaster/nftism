import { Flex } from "@chakra-ui/react";
import HeadSection from "../sections/HeadSection";

import styles from "../../styles/LandingLayout.module.scss";

interface Props {
  children?: React.ReactNode;
}

const LandingLayout: React.FC<Props> = ({ children }) => {
  return (
    <Flex
      bg="#12434d"
      color="white"
      direction="column"
      align="center"
      m="0 auto"
      height="100vh"
      overflow="scroll"
      className={styles.animate}
    >
      <HeadSection />
      {/* <Header /> */}
      {children}
      {/* <Footer /> */}
    </Flex>
  );
};

export default LandingLayout;
