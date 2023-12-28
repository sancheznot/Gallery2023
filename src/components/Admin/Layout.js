"use client";
import { useSession } from "next-auth/react";
import React from "react";
import AdmVerification from "./AdmVerification";
import NewCategories from "./AdminForms/NewCategories";

const Layout = () => {
  const { data: session } = useSession();
  const isAdmin = session?.user.isAdmin;

  if (!isAdmin) {
    return (
      <div>
        <h1>Not admin</h1>
      </div>
    );
  } else {
    return (
      <div>
        <h1>Admin</h1>
        <NewCategories />
      </div>
    );
  }
};

export default Layout;
