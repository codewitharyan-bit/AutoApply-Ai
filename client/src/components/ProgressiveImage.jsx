import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function ProgressiveImage({ src, alt, initials, className = '', width, height }) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const imgRef = useRef(null)

  useEffect(() => {
    if (!imgRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const img = new Image()
          img.onload = () => setLoaded(true)
          img.onerror = () => setError(true)
          img.src = src
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(imgRef.current)
    return () => observer.disconnect()
  }, [src])

  const webpSrc = src?.replace(/\.(jpg|jpeg|png)$/i, '.webp')

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {!loaded && !error && (
        <motion.div
          className="absolute inset-0 bg-white/5"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-pulse" />
        </motion.div>
      )}
      {error ? (
        <div className="w-full h-full flex items-center justify-center bg-white/5 rounded-lg">
          {initials ? (
            <span className="text-lg font-bold text-text-secondary">{initials}</span>
          ) : (
            <span className="material-symbols-outlined text-text-secondary">broken_image</span>
          )}
        </div>
      ) : (
        <>
          <picture>
            <source srcSet={webpSrc} type="image/webp" />
            <img
              src={src}
              alt={alt}
              loading="lazy"
              onLoad={() => setLoaded(true)}
              onError={() => setError(true)}
              className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            />
          </picture>
        </>
      )}
    </div>
  )
}
