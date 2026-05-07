import AdminClient from "@/pages/AdminClient";

export const metadata = {
  title: "</kodpilot> Admin Paneli",
  description: "Kullanıcı ve yemek yönetimi.",
};

export default function AdminPage() {
  return (
    <main>
      <AdminClient />
    </main>
  );
}
