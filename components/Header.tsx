"use client";

import NavBar from "@/components/NavBar"; // Correct the import (default export)
import styles from "@/styles/Header.module.css";
import "@/styles/globals.css";

export default function Header() {
  return (
    <header className={styles.header} >
      <NavBar />
    </header>
  );
}
