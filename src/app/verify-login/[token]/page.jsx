import VerifyLoginClient from "@/pages/VerifyLoginClient";

export const metadata = {
  title: "</kodpilot> Giriş Doğrulanıyor...",
  description: "Şifresiz bağlantı ile sisteme giriş yapılıyor.",
};

export default async function VerifyLoginPage({ params }) {
  // Next.js 15+ için params bir Promise'dir, önce await edilmesi gerekir
  const resolvedParams = await params;
  const { token } = resolvedParams;

  return (
    <main>
      <VerifyLoginClient token={token} />
    </main>
  );
}
