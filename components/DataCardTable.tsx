import "@/styles/globals.css";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Selection,
  SharedSelection,
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Key } from "@react-types/shared";
import { useSearchParams } from "next/navigation";
import React from "react";
import { useEffect, useState } from "react";

import RenderCell from "@/components/RenderCell";
import { capitalize } from "@/utils/visualization";

export const ITEMS_PER_PAGE = 5;

export const INITIAL_VISIBLE_COLUMNS = ["dataName", "video", "information"];

export const columns = [
  { name: "Data Name", uid: "dataName", sortable: true },
  { name: "Video", uid: "video", sortable: false },
  { name: "Information", uid: "information", sortable: false },
];

export const mobileColumns = [
  { name: "Content", uid: "content", sortable: false },
];

const DataCardTable: React.FC = () => {
  const [folders, setFolders] = useState<string[]>([]);
  const [filterValue, setFilterValue] = React.useState("");
  const [visibleColumns, setVisibleColumns] = React.useState<Set<Key>>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [rowsPerPage, setRowsPerPage] = React.useState(ITEMS_PER_PAGE);
  const [sortDescriptor] = React.useState<SortDescriptor>({
    column: "dataName",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);
  const [pages, setPages] = useState<number>(1);
  const [selectedItems, setSelectedItems] = useState<Set<Key>>();

  const handleSelectionChange = (keys: Selection) => {
    if (keys == "all") {
      setSelectedItems(new Set(folders));
    }
    setSelectedItems(keys as Set<Key>);
  };

  const searchParams = useSearchParams();

  // Make sure to check for the `undefined` case
  const handleVisibleColumnsSelectionChange = (keys: SharedSelection) => {
    if (keys === "all") {
      // Selecting all available row keys and ensuring they're strings
      const allKeys = new Set(INITIAL_VISIBLE_COLUMNS.map(String));
      setVisibleColumns(allKeys);
    } else if (keys instanceof Set) {
      // Convert all elements in the set to strings
      const stringKeys = new Set(Array.from(keys).map(String));
      setVisibleColumns(stringKeys);
    } else {
      // Handle other cases where keys might be an array or other data types, converting them to strings
      setVisibleColumns(new Set(Array.from(keys).map(String)));
    }
  };

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const res = await fetch("/api/v1/data/listing");
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const folderList: string[] = await res.json();
        setFolders(folderList);
        setPages(Math.ceil(folderList.length / ITEMS_PER_PAGE));
      } catch (error) {
        console.error("Error fetching folders:", error);
      }
    };

    fetchFolders();
  }, []);

  useEffect(() => {
    const pageParam = searchParams.get("page");
    if (pageParam) {
      setPage(parseInt(pageParam));
    }
  }, [searchParams]);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredFolders = [...folders];

    if (hasSearchFilter) {
      filteredFolders = filteredFolders.filter((folder) =>
        folder.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    return filteredFolders;
  }, [folders, filterValue, hasSearchFilter]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [],
  );

  const onSearchChange = React.useCallback((value: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            classNames={{
              base: "w-full sm:max-w-[44%]",
              inputWrapper: "border-1",
            }}
            placeholder="Search by name..."
            size="sm"
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown className="bg-gray-900">
              <DropdownTrigger className="hidden sm:flex">
                <Button size="sm" variant="flat">
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={handleVisibleColumnsSelectionChange}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {folders.length} data
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              {[5, 10, 25, 50, 100].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    folders,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <Pagination
        showControls
        classNames={{
          cursor: "bg-foreground text-background",
        }}
        color="default"
        isDisabled={hasSearchFilter}
        page={page}
        total={pages}
        variant="light"
        onChange={setPage}
        className="py-2 px-2 flex justify-center text-center items-center mx-auto w-1/2"
      />
    );
  }, [page, pages, hasSearchFilter]);

  const classNames = React.useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-3xl"],
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
      td: [
        // changing the rows border radius
        // first
        "group-data-[first=true]:first:before:rounded-none",
        "group-data-[first=true]:last:before:rounded-none",
        // middle
        "group-data-[middle=true]:before:rounded-none",
        // last
        "group-data-[last=true]:first:before:rounded-none",
        "group-data-[last=true]:last:before:rounded-none",
      ],
    }),
    [],
  );

  return (
    <>
      <Table
        className="block md:hidden"
        isCompact
        removeWrapper
        aria-label="Example table with custom cells, pagination and sorting"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        checkboxesProps={{
          classNames: {
            wrapper:
              "after:bg-foreground after:text-background text-background",
          },
        }}
        classNames={classNames}
        selectionMode="multiple"
        selectedKeys={selectedItems}
        onSelectionChange={handleSelectionChange}
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
      >
        <TableHeader columns={mobileColumns}>
          {(column) => (
            <TableColumn key={column.uid} allowsSorting={column.sortable}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No data found"}>
          {items.map((item) => (
            <TableRow key={`${item}`}>
              {mobileColumns.map((column) => (
                <TableCell
                  key={`data-card-row-${column.name}`}
                  className="min-w-[300px]"
                >
                  <RenderCell folderName={item} columnKey={column.uid} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Table
        className="hidden md:block"
        isCompact
        removeWrapper
        aria-label="Example table with custom cells, pagination and sorting"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        checkboxesProps={{
          classNames: {
            wrapper:
              "after:bg-foreground after:text-background text-background",
          },
        }}
        classNames={classNames}
        selectionMode="multiple"
        selectedKeys={selectedItems}
        onSelectionChange={handleSelectionChange}
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn key={column.uid} allowsSorting={column.sortable}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No data found"}>
          {items.map((item) => (
            <TableRow key={`${item}`}>
              {headerColumns.map((column) => (
                <TableCell
                  key={`data-card-row-${column.name}`}
                  className="min-w-[300px]"
                >
                  <RenderCell folderName={item} columnKey={column.uid} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedItems?.size === 1 && (
        <Button
          onPress={() =>
            (window.location.href = `/data/${Array.from(selectedItems.entries())[0][0]}`)
          }
          className="py-2 px-2 flex justify-center text-center items-center mx-auto w-1/2"
        >
          You have selected 1 items! Click to visualize!
        </Button>
      )}

      {selectedItems?.size === 2 && (
        <Button
          onPress={() =>
            (window.location.href = `/data/compare?data1=${Array.from(selectedItems.entries())[0][0]}&data2=${Array.from(selectedItems.entries())[1][0]}`)
          }
          className="py-2 px-2 flex justify-center text-center items-center mx-auto w-1/2"
        >
          You have selected 2 items! Click to compare!
        </Button>
      )}
    </>
  );
};

export default DataCardTable;
