import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onClick: () => void;
}

export default function EnhanceButton({
  onClick,
}: Props) {
  return (
    <Button
      onClick={onClick}
      className="w-full mt-8 h-12"
    >
      <Sparkles className="mr-2 h-5 w-5" />

      Enhance Audio
    </Button>
  );
}