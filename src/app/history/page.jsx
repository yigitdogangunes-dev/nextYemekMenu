import HistoryClient from "@/components/HistoryClient";

// SEO ve sayfa başlığı için bonus (Sadece Server Component'larda yapılabilir)
export const metadata = {
  title: "</kodpilot> Harcamalar",
  description: "Geçmiş harcama ve adisyon kayıtları.",
};

export default function HistoryPage() {
  return (
    <main>
      {/* Az önce kopyaladığımız o devasa motoru buraya bir lego gibi takıyoruz */}
      <HistoryClient />
    </main>
  );
}