import * as React from "react";
import * as z from "zod";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  UseDisclosureProps,
  VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { usePosToast } from "@/hooks/usePosToast/usePosToast";
import { useAddProductCategory } from "@/hooks/useAddProductCategory";
import { useUpdateProductCategory } from "@/hooks/useUpdateProductCategory";
import {
  PatchProductCategoryParameters,
  PatchProductCategoryReturn,
} from "@/http/patchProductCategory";
import {
  PostProductCategoryParameters,
  PostProductCategoryReturn,
} from "@/http/postProductCategory";
import { ProductCategory } from "@/types/product-category/product_category";

export interface FormProductCategoryProperties {
  formModal: UseDisclosureProps;
  productCategory: ProductCategory | null;
  setTableRefetch: React.Dispatch<React.SetStateAction<number>>;
}

const schemaValidation = z.object({
  id: z.number().optional(),
  categoryName: z.string().min(1, { message: "Category Name wajib diisi" }),
  categoryDescription: z
    .string()
    .min(1, { message: "Category Description wajib diisi" })
    .max(1024, {
      message: "Category Description tidak boleh lebih dari 1024 karakter",
    }),
});

export interface ProductCategoryParameters {
  id?: number;
  categoryName?: string;
  categoryDescription?: string;
}

const FormProductCategory: React.FC<FormProductCategoryProperties> = ({
  formModal,
  productCategory,
  setTableRefetch,
}) => {
  const { successToast, errorToast } = usePosToast();
  const { mutateAsync: addProductCategory, isPending: adding } =
    useAddProductCategory();
  const { mutateAsync: updateProductCategory, isPending: updating } =
    useUpdateProductCategory();

  const defaultValues: ProductCategoryParameters = {
    id: productCategory?.id ?? undefined,
    categoryName: productCategory?.categoryName ?? "",
    categoryDescription: productCategory?.categoryDescription ?? "",
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductCategoryParameters>({
    resolver: zodResolver(schemaValidation),
    defaultValues,
  });

  React.useEffect(() => {
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productCategory, reset]);

  const formSubmit = handleSubmit(async (data) => {
    const dataForm:
      | PatchProductCategoryParameters
      | PostProductCategoryParameters = {
      data: { ...data },
    };
    const alertResponse = {
      onSuccess: (
        data: PostProductCategoryReturn | PatchProductCategoryReturn
      ) => {
        successToast({
          title: data.message.message,
          description: data.message.success
            ? `Berhasil ${productCategory ? "mengupdate" : "menambah"} user`
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

    return productCategory
      ? await updateProductCategory(dataForm, alertResponse)
      : await addProductCategory(dataForm, alertResponse);
  });

  return (
    <Modal
      isOpen={formModal.isOpen as boolean}
      onClose={formModal.onClose as () => void}
    >
      <ModalOverlay />
      <form onSubmit={formSubmit}>
        <ModalContent>
          <ModalHeader>
            {productCategory
              ? "Edit Product Category"
              : "Tambah Product Category"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack position="relative">
              <FormControl isInvalid={Boolean(errors.categoryName)}>
                <FormLabel htmlFor="categoryName">Category Name</FormLabel>
                <Input
                  id="categoryName"
                  focusBorderColor="GreenPrimary.600"
                  type="text"
                  {...register("categoryName")}
                  autoComplete="off"
                />
                <FormErrorMessage>
                  {errors.categoryName?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={Boolean(errors.categoryDescription)}>
                <FormLabel htmlFor="categoryDescription">
                  Category Description
                </FormLabel>
                <Textarea
                  focusBorderColor="GreenPrimary.600"
                  id="categoryDescription"
                  fontSize="13px"
                  {...register("categoryDescription")}
                />
                <FormErrorMessage>
                  {errors.categoryDescription?.message}
                </FormErrorMessage>
              </FormControl>
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
              {productCategory ? "Update" : "Simpan"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};

export default FormProductCategory;
