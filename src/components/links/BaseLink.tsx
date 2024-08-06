import { chakra } from "@chakra-ui/react";
import NextLink, { LinkProps as NextLinkProps } from "next/link";

const BaseLink = chakra<typeof NextLink, NextLinkProps>(NextLink, {
  // ensure taht you're forwarding all of the required props for youe case
  shouldForwardProp: (prop) => ["href", "target", "children"].includes(prop),
});

export default BaseLink;
