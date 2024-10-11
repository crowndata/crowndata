"use client";

import "@/styles/globals.css";

import Image from "next/image";
import { useRouter } from "next/navigation"; // Import from next/navigation
import { useState } from "react";

import TitleDisplay from "@/components/TitleDisplay";
import styles from "@/styles/Auth.module.css";
import { supabase } from "@/utils/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const router = useRouter();

  let redirectUrl = "/"; // Default to home page

  if (typeof window !== "undefined") {
    redirectUrl = `${window.location.origin}/`; // Redirect to the home page
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
    } else if (!data.user.email_confirmed_at) {
      // User has not confirmed their email
      setErrorMessage("Please confirm your email address before logging in.");
    } else {
      // Email confirmed, redirect to dashboard or home
      router.push("/");
    }
  };

  // Function to handle resending confirmation email
  const handleResendEmail = async () => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const { error } = await supabase.auth.resend({
      type: "signup", // Specify the type as 'signup'
      email,
    });

    if (error) {
      setErrorMessage(error.message);
    } else {
      setSuccessMessage("Confirmation email resent successfully!");
    }

    setLoading(false);
  };

  const handleOAuthLogin = async (provider: "google" | "github" | "slack") => {
    setLoading(true);
    setErrorMessage(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: redirectUrl, // Always redirects to the current domain root
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
    } else {
      setLoading(false);
      router.push("/"); // Redirect to home after login
    }
  };

  return (
    <div className="container">
      <TitleDisplay title="Login" />

      {/* Email and Password Login Form */}
      <form onSubmit={handleEmailLogin} className={styles.form}>
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
        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? "Logging in..." : "Login with Email"}
        </button>

        {/* Resend email button */}
        <button
          onClick={handleResendEmail}
          disabled={loading}
          className={styles.button}
        >
          {loading ? "Resending..." : "Resend Confirmation Email"}
        </button>
      </form>

      {/* Separator */}
      <div className="separator">
        <hr className="hr" />
      </div>

      {/* OAuth Login Options with Logos */}
      <div>
        <button
          onClick={() => handleOAuthLogin("google")}
          disabled={loading}
          className={styles.oauthButton}
        >
          <Image
            src="/images/google-logo.svg"
            alt="Google logo"
            width={20}
            height={20}
          />
          {loading ? "Logging in..." : "Login with Google"}
        </button>

        <button
          onClick={() => handleOAuthLogin("github")}
          disabled={loading}
          className={styles.oauthButton}
        >
          <Image
            src="/images/github-logo.svg"
            alt="GitHub logo"
            width={20}
            height={20}
          />
          {loading ? "Logging in..." : "Login with GitHub"}
        </button>
      </div>

      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      {successMessage && <p className={styles.success}>{successMessage}</p>}
    </div>
  );
}
