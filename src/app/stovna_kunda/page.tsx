import React from "react";
import SignupForm from "./signup_form";

const SignupPage = async () => {
  const postnummur: {
    bygd: string;
    post_nr: string;
  }[] = (
    await (
      await fetch("https://apex.oracle.com/pls/apex/karij12/api/post_nr")
    ).json()
  ).items;
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <SignupForm post_nr={postnummur} />{" "}
      </div>
    </main>
  );
};

export default SignupPage;
