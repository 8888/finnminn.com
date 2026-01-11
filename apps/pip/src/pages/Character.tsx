import { Button } from "@finnminn/ui";
import { Mascot } from "../components/Mascot";
import { useNavigate } from "react-router-dom";

export function Character() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-4">
      <Mascot />
      
      <h1 className="font-pixel text-6xl text-radical">Character</h1>
      
      <div className="p-8 border-2 border-gloom bg-crypt shadow-hard-green w-full max-w-md">
        <div className="flex flex-col gap-4">
            <StatRow label="Identity" value="Pip the Bat" />
            <StatRow label="Level" value="01" />
            <StatRow label="XP" value="0 / 100" />
            <StatRow label="Health" value="100%" />
            <StatRow label="Habits Met" value="0" />
        </div>
      </div>

      <Button onClick={() => navigate("/")}>Back to Void</Button>
    </div>
  );
}

function StatRow({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex justify-between border-b border-gloom pb-2">
            <span className="text-ash uppercase text-sm">{label}</span>
            <span className="text-toxic font-bold">{value}</span>
        </div>
    );
}
