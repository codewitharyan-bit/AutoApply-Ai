export default function AutoApplySkeleton() {
  const pulse = 'animate-pulse bg-white/[0.04] rounded-lg'
  return (
    <div className="flex flex-col gap-5">
      <div className="space-y-2">
        <div className={`h-8 w-48 ${pulse}`} />
        <div className={`h-4 w-72 ${pulse}`} />
      </div>
      <div className={`h-14 ${pulse}`} />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={`h-28 ${pulse}`} />
        ))}
      </div>
      <div className={`h-24 ${pulse}`} />
      <div className={`h-64 ${pulse}`} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className={`h-48 ${pulse}`} />
        <div className={`h-48 ${pulse}`} />
      </div>
      <div className={`h-40 ${pulse}`} />
      <div className={`h-48 ${pulse}`} />
    </div>
  )
}
