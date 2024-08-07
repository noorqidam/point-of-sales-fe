import * as React from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  Icon,
  Spacer,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { HiOutlinePlus } from "react-icons/hi";
import { Select } from "chakra-react-select";
import { usePosToast } from "@/hooks/usePosToast/usePosToast";
import { useListTransaction } from "@/hooks/useListTransaction";
import {
  TableAction,
  useFilter,
} from "@/components/layouts/table/TableContext";
import LimitTableLayout from "@/components/layouts/table/Limit";
import PageTableLayout from "@/components/layouts/table/PageTable";
import { initialPagination, Pagination } from "@/types/pagination";
import { Transaction } from "@/types/transaction/Transaction";

type OptionType = { value: string; label: string };

const TableTransaction = () => {
  const { filter, dispatchFilter } = useFilter();
  const listTransaction = useListTransaction(filter);
  const formModal = useDisclosure();

  React.useEffect(() => {
    listTransaction.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openFormModal = () => {
    formModal.onOpen();
  };

  const pagination: Pagination =
    listTransaction.data?.pagination ?? initialPagination;

  const formatTanggalIndo = (tanggal: string | Date): string => {
    const date = new Date(tanggal);

    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "long",
      year: "numeric",
    };
    return new Intl.DateTimeFormat("id-ID", options).format(date);
  };

  const column: string[] = [
    "No",
    "Transaction Type",
    "Transaction Date",
    "Quantity",
    "Product Name",
    "Product Description",
  ];

  const tBodies = listTransaction?.data?.data?.map((transaction, index) => {
    const dataRows = transaction?.details?.map(
      (detailTransactionItem, detailTransactionItemIndex) => {
        const formattedDate = transaction.transactionDate
          ? formatTanggalIndo(transaction.transactionDate)
          : "";
        return (
          <Box
            as="tr"
            key={Number(detailTransactionItemIndex)}
            bg={
              detailTransactionItemIndex % 2 === 0 &&
              !!detailTransactionItemIndex
                ? "gray.100"
                : "white"
            }
            border="1.5px solid"
            borderColor="gray.300"
          >
            {detailTransactionItemIndex === 0 && (
              <Box
                as="td"
                w="4%"
                textAlign="center"
                bg="white"
                rowSpan={
                  Array.isArray(transaction.details)
                    ? transaction.details.length + 1
                    : 1
                }
              >
                {index + 1}
              </Box>
            )}
            {detailTransactionItemIndex === 0 && (
              <Box
                as="td"
                bg="white"
                px={3}
                border="1.5px solid #CBD5E0"
                rowSpan={
                  Array.isArray(transaction.details)
                    ? transaction.details.length + 1
                    : 1
                }
              >
                {transaction.transactionType}
              </Box>
            )}
            {detailTransactionItemIndex === 0 && (
              <Box
                as="td"
                bg="white"
                px={3}
                border="1.5px solid #CBD5E0"
                rowSpan={
                  Array.isArray(transaction.details)
                    ? transaction.details.length + 1
                    : 1
                }
              >
                {formattedDate}
              </Box>
            )}
            <Box
              py={1.5}
              px={3}
              as="td"
              w="6%"
              border="1.5px solid #CBD5E0"
              textAlign="center"
            >
              {detailTransactionItem.quantity}
            </Box>
            <Box py={1} px={3} as="td" w="20%" border="1.5px solid #CBD5E0">
              {detailTransactionItem.product.productName}
            </Box>
            <Box py={1} px={3} as="td" w="30%">
              {detailTransactionItem.product.productDescription}
            </Box>
          </Box>
        );
      }
    );
    return (
      <Box as="tbody" key={Number(index)}>
        {dataRows}
      </Box>
    );
  });

  const handleFilterChange = (selectedOption: OptionType | null) => {
    if (selectedOption && selectedOption.value !== "") {
      dispatchFilter({
        type: TableAction.ACT_SEARCH,
        value: selectedOption.value,
      });
    } else {
      dispatchFilter({
        type: TableAction.ACT_SEARCH,
        value: "",
      });
    }
  };

  return (
    <Box marginBottom={4} width="full" bg="white" fontSize="small">
      <Flex w="full" mb={5} alignItems="center" justify="space-between">
        <Text fontWeight="semibold" fontSize={20}>
          List Transaksi
        </Text>
        <Flex alignItems="center" gap={4}>
          <Select
            placeholder="Select option"
            onChange={handleFilterChange}
            options={[
              { value: "", label: "Reset" },
              { value: "Stock In", label: "Stock In" },
              { value: "Stock Out", label: "Stock Out" },
            ]}
            defaultValue={
              filter.search
                ? { value: filter.search, label: filter.search }
                : { value: "", label: "Reset" }
            }
          />
          <Button
            rightIcon={<Icon as={HiOutlinePlus} />}
            colorScheme="green"
            onClick={() => openFormModal()}
          >
            Tambah Transaksi
          </Button>
        </Flex>
      </Flex>
      {listTransaction.isLoading ? (
        <Center mt={4}>
          <Spinner />
        </Center>
      ) : pagination.totalItems > 0 ? (
        <>
          <Box
            as="table"
            width="full"
            border="1.5px solid"
            borderColor="gray.300"
          >
            <Box as="thead" bg="gray.50">
              <Box as="tr" fontSize="sm">
                {column?.map((col, index) => (
                  <Box
                    as="th"
                    py="8px"
                    border="1.5px solid #E5E7EB"
                    key={Number(index)}
                    color="black"
                    fontWeight="bold"
                  >
                    {col}
                  </Box>
                ))}
              </Box>
            </Box>
            {tBodies}
          </Box>
          <Flex alignItems="center" mt={6} gap={4} fontSize="13px">
            <LimitTableLayout />
            <Spacer />
            <PageTableLayout pagination={pagination} />
          </Flex>
        </>
      ) : (
        <Text mt={4}>Data tidak ditemukan</Text>
      )}
    </Box>
  );
};

export default TableTransaction;
