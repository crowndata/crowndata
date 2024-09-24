"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

const ITEMS_PER_PAGE = 20;

const DataPage = () => {
  const [folders, setFolders] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchFolders = async () => {
      const res = await fetch("/api/data");
      const folderList = await res.json();
      setFolders(folderList);
      setTotalPages(Math.ceil(folderList.length / ITEMS_PER_PAGE));
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
    <div>
      <h1>Data Folders</h1>
      <ul>
        {currentFolders.map((folder) => (
          <li key={folder}>
            <Link href={`/data/${folder}`}>{folder}</Link>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            disabled={currentPage === i + 1}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DataPage;
