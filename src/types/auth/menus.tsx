import { Icon, IconProps, OmitCommonProps } from "@chakra-ui/react";
import { SVGProps } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { FaProductHunt } from "react-icons/fa6";
import { BiSolidCategory } from "react-icons/bi";
import { TbTransactionDollar } from "react-icons/tb";

export const listMenu: Array<Menu> = [
  {
    pages: "user",
    title: "User",
    icon: (
      <Icon as={AiOutlineUser} w="16px" h="16px" color="YellowPrimary.600" />
    ),
  },
  {
    pages: "product-category",
    title: "Product Category",
    icon: (
      <Icon as={BiSolidCategory} w="16px" h="16px" color="YellowPrimary.600" />
    ),
  },
  {
    pages: "product",
    title: "Product",
    icon: (
      <Icon as={FaProductHunt} w="16px" h="16px" color="YellowPrimary.600" />
    ),
  },
  {
    pages: "transaction",
    title: "Transaction",
    icon: (
      <Icon
        as={TbTransactionDollar}
        w="16px"
        h="16px"
        color="YellowPrimary.600"
      />
    ),
  },
];

export interface Menu {
  pages: string;
  title: string;
  icon: JSX.IntrinsicAttributes &
    OmitCommonProps<SVGProps<SVGSVGElement>, keyof IconProps> &
    IconProps & { as?: "svg" | undefined } & JSX.Element;
}
