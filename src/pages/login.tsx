import * as React from "react";
import * as z from "zod";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Hide,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  VisuallyHidden,
  VStack,
} from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePosToast } from "@/hooks/usePosToast/usePosToast";
import { useSocket } from "@/lib/websocket/SocketContext";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { NextPageWithLayout } from "@/pages/page";
import { getSession, signIn } from "next-auth/react";
import { Alert } from "@/types/alert";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Image from "next/image";

interface User {
  email?: string;
  password?: string;
}

const schema = z.object({
  email: z.string().min(1, { message: "Email wajib diisi" }),
  password: z.string().min(1, { message: "Password wajib diisi" }),
});

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return {
      redirect: {
        destination: "/user",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

const CopyrightContent = (): JSX.Element => (
  <Box w="full" position="absolute" bottom={0} left={0}>
    <Text
      textAlign="center"
      fontSize="13px"
      fontWeight="500"
      bgColor="gray.200"
      p={4}
    >
      Take Home Test {new Date().getFullYear()}. All rights reserved
    </Text>
  </Box>
);

const LoginPage: NextPageWithLayout = () => {
  const { successToast, errorToast } = usePosToast();
  const router = useRouter();
  const { reInitiateSocketParameters } = useSocket();

  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<User>({
    resolver: zodResolver(schema),
  });

  const handleUnkownError = () => {
    errorToast({
      title: "Login Gagal",
      description:
        "Ada kesalahan dalam pengecekan akun, silakan coba lagi. Bila masih belum bisa masuk ke dalam sistem silakan hubungi admin.",
      status: "error",
    });
  };

  const onSubmit: SubmitHandler<User> = async (data) => {
    const response = await signIn("credentials", {
      email: data.email,
      password: data.password,
      userAgent: window.navigator.userAgent,
      redirect: false,
    });

    if (response?.error) {
      setError("root.server", { message: "Server error" });
      if (response?.error === null) {
        handleUnkownError();
      } else {
        try {
          const parsedError: Alert = JSON.parse(response?.error ?? "{}");
          console.error(parsedError);

          let description = parsedError?.error?.message;

          if (
            parsedError.error &&
            Array.isArray(parsedError.error.error?.validation)
          ) {
            description = parsedError.error?.error?.validation
              .map((item) => JSON.stringify(item?.message))
              .join(", ");
          }

          errorToast({
            title: "Login Gagal",
            description,
            status: "error",
          });
        } catch (error) {
          console.error(error);
          handleUnkownError();
        }
      }
    } else {
      const session = await getSession();

      console.log("Session object:", session);

      reInitiateSocketParameters();

      if (session && session.user) {
        successToast({
          title: "Login berhasil",
          description: `Selamat datang kembali, ${session.user.firstName} ${session.user.lastName}`,
          status: "success",
        });

        await router.push("/user");
      } else {
        handleUnkownError();
      }
    }
  };

  return (
    <Flex
      w="100%"
      h="100vh"
      bg="white"
      flexDirection={["column", "row"]}
      position="relative"
    >
      <Stack
        w="100%"
        h={{ base: "calc(100vh - 400px)", md: "100vh" }}
        justifyContent="space-between"
        position="relative"
      >
        <Box
          w="full"
          h="full"
          backgroundImage="/images/background-login.jpg"
          backgroundRepeat="no-repeat"
          backgroundPosition="center"
          backgroundSize="cover"
          top={0}
        />
        <Hide below="md">
          <CopyrightContent />
        </Hide>
      </Stack>
      <Box w="full" h={{ base: "400px", md: "100vh" }} display="flex">
        <Stack
          justifyContent="space-between"
          mx={{ base: "10%", md: "20%" }}
          width={{ base: "500px", md: "400px" }}
        >
          <Stack mt={{ base: "44px", md: "100px" }} p="1rem" gap={4}>
            <Image
              src="/images/logo-login.png"
              width={500}
              height={500}
              alt="Logo Deptech"
            />
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing={4}>
                <FormControl isInvalid={Boolean(errors.email)}>
                  <VisuallyHidden>
                    <FormLabel htmlFor="email" fontSize="md">
                      Email
                    </FormLabel>
                  </VisuallyHidden>
                  <Input
                    focusBorderColor="GreenPrimary.600"
                    type="text"
                    id="email"
                    placeholder="email"
                    {...register("email")}
                  />
                  <FormErrorMessage>
                    {errors.email && errors.email.message}
                  </FormErrorMessage>
                </FormControl>
                <InputGroup>
                  <FormControl isInvalid={Boolean(errors.password)}>
                    <VisuallyHidden>
                      <FormLabel htmlFor="password" fontSize="md">
                        Password
                      </FormLabel>
                    </VisuallyHidden>
                    <Input
                      focusBorderColor="GreenPrimary.600"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      id="password"
                      {...register("password")}
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <Icon as={AiOutlineEyeInvisible} />
                        ) : (
                          <Icon as={AiOutlineEye} />
                        )}
                      </Button>
                    </InputRightElement>
                    <FormErrorMessage>
                      {errors.password && errors.password.message}
                    </FormErrorMessage>
                  </FormControl>
                </InputGroup>
                <Button
                  isLoading={isSubmitting}
                  borderRadius={6}
                  type="submit"
                  bgColor="GreenPrimary.600"
                  color="white"
                  _hover={{ background: "green.500" }}
                  variant="solid"
                  fontSize="13px"
                  width="full"
                >
                  Login
                </Button>
              </VStack>
            </form>
          </Stack>
        </Stack>
      </Box>
      <Hide above="md">
        <CopyrightContent />
      </Hide>
    </Flex>
  );
};

export default LoginPage;
