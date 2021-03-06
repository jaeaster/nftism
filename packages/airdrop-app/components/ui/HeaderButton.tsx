import React from "react";
import { Button } from "@chakra-ui/react";

interface Props {
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  isDisabled?: boolean;
  onClick?: any;
  props?: any;
}

const HeaderButton: React.FC<Props> = React.forwardRef(function HeaderButton(
  { children, onClick, ...props },
  ref
) {
  return (
    <Button
      size="md"
      rounded="md"
      variant="outline"
      colorScheme="teal"
      color="white"
      _hover={{
        bg: "white",
        color: "teal.500",
      }}
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  );
});

export default HeaderButton;
