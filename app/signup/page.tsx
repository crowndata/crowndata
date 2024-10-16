"use client";

import { Button } from "@nextui-org/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import TitleDisplay from "@/components/TitleDisplay";
import styles from "@/styles/Auth.module.css";
import { supabase } from "@/utils/supabaseClient";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
    } else {
      setLoading(false);
      router.push("/login"); // Redirect to login page after successful sign-up
    }
  };

  const handleOAuthSignUp = async (provider: "google" | "github" | "slack") => {
    setLoading(true);
    setErrorMessage(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
    } else {
      setLoading(false);
      router.push("/"); // Redirect to home after signup
    }
  };

  return (
    <div className="container">
      <TitleDisplay title="Sign Up" />

      {/* Email and Password Signup Form */}
      <form onSubmit={handleEmailSignUp} className={styles.form}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email"
          className="input"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Password"
          className="input"
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up with Email"}
        </Button>
      </form>

      {/* Separator */}
      <div className="separator">
        <hr className="hr" />
      </div>

      {/* OAuth Sign Up Options with Logos */}
      <div>
        <Button onClick={() => handleOAuthSignUp("google")} disabled={loading}>
          <Image
            src="/images/google-logo.svg"
            alt="Google logo"
            width={20}
            height={20}
          />
          {loading ? "Signing up..." : "Sign up with Google"}
        </Button>

        <Button onClick={() => handleOAuthSignUp("github")} disabled={loading}>
          <Image
            src="/images/github-logo.svg"
            alt="GitHub logo"
            width={20}
            height={20}
          />
          {loading ? "Signing up..." : "Sign up with GitHub"}
        </Button>
      </div>

      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
    </div>
  );
}
