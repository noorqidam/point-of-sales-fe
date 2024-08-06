import * as React from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  Icon,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { GrFormEdit } from "react-icons/gr";
import { HiOutlinePlus, HiOutlineTrash } from "react-icons/hi";
import { usePosToast } from "@/hooks/usePosToast/usePosToast";
import { useListUser } from "@/hooks/useListUser";
import { useDeleteUserById } from "@/hooks/useDeleteUserById";
import { useFilter } from "@/components/layouts/table/TableContext";
import MainTableLayout from "@/components/layouts/table/Main";
import FormUser from "@/components/users/Form";
import { Body, Header, TableHelper } from "@/types/table";
import { initialPagination, Pagination } from "@/types/pagination";
import { User } from "@/types/auth/user";

const TableUser = () => {
  const { successToast, errorToast } = usePosToast();
  const { mutateAsync: deleteUser, isPending: deleting } = useDeleteUserById();
  const { filter } = useFilter();
  const listUser = useListUser(filter);
  const [userSelected, setUserSelected] = React.useState<User | null>(null);
  const [user, setUser] = React.useState<User | null>(null);
  const [tableRefetch, setTableRefetch] = React.useState<number>(Math.random());
  const alertDialog = useDisclosure();
  const formModal = useDisclosure();

  const cancelReferenceDialog = React.useRef<HTMLButtonElement>(null);

  const openFormModal = (temporaryUser: User | null) => {
    if (temporaryUser) {
      temporaryUser.id;
    }

    setUser(temporaryUser);
    formModal.onOpen();
  };

  React.useEffect(() => {
    listUser.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableRefetch]);

  const header: Array<Header> = [
    { name: "No.", data: "id" },
    { name: "Nama", data: "name" },
    { name: "Email", data: "email" },
    { name: "Birthday", data: "birthday" },
    { name: "Gender", data: "gender" },
    {
      name: "Aksi",
      data: "action",
    },
  ];
  const body: Array<Array<Body>> = [];
  const data: TableHelper = {
    head: header,
    body: body,
  };

  const openAlertDelete = (temporary: User) => {
    setUserSelected(temporary);
    alertDialog.onOpen();
  };

  const deleteUserConfirm = async () => {
    return userSelected === null || userSelected.id === undefined
      ? null
      : await deleteUser(
          {
            id: userSelected.id,
          },
          {
            onSuccess: (data) => {
              successToast({
                title: data.message,
                description: "Berhasil menghapus user",
              });

              listUser.refetch();

              if (data.success) {
                alertDialog.onClose();
                setUserSelected(null);
              }
            },
            onError: (error: any) => {
              errorToast({
                title: "Gagal",
                description: error.name,
              });
            },
          }
        );
  };

  const pagination: Pagination = listUser.data?.pagination ?? initialPagination;

  const formatTanggalIndo = (tanggal: string | Date): string => {
    const date = new Date(tanggal);

    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "long",
      year: "numeric",
    };
    return new Intl.DateTimeFormat("id-ID", options).format(date);
  };

  if (listUser.data?.data !== undefined) {
    for (const [index, user] of listUser.data.data.entries()) {
      const formattedDate = user.birthDate
        ? formatTanggalIndo(user.birthDate)
        : "";
      body.push([
        {
          name: <Text fontWeight="medium">{index + 1}</Text>,
        },
        {
          name: `${user.firstName} ${user.lastName}`,
        },
        {
          name: user.email,
        },
        {
          name: formattedDate,
        },
        {
          name: user.gender,
        },
        {
          name: (
            <Flex gap={2} alignItems="center">
              <Button
                rightIcon={<Icon as={GrFormEdit} />}
                variant="outline"
                colorScheme="green"
                onClick={() => openFormModal(user)}
              >
                Edit
              </Button>
              <Button
                rightIcon={<Icon as={HiOutlineTrash} />}
                variant="outline"
                colorScheme="red"
                onClick={() => openAlertDelete(user)}
              >
                Hapus
              </Button>
            </Flex>
          ),
        },
      ]);
    }
  }

  return (
    <Box mt={6}>
      <MainTableLayout
        title={
          <Flex w="full" alignItems="center" justify="space-between">
            <Text fontWeight="semibold">Semua User</Text>
            <Button
              rightIcon={<Icon as={HiOutlinePlus} />}
              colorScheme="green"
              onClick={() => openFormModal(null)}
            >
              Tambah User
            </Button>
          </Flex>
        }
        pagination={pagination}
        data={data}
        placeholder="Search Name"
        isLoading={listUser.isLoading}
      />
      <AlertDialog
        isOpen={alertDialog.isOpen}
        leastDestructiveRef={cancelReferenceDialog}
        onClose={alertDialog.onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontWeight="bold">
              Hapus dari shortcut
            </AlertDialogHeader>
            <AlertDialogBody>
              Apakah anda yakin ingin menghapus {userSelected?.firstName}&nbsp;
              {userSelected?.lastName} dari user?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelReferenceDialog} onClick={alertDialog.onClose}>
                Cancel
              </Button>
              <Button
                isLoading={deleting}
                colorScheme="red"
                ml={3}
                onClick={() => deleteUserConfirm()}
              >
                Hapus
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <FormUser
        user={user}
        setTableRefetch={setTableRefetch}
        formModal={formModal}
      />
    </Box>
  );
};

export default TableUser;
