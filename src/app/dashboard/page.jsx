import DashboardClient from "@/pages/DashboardClient";

export const metadata = {
  title: "</kodpilot> Finansal Dashboard",
  description: "Harcama analizi ve istatistikler.",
};

export default function DashboardPage() {
  return (
    <main>
      <DashboardClient />
    </main>
  );
}
