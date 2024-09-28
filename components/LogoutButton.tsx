// components/LogoutButton.tsx
import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation"; // Use next/navigation
import "@/styles/globals.css";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login"); // Use router.push from next/navigation
  };

  return <button onClick={handleLogout}>Logout</button>;
}
