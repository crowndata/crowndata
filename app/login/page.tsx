"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation"; // Import from next/navigation
import styles from "@/styles/Auth.module.css";
import Image from "next/image";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
    } else {
      setLoading(false);
      router.push("/"); // Redirect to home after login
    }
  };

  const handleOAuthLogin = async (provider: "google" | "github" | "slack") => {
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
      router.push("/"); // Redirect to home after login
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>

      {/* Email and Password Login Form */}
      <form onSubmit={handleEmailLogin} className={styles.form}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email"
          className={styles.input}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Password"
          className={styles.input}
        />
        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? "Logging in..." : "Login with Email"}
        </button>
      </form>

      {/* Separator */}
      <div className={styles.separator}>
        <hr className={styles.hr} />
        <p>Or log in with</p>
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

        <button
          onClick={() => handleOAuthLogin("slack")}
          disabled={loading}
          className={styles.oauthButton}
        >
          <Image
            src="/images/slack-logo.svg"
            alt="Slack logo"
            width={20}
            height={20}
          />
          {loading ? "Logging in..." : "Login with Slack"}
        </button>
      </div>

      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
    </div>
  );
}
