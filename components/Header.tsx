"use client";

import "@/styles/globals.css";

import { GoogleAnalytics } from "nextjs-google-analytics";

import NavBar from "@/components/NavBar"; // Correct the import (default export)
import styles from "@/styles/Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <GoogleAnalytics trackPageViews={true} />
      <NavBar />
    </header>
  );
}
