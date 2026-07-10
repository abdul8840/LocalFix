/**
 * Composite worker score:
 *   proximity  (closer = better)   → 40%
 *   rating     (higher = better)   → 35%
 *   experience & jobs (more = better) → 25%
 *
 * All signals normalized to [0, 1] before weighting.
 */
const WEIGHTS = { distance: 0.40, rating: 0.35, success: 0.25 };
const MAX_DISTANCE_KM = 50;

const normalize = (value, min, max) => {
  if (value === null || value === undefined) return 0;
  const clamped = Math.max(min, Math.min(max, value));
  return (clamped - min) / (max - min || 1);
};

export const scoreWorker = (worker) => {
  // Proximity: invert distance (closer → higher score)
  const distScore = worker.distance_km === null || worker.distance_km === undefined
    ? 0.5 // unknown location → neutral
    : 1 - normalize(worker.distance_km, 0, MAX_DISTANCE_KM);

  // Rating: 0..5 → 0..1
  const ratingScore = normalize(worker.rating_avg || 0, 0, 5);

  // Success signal blends jobs completed + reviews as a proxy for reliability
  const jobsSignal = normalize(worker.jobs_completed || 0, 0, 50);
  const reviewsSignal = normalize(worker.total_reviews || 0, 0, 30);
  const successScore = (jobsSignal + reviewsSignal) / 2;

  const score =
    WEIGHTS.distance * distScore +
    WEIGHTS.rating   * ratingScore +
    WEIGHTS.success  * successScore;

  return +score.toFixed(4);
};

export const rankWorkers = (workers) =>
  workers
    .map((w) => ({ ...w, match_score: scoreWorker(w) }))
    .sort((a, b) => b.match_score - a.match_score);