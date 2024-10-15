import "@/styles/globals.css";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/navbar";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import LogoutButton from "@/components/LogoutButton";
import styles from "@/styles/NavBar.module.css";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <Navbar isBordered>
        {/* Align content to the start (left) */}
        <NavbarBrand className="pl-2 start">
          <Link href="/">
            <Image
              src="/images/home.svg"
              alt="Home Icon"
              width={200}
              height={60}
              loading="eager" // Eager loading to ensure it loads quickly
              priority={true} // Preload image to avoid reloading
            />
          </Link>
        </NavbarBrand>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem isActive>
            <Link href="/" aria-current="page">
              Home
            </Link>
          </NavbarItem>

          <NavbarItem>
            <Link href="/data">Data</Link>
          </NavbarItem>

          <NavbarItem>
            <Link href="/data/compare">Compare</Link>
          </NavbarItem>

          <NavbarItem>
            <Link href="/dashboard">Dashboard</Link>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarItem>
            <Link href="/login">Login</Link>
          </NavbarItem>

          <NavbarItem>
            <Link href="/signup">Sign Up</Link>
          </NavbarItem>
          <NavbarItem>
            <LogoutButton />
          </NavbarItem>
        </NavbarContent>

        {/* Add NavbarMenuToggle here for mobile */}
        <NavbarMenuToggle
          aria-label="toggle navigation menu"
          onClick={toggleMenu}
          className="sm:hidden" // This ensures it's hidden on larger screens
        />
      </Navbar>

      {/* Mobile menu */}
      {menuOpen && (
        <NavbarMenu>
          <NavbarMenuItem>
            <Link href="/" aria-current="page">
              Home
            </Link>
          </NavbarMenuItem>

          <NavbarMenuItem>
            <Link href="/data">Data</Link>
          </NavbarMenuItem>

          <NavbarMenuItem>
            <Link href="/data/compare">Compare</Link>
          </NavbarMenuItem>

          <NavbarMenuItem>
            <Link href="/dashboard">Dashboard</Link>
          </NavbarMenuItem>

          <NavbarMenuItem>
            <Link href="/login">Login</Link>
          </NavbarMenuItem>

          <NavbarMenuItem>
            <Link href="/signup">Sign Up</Link>
          </NavbarMenuItem>
        </NavbarMenu>
      )}

      {/* Add a hamburger icon for mobile */}
      <div className={styles.hamburger} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </>
  );
}
