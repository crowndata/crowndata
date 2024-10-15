// components/LogoutButton.tsx
import "@/styles/globals.css";

import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation"; // Use next/navigation

import { supabase } from "@/utils/supabaseClient";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login"); // Use router.push from next/navigation
  };

  return <Button onClick={handleLogout}>Logout</Button>;
}
