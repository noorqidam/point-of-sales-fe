import { Box, Center, Text } from "@chakra-ui/react";
import * as React from "react";

export interface UserAvatarProps {
  userFullName: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ userFullName }) => {
  const getInitialName = (name?: string): string => {
    if (!name) {
      return "-";
    } else {
      const temp: Array<string> = name.split(/\s/);
      if (temp.length >= 2) {
        return temp[0].slice(0, 1) + temp[temp.length - 1].slice(0, 1);
      } else {
        return name.slice(0, 2);
      }
    }
  };

  return (
    <Box width="38px" height="38px" position="relative">
      <Center width="38px" height="38px" bg="gray" rounded="full">
        <Text color="white">{getInitialName(userFullName).toUpperCase()}</Text>
      </Center>
    </Box>
  );
};

export default UserAvatar;
