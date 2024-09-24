import NavBar from "./NavBar"; // Correct the import (default export)
import styles from "@/styles/Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <NavBar />
    </header>
  );
}
