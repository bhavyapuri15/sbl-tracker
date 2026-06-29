import { SBL } from "@/config/sbl"
import type { Exercise, MuscleGroup, WeeklyVolume, VolumeLandmark } from "@/types/domain"

type SetEntry = {
  exercise: Exercise
  setCount: number
  setType: "warmup" | "working" | "drop" | "failure"
}

/**
 * Aggregate weekly sets per muscle group from a list of logged set entries.
 * Primary muscles count as 1.0 set; secondary as SBL.secondaryMuscleWeight.
 */
export function aggregateWeeklyVolume(
  sets: SetEntry[]
): Map<MuscleGroup, number> {
  const totals = new Map<MuscleGroup, number>()

  for (const { exercise, setCount, setType } of sets) {
    if (setType === "warmup") continue  // warmups don't count for MEV/MRV

    for (const muscle of exercise.primary_muscles as MuscleGroup[]) {
      totals.set(muscle, (totals.get(muscle) ?? 0) + setCount)
    }
    for (const muscle of exercise.secondary_muscles as MuscleGroup[]) {
      totals.set(
        muscle,
        (totals.get(muscle) ?? 0) + setCount * SBL.secondaryMuscleWeight
      )
    }
  }

  return totals
}

export function getVolumeStatus(
  sets: number,
  landmark: (typeof SBL.volumeLandmarks)[string]
): WeeklyVolume["status"] {
  if (sets < landmark.mev) return "below_mev"
  if (sets > landmark.mrv) return "above_mrv"
  return "optimal"
}

export function buildWeeklyVolumeSummary(
  sets: SetEntry[],
  landmarks: VolumeLandmark[]
): WeeklyVolume[] {
  const totals = aggregateWeeklyVolume(sets)
  const landmarkMap = new Map(landmarks.map((l) => [l.muscle_group, l]))

  const muscles = Object.keys(SBL.volumeLandmarks) as MuscleGroup[]
  return muscles.map((muscle) => {
    const muscleSetCount = Math.round((totals.get(muscle) ?? 0) * 10) / 10
    const config = SBL.volumeLandmarks[muscle]
    const landmark = landmarkMap.get(muscle) ?? {
      id: "",
      muscle_group: muscle,
      mv_sets: config.mv,
      mev_sets: config.mev,
      mav_lower: config.mavLow,
      mav_upper: config.mavHigh,
      mrv_sets: config.mrv,
      source: null,
    }

    return {
      muscle,
      sets: muscleSetCount,
      landmark,
      status: totals.has(muscle)
        ? getVolumeStatus(muscleSetCount, config)
        : "no_data",
    }
  })
}
