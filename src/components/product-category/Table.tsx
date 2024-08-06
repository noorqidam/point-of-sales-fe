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
import { useDeleteProductCategoryById } from "@/hooks/useDeleteProductCategoryById";
import { useListProductCategory } from "@/hooks/useListProductCategory";
import { useFilter } from "@/components/layouts/table/TableContext";
import MainTableLayout from "@/components/layouts/table/Main";
import FormProductCategory from "@/components/product-category/Form";
import { Body, Header, TableHelper } from "@/types/table";
import { ProductCategory } from "@/types/product-category/product_category";
import { initialPagination, Pagination } from "@/types/pagination";

const TableProductCategory = () => {
  const { successToast, errorToast } = usePosToast();
  const { mutateAsync: deleteProductCategory, isPending: deleting } =
    useDeleteProductCategoryById();
  const { filter } = useFilter();
  const listProductCategory = useListProductCategory(filter);
  const [productCategorySelected, setProductCategorySelected] =
    React.useState<ProductCategory | null>(null);
  const [productCategory, setProductCategory] =
    React.useState<ProductCategory | null>(null);
  const [tableRefetch, setTableRefetch] = React.useState<number>(Math.random());
  const alertDialog = useDisclosure();
  const formModal = useDisclosure();

  const cancelReferenceDialog = React.useRef<HTMLButtonElement>(null);

  const openFormModal = (temporaryProductCategory: ProductCategory | null) => {
    if (temporaryProductCategory) {
      temporaryProductCategory.id;
    }

    setProductCategory(temporaryProductCategory);
    formModal.onOpen();
  };

  React.useEffect(() => {
    listProductCategory.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableRefetch]);

  const header: Array<Header> = [
    { name: "No.", data: "id" },
    { name: "Category Name", data: "categoryName" },
    { name: "Category Description", data: "categoryDescription" },
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

  const openAlertDelete = (temporary: ProductCategory) => {
    setProductCategorySelected(temporary);
    alertDialog.onOpen();
  };

  const deleteProductCategoryConfirm = async () => {
    return productCategorySelected === null ||
      productCategorySelected.id === undefined
      ? null
      : await deleteProductCategory(
          {
            id: productCategorySelected.id,
          },
          {
            onSuccess: (data) => {
              successToast({
                title: data.message,
                description: "Berhasil menghapus product category",
              });

              listProductCategory.refetch();

              if (data.success) {
                alertDialog.onClose();
                setProductCategorySelected(null);
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

  const pagination: Pagination =
    listProductCategory.data?.pagination ?? initialPagination;

  if (listProductCategory.data?.data !== undefined) {
    for (const [
      index,
      productCategory,
    ] of listProductCategory.data.data.entries()) {
      body.push([
        {
          name: <Text fontWeight="medium">{index + 1}</Text>,
        },
        {
          name: productCategory.categoryName,
        },
        {
          name: productCategory.categoryDescription,
        },
        {
          name: (
            <Flex gap={2} alignItems="center">
              <Button
                rightIcon={<Icon as={GrFormEdit} />}
                variant="outline"
                colorScheme="green"
                onClick={() => openFormModal(productCategory)}
              >
                Edit
              </Button>
              <Button
                rightIcon={<Icon as={HiOutlineTrash} />}
                variant="outline"
                colorScheme="red"
                onClick={() => openAlertDelete(productCategory)}
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
            <Text fontWeight="semibold">Semua Product Category</Text>
            <Button
              rightIcon={<Icon as={HiOutlinePlus} />}
              colorScheme="green"
              onClick={() => openFormModal(null)}
            >
              Tambah Product Category
            </Button>
          </Flex>
        }
        pagination={pagination}
        data={data}
        placeholder="Search Product Category"
        isLoading={listProductCategory.isLoading}
      />
      <AlertDialog
        isOpen={alertDialog.isOpen}
        leastDestructiveRef={cancelReferenceDialog}
        onClose={alertDialog.onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontWeight="bold">
              Hapus dari product category
            </AlertDialogHeader>
            <AlertDialogBody>
              Apakah anda yakin ingin menghapus&nbsp;
              {productCategorySelected?.categoryName} dari product category?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelReferenceDialog} onClick={alertDialog.onClose}>
                Cancel
              </Button>
              <Button
                isLoading={deleting}
                colorScheme="red"
                ml={3}
                onClick={() => deleteProductCategoryConfirm()}
              >
                Hapus
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <FormProductCategory
        productCategory={productCategory}
        setTableRefetch={setTableRefetch}
        formModal={formModal}
      />
    </Box>
  );
};

export default TableProductCategory;
