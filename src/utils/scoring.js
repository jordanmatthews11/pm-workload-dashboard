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
  if (pct < 33) return 'text-[#81D994]';
  if (pct < 66) return 'text-[#FFA450]';
  return 'text-[#7554C2]';
}

export function getScoreBgColor(score, maxReasonable = 100) {
  const pct = (score / maxReasonable) * 100;
  if (pct < 33) return 'bg-green-50 border-green-200';
  if (pct < 66) return 'bg-amber-50 border-amber-200';
  return 'bg-[#ECE5FF] border-[#C39CFF]';
}

export function getScoreBarColor(score, maxReasonable = 100) {
  const pct = (score / maxReasonable) * 100;
  if (pct < 33) return '#81D994';
  if (pct < 66) return '#FFA450';
  return '#7554C2';
}
