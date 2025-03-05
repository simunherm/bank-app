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
    <div>
      <SignupForm post_nr={postnummur} />{" "}
    </div>
  );
};

export default SignupPage;
