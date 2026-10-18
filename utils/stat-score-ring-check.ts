export function getScoreRingColor(score: number, maxScore: number = 100): string {
  const percentage = (score / maxScore) * 100;

  switch (true) {
    case percentage >= 80:
      return "ring-green-500 text-green-600";
    case percentage >= 60:
      return "ring-blue-500 text-blue-500";
    case percentage >= 40:
      return "ring-yellow-500 text-yellow-600";
    case percentage >= 20:
      return "ring-orange-500 text-orange-600";
    default:
      return "ring-red-500 text-red-600";
  }
}