/**
 * Calculate the weighted load score from quantitative metrics
 */
export function calcLoadScore(metricValues, metrics) {
  return metrics.reduce((sum, metric) => {
    const val = metricValues[metric.id] ?? 0;
    return sum + val * metric.weight;
  }, 0);
}

/**
 * Calculate the final composite score from load score + subjective metrics
 */
export function calcFinalScore(loadScore, loadScoreWeight, subjectiveValues, subjectiveMetrics) {
  const subjectiveTotal = subjectiveMetrics.reduce((sum, metric) => {
    const val = subjectiveValues[metric.id] ?? 0;
    return sum + val * metric.weight;
  }, 0);
  return loadScore * loadScoreWeight + subjectiveTotal;
}

/**
 * Calculate all scores for a single PM entry
 */
export function calcPMScores(pmData, config) {
  const loadScore = calcLoadScore(pmData.metrics, config.metrics);
  const finalScore = calcFinalScore(
    loadScore,
    config.loadScoreWeight,
    pmData.subjective,
    config.subjectiveMetrics
  );
  return { loadScore, finalScore };
}

/**
 * Get a color class based on score thresholds
 */
export function getScoreColor(score, maxReasonable = 100) {
  const pct = (score / maxReasonable) * 100;
  if (pct < 33) return 'text-green-600';
  if (pct < 66) return 'text-amber-500';
  return 'text-red-600';
}

export function getScoreBgColor(score, maxReasonable = 100) {
  const pct = (score / maxReasonable) * 100;
  if (pct < 33) return 'bg-green-50 border-green-200';
  if (pct < 66) return 'bg-amber-50 border-amber-200';
  return 'bg-red-50 border-red-200';
}

export function getScoreBarColor(score, maxReasonable = 100) {
  const pct = (score / maxReasonable) * 100;
  if (pct < 33) return '#22c55e';
  if (pct < 66) return '#f59e0b';
  return '#ef4444';
}
