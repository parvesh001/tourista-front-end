import React from "react";
import { useParams } from "react-router-dom";
import ResetPasswordForm from "../../components/user/authForms/ResetPasswordForm";

export default function ResetPassword() {
  const { resetToken } = useParams();
  return <ResetPasswordForm resetToken={resetToken} />;
}
