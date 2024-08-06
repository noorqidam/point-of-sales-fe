import * as React from "react";
import * as z from "zod";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Controller, useForm } from "react-hook-form";
import { useDropzone, Accept } from "react-dropzone";
import { HiPaperClip } from "react-icons/hi";
import Image from "next/image";
import { usePosToast } from "@/hooks/usePosToast/usePosToast";
import { useAddProduct } from "@/hooks/useAddProduct";
import { useUpdateProduct } from "@/hooks/useUpdateProduct";
import {
  PatchProductParameters,
  PatchProductReturn,
} from "@/http/patchProduct";
import { PostProductParameters, PostProductReturn } from "@/http/postProduct";
import { Product } from "@/types/product/product";
import DropdownProductCategory from "@/components/product/DropdownProductCategory";

export interface FormProductProperties {
  formModal: UseDisclosureProps;
  product: Product | null;
  setTableRefetch: React.Dispatch<React.SetStateAction<number>>;
}

const schemaValidation = z.object({
  id: z.number().optional(),
  productName: z.string().min(1, { message: "Product Name wajib diisi" }),
  productDescription: z
    .string()
    .min(1, { message: "Product Description wajib diisi" }),
  productImage: z.string().min(1, { message: "Product Image wajib diisi" }),
  categoryId: z.number().min(1, { message: "Category wajib diisi" }),
  stock: z.number().min(1, { message: "Stock wajib diisi" }),
});

export interface ProductParameters {
  id?: number;
  productName?: string;
  productDescription?: string;
  productImage?: string;
  categoryId?: number;
  stock?: number;
}

const FormProduct: React.FC<FormProductProperties> = ({
  formModal,
  product,
  setTableRefetch,
}) => {
  const { successToast, errorToast } = usePosToast();
  const { mutateAsync: addProduct, isPending: adding } = useAddProduct();
  const { mutateAsync: updateProduct, isPending: updating } =
    useUpdateProduct();

  const [imagePreview, setImagePreview] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProductParameters>({
    resolver: zodResolver(schemaValidation),
    defaultValues: {
      id: product?.id ?? undefined,
      productName: product?.productName ?? "",
      productDescription: product?.productDescription ?? "",
      productImage: "",
      categoryId: product?.category.id ?? 0,
      stock: product?.stock ?? 0,
    },
  });

  React.useEffect(() => {
    reset({
      id: product?.id ?? undefined,
      productName: product?.productName ?? "",
      productDescription: product?.productDescription ?? "",
      productImage: "",
      categoryId: product?.category.id ?? 0,
      stock: product?.stock ?? 0,
    });
    setImagePreview(product?.productImage ?? null);
  }, [product, reset]);

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        errorToast({
          title: "Gambar terlalu besar",
          description: "Ukuran gambar maksimal 10MB",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(",")[1];
        setValue("productImage", base64Data);
        setImagePreview(base64Data);
      };
      reader.readAsDataURL(file);
    },
    [errorToast, setValue]
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: { "image/*": [] } as Accept,
    multiple: false,
  });

  const handleClose = () => {
    formModal.onClose?.();
    setImagePreview(null);
    reset({
      id: product?.id ?? undefined,
      productName: product?.productName ?? "",
      productDescription: product?.productDescription ?? "",
      productImage: "",
      categoryId: product?.category.id ?? 0,
      stock: product?.stock ?? 0,
    });
  };

  const formSubmit = handleSubmit(async (data) => {
    const dataForm: PatchProductParameters | PostProductParameters = {
      data: { ...data },
    };
    const alertResponse = {
      onSuccess: (data: PostProductReturn | PatchProductReturn) => {
        successToast({
          title: data.message.message,
          description: data.message.success
            ? `Berhasil ${product ? "mengupdate" : "menambah"} produk`
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

    return product
      ? await updateProduct(dataForm, alertResponse)
      : await addProduct(dataForm, alertResponse);
  });

  return (
    <Modal isOpen={formModal.isOpen as boolean} onClose={handleClose}>
      <ModalOverlay />
      <form onSubmit={formSubmit}>
        <ModalContent>
          <ModalHeader>
            {product ? "Edit Product" : "Tambah Product"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack position="relative">
              <FormControl isInvalid={Boolean(errors.productName)}>
                <FormLabel htmlFor="productName">Product Name</FormLabel>
                <Input
                  id="productName"
                  focusBorderColor="GreenPrimary.600"
                  type="text"
                  {...register("productName")}
                  autoComplete="off"
                />
                <FormErrorMessage>
                  {errors.productName?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={Boolean(errors.productDescription)}>
                <FormLabel htmlFor="productDescription">
                  Product Description
                </FormLabel>
                <Textarea
                  id="productDescription"
                  focusBorderColor="GreenPrimary.600"
                  fontSize="13px"
                  {...register("productDescription")}
                />
                <FormErrorMessage>
                  {errors.productDescription?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={Boolean(errors.categoryId)}>
                <FormLabel htmlFor="categoryId">Product Category</FormLabel>
                <Controller
                  control={control}
                  name="categoryId"
                  render={({ field }) => {
                    const selectedCategory = field.value
                      ? { id: field.value }
                      : null;

                    return (
                      <DropdownProductCategory
                        selectedCategory={selectedCategory}
                        setSelectedCategory={(value) => {
                          const categoryId = value ? value.id : 0;
                          field.onChange(categoryId);
                        }}
                      />
                    );
                  }}
                />
                <FormErrorMessage>
                  {errors.categoryId?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={Boolean(errors.stock)}>
                <FormLabel htmlFor="stock">Stock</FormLabel>
                <Controller
                  control={control}
                  name="stock"
                  render={({ field }) => (
                    <NumberInput
                      id="stock"
                      focusBorderColor="GreenPrimary.600"
                      min={1}
                      value={field.value || 0}
                      onChange={(value) => field.onChange(Number(value))}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  )}
                />
                <FormErrorMessage>{errors.stock?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={Boolean(errors.productImage)}>
                <FormLabel htmlFor="productImage">Product Image</FormLabel>
                <div
                  {...getRootProps()}
                  id="productImage"
                  style={{
                    border: "1px dashed #ccc",
                    padding: "20px",
                    textAlign: "center",
                  }}
                >
                  <input {...getInputProps()} />
                  {imagePreview ? (
                    <Image
                      src={`data:image/png;base64,${imagePreview}`}
                      alt="Preview"
                      height={150}
                      width={150}
                    />
                  ) : (
                    <Button onClick={open}>
                      <Icon as={HiPaperClip} h="20px" w="20px" />
                    </Button>
                  )}
                </div>
                <FormErrorMessage>
                  {errors.productImage?.message}
                </FormErrorMessage>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={handleClose} w="132px">
              Batal
            </Button>
            <Button
              type="submit"
              isLoading={adding || updating}
              colorScheme="green"
              w="132px"
            >
              {product ? "Update" : "Simpan"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};

export default FormProduct;
