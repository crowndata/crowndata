import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/NavBar.module.css";
import "@/styles/globals.css";
import LogoutButton from "@/components/LogoutButton";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">
          <Image
            src="/images/home.png"
            alt="Home Icon"
            width={100}
            height={20}
          />
        </Link>
      </div>
      <ul className={`${styles.navLinks} ${menuOpen ? styles.active : ""}`}>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/data">Data</Link>
        </li>
        <li>
          <Link href="/data/compare">Compare</Link>
        </li>
        <li>
          <Link href="/login">Login</Link>
        </li>
        <li>
          <Link href="/signup">Sign Up</Link>
        </li>
        <li>
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li>
          <LogoutButton />
        </li>
      </ul>
      <div className={styles.hamburger} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
}
