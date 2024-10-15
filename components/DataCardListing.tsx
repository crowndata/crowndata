import "@/styles/globals.css";

import { Pagination } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import DataCard from "@/components/DataCard";

import TitleDisplay from "./TitleDisplay";

const ITEMS_PER_PAGE = 5;

const DataCardListing: React.FC = () => {
  const [folders, setFolders] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const res = await fetch("/api/v1/data/listing");
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const folderList: string[] = await res.json();
        setFolders(folderList);
        setTotalPages(Math.ceil(folderList.length / ITEMS_PER_PAGE));
      } catch (error) {
        console.error("Error fetching folders:", error);
      }
    };

    fetchFolders();
  }, []);

  useEffect(() => {
    const pageParam = searchParams.get("page");
    if (pageParam) {
      setCurrentPage(parseInt(pageParam));
    }
  }, [searchParams]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    router.push(`/data?page=${page}`);
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentFolders = folders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="container">
      <TitleDisplay title="Data" />
      <div className="grid w-full">
        {currentFolders.map((folder) => (
          <DataCard key={folder} folderName={folder}/>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <Pagination
          variant="bordered"
          total={totalPages} // Replace 10 with totalPages variable
          initialPage={currentPage} // Replace 1 with the currentPage variable
          onChange={handlePageChange}
          className="flex flex-wrap gap-4 items-center center"
        />
      </div>
    </div>
  );
};

export default DataCardListing;
