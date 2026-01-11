import { Button, Typography, Card, Badge } from "@finnminn/ui";
import { Mascot } from "../components/Mascot";
import { useNavigate } from "react-router-dom";

const FIREFLIES = Array.from({ length: 12 }, (_, i) => i);

const Atmosphere = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
       {FIREFLIES.map((i) => (
         <div key={i} className="firefly" />
       ))}
    </div>
  );
};

export function Character() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-4 bg-magic-void relative overflow-hidden">
      <Atmosphere />

      <div className="z-10 flex flex-col items-center gap-8 w-full max-w-md">
        <Mascot />
        
        <Typography.H1>Character</Typography.H1>
        
        <Card className="w-full" variant="magic">
          <div className="flex flex-col gap-4">
              <StatRow label="Identity" value="Pip the Bat" />
              <StatRow label="Level" value="01" />
              <StatRow label="XP" value="0 / 100" />
              <StatRow label="Health" value="100%" isSuccess />
              <StatRow label="Habits Met" value="0" />
          </div>
        </Card>

        <Button onClick={() => navigate("/")} variant="secondary">
          Back to Void
        </Button>
      </div>
    </div>
  );
}

function StatRow({ label, value, isSuccess }: { label: string, value: string, isSuccess?: boolean }) {
    return (
        <div className="flex justify-between items-center border-b border-void/30 pb-2">
            <Typography.Body className="uppercase text-xs !mb-0 text-text-muted">{label}</Typography.Body>
            {isSuccess ? (
                <Badge variant="success">{value}</Badge>
            ) : (
                <Typography.Body className="font-bold text-ectoplasm !mb-0">{value}</Typography.Body>
            )}
        </div>
    );
}
