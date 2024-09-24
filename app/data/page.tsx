"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import DataCard from "@/components/DataCard";
import styles from "@/styles/Page.module.css"; // New CSS module for the page

const ITEMS_PER_PAGE = 5;

const Page = () => {
  const [folders, setFolders] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const res = await fetch("/api/data");
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const folderList = await res.json();
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
    <div className={styles.container}>
      <h2 className={styles.title}>Data</h2>
      <div className={styles.grid}>
        {currentFolders.map((folder) => (
          <DataCard key={folder} folderName={folder} />
        ))}
      </div>

      {/* Pagination */}
      <div className={styles.pagination}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            disabled={currentPage === i + 1}
            className={`${styles.pageButton} ${
              currentPage === i + 1 ? styles.disabled : ""
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Page;
