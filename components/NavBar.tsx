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

export default function NavBar() {
  const [, setMenuOpen] = useState<boolean>(false);

  return (
    <>
      {/* Ensure all components are wrapped within the Navbar */}
      <Navbar isBordered onMenuOpenChange={setMenuOpen}>
        <NavbarContent>
          <NavbarBrand className="relative w-32 h-10 sm:w-48 sm:h-14 pl-2 start">
            <Link href="/">
              <Image
                src="/images/home.svg"
                alt="Home Icon"
                width={200}
                height={60}
                loading="eager"
                priority={true}
              />
            </Link>
          </NavbarBrand>
          <NavbarMenuToggle
            aria-label="toggle navigation menu"
            className="sm:hidden"
          />
        </NavbarContent>

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

        {/* The mobile menu inside the Navbar to ensure context */}

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
      </Navbar>
    </>
  );
}
