import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CompletionProgressProps {
  percentage: number;
  label: string;
}

export function CompletionProgress({ percentage, label }: CompletionProgressProps) {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="relative h-32 w-32">
            <svg className="h-32 w-32 -rotate-90 transform">
              <circle
                cx="64"
                cy="64"
                r="45"
                stroke="hsl(var(--muted))"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="45"
                stroke="hsl(var(--success))"
                strokeWidth="10"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-foreground">{percentage}%</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Task Completion Rate</p>
        </div>
      </CardContent>
    </Card>
  );
}
