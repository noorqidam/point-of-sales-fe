import * as React from "react";
import * as z from "zod";
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  UseDisclosureProps,
  VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { format } from "date-fns";
import { Controller, useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { usePosToast } from "@/hooks/usePosToast/usePosToast";
import { useAddUser } from "@/hooks/useAddUser";
import { useUpdateUser } from "@/hooks/useUpdateUser";
import { dateFromString } from "@/hooks/utils/date";
import { PatchUserParameters, PatchUserReturn } from "@/http/patchUser";
import { PostUserParameters, PostUserReturn } from "@/http/postUser";
import DatePicker from "@/components/commons/DatePicker";
import { User } from "@/types/auth/user";

export interface FormUserProperties {
  formModal: UseDisclosureProps;
  user: User | null;
  setTableRefetch: React.Dispatch<React.SetStateAction<number>>;
}

const schemaValidation = z.object({
  id: z.number().optional(),
  firstName: z.string().min(1, { message: "Firstname wajib diisi" }),
  lastName: z.string().min(1, { message: "Lastname wajib diisi" }),
  email: z.string().email().optional().or(z.literal("")),
  birthDate: z.string().min(1, { message: "Tanggal Lahir wajib diisi" }),
  gender: z.string().nullable(),
  password: z.string().min(1, { message: "Password wajib diisi" }).optional(),
});

export interface UserParameters {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  birthDate?: string;
  gender?: string;
  password?: string;
}

const FormUser: React.FC<FormUserProperties> = ({
  formModal,
  user,
  setTableRefetch,
}) => {
  const { successToast, errorToast } = usePosToast();
  const { mutateAsync: addUser, isPending: adding } = useAddUser();
  const { mutateAsync: updateUser, isPending: updating } = useUpdateUser();
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  const defaultValues: UserParameters = {
    id: user?.id ?? undefined,
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
    birthDate: user?.birthDate ?? "",
    gender: user?.gender ?? "",
  };

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserParameters>({
    resolver: zodResolver(schemaValidation),
    defaultValues,
  });

  React.useEffect(() => {
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, reset]);

  const formSubmit = handleSubmit(async (data) => {
    const dataForm: PatchUserParameters | PostUserParameters = {
      data: { ...data },
    };
    const alertResponse = {
      onSuccess: (data: PostUserReturn | PatchUserReturn) => {
        successToast({
          title: data.message.message,
          description: data.message.success
            ? `Berhasil ${user ? "mengupdate" : "menambah"} user`
            : data.message.message,
        });

        if (data.message.success) {
          formModal.onClose?.();
          setTableRefetch(Math.random());
        }
      },
      onError: (error: AxiosError<unknown, unknown>) => {
        errorToast({
          title: "Gagal",
          description: error.name,
        });
      },
    };

    return user
      ? await updateUser(dataForm, alertResponse)
      : await addUser(dataForm, alertResponse);
  });

  return (
    <Modal
      isOpen={formModal.isOpen as boolean}
      onClose={formModal.onClose as () => void}
    >
      <ModalOverlay />
      <form onSubmit={formSubmit}>
        <ModalContent>
          <ModalHeader>{user ? "Edit User" : "Tambah User"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack position="relative">
              <FormControl isInvalid={Boolean(errors.firstName)}>
                <FormLabel htmlFor="firstName">Firstname</FormLabel>
                <Input
                  focusBorderColor="GreenPrimary.600"
                  type="text"
                  {...register("firstName")}
                  autoComplete="off"
                />
                <FormErrorMessage>{errors.firstName?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={Boolean(errors.lastName)}>
                <FormLabel htmlFor="lastName">Lastname</FormLabel>
                <Input
                  focusBorderColor="GreenPrimary.600"
                  type="text"
                  {...register("lastName")}
                  autoComplete="off"
                />
                <FormErrorMessage>{errors.lastName?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={Boolean(errors.email)}>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  focusBorderColor="GreenPrimary.600"
                  type="text"
                  {...register("email")}
                  autoComplete="off"
                />
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={Boolean(errors.birthDate)}>
                <FormLabel htmlFor="birthDate">Birthdate</FormLabel>
                <Controller
                  name="birthDate"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Flex w="full" flexDir="column" zIndex={100}>
                        <DatePicker
                          placeholder="Pilih tanggal lahir"
                          selectedDate={
                            field.value ? dateFromString(field.value) : null
                          }
                          onChange={(value) =>
                            field.onChange(
                              value ? format(value, "yyyy-MM-dd") : ""
                            )
                          }
                          name={field.name}
                        />
                        <FormErrorMessage>
                          {errors?.birthDate?.message}
                        </FormErrorMessage>
                      </Flex>
                    );
                  }}
                />
              </FormControl>
              <FormControl isInvalid={Boolean(errors.gender)}>
                <FormLabel htmlFor="gender">Gender</FormLabel>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup m={0} {...field}>
                      <Stack direction="row">
                        <Radio size="sm" value="male" colorScheme="green">
                          Male
                        </Radio>
                        <Radio size="sm" value="female" colorScheme="green">
                          Female
                        </Radio>
                      </Stack>
                    </RadioGroup>
                  )}
                />
              </FormControl>
              {!user && (
                <InputGroup>
                  <FormControl isInvalid={Boolean(errors.password)}>
                    <FormLabel htmlFor="password">Password</FormLabel>
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
                        position="absolute"
                        top={35}
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
                      {errors.password?.message}
                    </FormErrorMessage>
                  </FormControl>
                </InputGroup>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={formModal.onClose} w="132px">
              Batal
            </Button>
            <Button
              type="submit"
              isLoading={adding || updating}
              colorScheme="green"
              w="132px"
            >
              {user ? "Update" : "Simpan"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};

export default FormUser;
