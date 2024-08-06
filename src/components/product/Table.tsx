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
import { useFilter } from "@/components/layouts/table/TableContext";
import MainTableLayout from "@/components/layouts/table/Main";
import { Body, Header, TableHelper } from "@/types/table";
import { Product } from "@/types/product/product";
import { initialPagination, Pagination } from "@/types/pagination";
import { useDeleteProductById } from "@/hooks/useDeleteProductById";
import { useListProduct } from "@/hooks/useListProduct";
import Image from "next/image";

const TableProduct = () => {
  const { successToast, errorToast } = usePosToast();
  const { mutateAsync: deleteProduct, isPending: deleting } =
    useDeleteProductById();
  const { filter } = useFilter();
  const listProduct = useListProduct(filter);
  const [productSelected, setProductSelected] = React.useState<Product | null>(
    null
  );
  const [product, setProduct] = React.useState<Product | null>(null);
  const [tableRefetch, setTableRefetch] = React.useState<number>(Math.random());
  const alertDialog = useDisclosure();
  const formModal = useDisclosure();

  const cancelReferenceDialog = React.useRef<HTMLButtonElement>(null);

  const openFormModal = (temporaryProduct: Product | null) => {
    if (temporaryProduct) {
      temporaryProduct.id;
    }

    setProduct(temporaryProduct);
    formModal.onOpen();
  };

  React.useEffect(() => {
    listProduct.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableRefetch]);

  const header: Array<Header> = [
    { name: "No.", data: "id" },
    { name: "Product Name", data: "productName" },
    { name: "Product Description", data: "productDescription" },
    { name: "Stock", data: "stock" },
    { name: "Product Image", data: "productImage" },
    { name: "Product Category", data: "categoryName" },
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

  const openAlertDelete = (temporary: Product) => {
    setProductSelected(temporary);
    alertDialog.onOpen();
  };

  const deleteProductConfirm = async () => {
    return productSelected === null || productSelected.id === undefined
      ? null
      : await deleteProduct(
          {
            id: productSelected.id,
          },
          {
            onSuccess: (data) => {
              successToast({
                title: data.message,
                description: "Berhasil menghapus product",
              });

              listProduct.refetch();

              if (data.success) {
                alertDialog.onClose();
                setProductSelected(null);
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
    listProduct.data?.pagination ?? initialPagination;

  if (listProduct.data?.data !== undefined) {
    for (const [index, product] of listProduct.data.data.entries()) {
      body.push([
        {
          name: <Text fontWeight="medium">{index + 1}</Text>,
        },
        {
          name: product.productName,
        },
        {
          name: product.productDescription,
        },
        {
          name: product.stock.toString(),
        },
        {
          name: (
            <Image
              src={`data:image/png;base64,${product.productImage}`}
              alt={product.productName}
              width={100}
              height={100}
            />
          ),
        },
        {
          name: product.category.categoryName,
        },
        {
          name: (
            <Flex gap={2} alignItems="center">
              <Button
                rightIcon={<Icon as={GrFormEdit} />}
                variant="outline"
                colorScheme="green"
                onClick={() => openFormModal(product)}
              >
                Edit
              </Button>
              <Button
                rightIcon={<Icon as={HiOutlineTrash} />}
                variant="outline"
                colorScheme="red"
                onClick={() => openAlertDelete(product)}
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
            <Text fontWeight="semibold">Semua Product</Text>
            <Button
              rightIcon={<Icon as={HiOutlinePlus} />}
              colorScheme="green"
              onClick={() => openFormModal(null)}
            >
              Tambah Product
            </Button>
          </Flex>
        }
        pagination={pagination}
        data={data}
        placeholder="Search Product"
        isLoading={listProduct.isLoading}
      />
      <AlertDialog
        isOpen={alertDialog.isOpen}
        leastDestructiveRef={cancelReferenceDialog}
        onClose={alertDialog.onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontWeight="bold">
              Hapus dari product
            </AlertDialogHeader>
            <AlertDialogBody>
              Apakah anda yakin ingin menghapus&nbsp;
              {productSelected?.productName} dari product?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelReferenceDialog} onClick={alertDialog.onClose}>
                Cancel
              </Button>
              <Button
                isLoading={deleting}
                colorScheme="red"
                ml={3}
                onClick={() => deleteProductConfirm()}
              >
                Hapus
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default TableProduct;
