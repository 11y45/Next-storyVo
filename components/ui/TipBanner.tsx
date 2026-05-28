import { Info } from "lucide-react";

interface TipBannerProps {
  message: React.ReactNode;
}

export function TipBanner({ message }: TipBannerProps) {
  return (
    <div className="bg-amber-50/60 border border-amber-100/70 rounded-xl p-4 flex items-start gap-3">
      <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
      <p className="text-xs sm:text-sm text-amber-800 font-medium leading-normal">
        {message}
      </p>
    </div>
  );
}
