import WelcomePage from "@/components/Welcome";
import { Toaster } from "react-hot-toast";

export default function Home() {
  return (
    <div>
      <Toaster position="bottom-right" />
      <WelcomePage />
    </div>
  );
}
