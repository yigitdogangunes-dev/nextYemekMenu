import ResetPasswordClient from "@/pages/ResetPasswordClient";

export const metadata = {
  title: "Şifre Sıfırla | Kodpilot Yemek",
  description: "Yeni şifrenizi belirleyin.",
};

export default async function ResetPasswordPage({ params }) {
  const { token } = await params;
  
  return <ResetPasswordClient token={token} />;
}
