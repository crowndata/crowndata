// /hooks/useSessionCheck.ts
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabaseClient"; // Adjust path as needed

interface UseSessionCheckReturn {
  sessionCheck: boolean;
}

export const useSessionCheck = (): UseSessionCheckReturn => {
  const [sessionCheck, setSessionCheck] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session },
        }: { data: { session: Session | null } } =
          await supabase.auth.getSession();

        if (!session) {
          router.push("/login"); // Redirect if no session
        } else {
          setSessionCheck(false); // Session exists, stop loading
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };

    checkSession();
  }, [router]);

  return { sessionCheck };
};
