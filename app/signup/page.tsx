"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";
import styles from "@/styles/Auth.module.css";
import Image from "next/image";

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
    <div className={styles.container}>
      <h1>Sign Up</h1>

      {/* Email and Password Signup Form */}
      <form onSubmit={handleEmailSignUp} className={styles.form}>
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
          {loading ? "Signing up..." : "Sign Up with Email"}
        </button>
      </form>

      {/* Separator */}
      <div className={styles.separator}>
        <hr className={styles.hr} />
        <p>Or sign up with</p>
      </div>

      {/* OAuth Sign Up Options with Logos */}
      <div>
        <button
          onClick={() => handleOAuthSignUp("google")}
          disabled={loading}
          className={styles.oauthButton}
        >
          <Image
            src="/images/google-logo.svg"
            alt="Google logo"
            width={20}
            height={20}
          />
          {loading ? "Signing up..." : "Sign up with Google"}
        </button>

        <button
          onClick={() => handleOAuthSignUp("github")}
          disabled={loading}
          className={styles.oauthButton}
        >
          <Image
            src="/images/github-logo.svg"
            alt="GitHub logo"
            width={20}
            height={20}
          />
          {loading ? "Signing up..." : "Sign up with GitHub"}
        </button>

        <button
          onClick={() => handleOAuthSignUp("slack")}
          disabled={loading}
          className={styles.oauthButton}
        >
          <Image
            src="/images/slack-logo.svg"
            alt="Slack logo"
            width={20}
            height={20}
          />
          {loading ? "Signing up..." : "Sign up with Slack"}
        </button>
      </div>

      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
    </div>
  );
}
