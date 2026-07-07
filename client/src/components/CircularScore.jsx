import { motion } from 'framer-motion'

function getScoreColor(score) {
  if (score == null) return '#52525B'
  if (score >= 90) return '#10B981'
  if (score >= 75) return '#3B82F6'
  if (score >= 60) return '#F59E0B'
  return '#52525B'
}

function getScoreLabel(score) {
  if (score == null) return 'No score'
  if (score >= 90) return 'Excellent Match'
  if (score >= 75) return 'Strong Match'
  if (score >= 60) return 'Good Match'
  return 'Basic Match'
}

export default function CircularScore({ score, size = 52, strokeWidth = 4 }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const color = getScoreColor(score)
  const offset = score != null ? circumference - (score / 100) * circumference : circumference

  return (
    <div className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-bold leading-none" style={{ fontSize: size * 0.28, color }}>
          {score != null ? score : '--'}
        </span>
        {size >= 48 && (
          <span className="text-[6px] text-text-secondary/50 leading-tight mt-0.5">match</span>
        )}
      </div>
    </div>
  )
}
