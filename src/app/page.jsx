import HomeClient from "@/pages/HomeClient";

export const metadata = {
  title: "</kodpilot> Anasayfa",
  description: "Günlük yemek seçim ekranı.",
};

export default function HomePage() {
  return (
    <main>
      <HomeClient />
    </main>
  );
}