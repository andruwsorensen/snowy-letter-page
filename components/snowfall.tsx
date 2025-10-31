"use client"

import { useEffect, useState } from "react"

interface Snowflake {
  id: number
  left: number
  animationDuration: number
  opacity: number
  size: number
  delay: number
}

export function Snowfall() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([])
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [isInteracting, setIsInteracting] = useState(false)

  const handleInteractionStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsInteracting(true)
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX
    const y = 'touches' in e ? e.touches[0].clientY : e.clientY
    setMousePos({ x, y })
  }

  const handleInteractionMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isInteracting) return
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX
    const y = 'touches' in e ? e.touches[0].clientY : e.clientY
    setMousePos({ x, y })
  }

  const handleInteractionEnd = () => {
    setIsInteracting(false)
  }

  useEffect(() => {
    const flakes: Snowflake[] = []
    for (let i = 0; i < 50; i++) {
      flakes.push({
        id: i,
        left: Math.random() * 100,
        animationDuration: Math.random() * 5 + 5,
        opacity: Math.random() * 0.6 + 0.4,
        size: Math.random() * 20 + 25,
        delay: Math.random() * 5,
      })
    }
    setSnowflakes(flakes)

    // Initial snowflakes setup only
  }, [])

  return (
    <div 
      className="absolute inset-0 overflow-hidden"
      onMouseDown={handleInteractionStart}
      onMouseMove={handleInteractionMove}
      onMouseUp={handleInteractionEnd}
      onMouseLeave={handleInteractionEnd}
      onTouchStart={handleInteractionStart}
      onTouchMove={handleInteractionMove}
      onTouchEnd={handleInteractionEnd}
    >
      {snowflakes.map((flake) => {
        let deflectionX = 0;
        let deflectionY = 0;
        
        if (isInteracting) {
          // Calculate snowflake position based on its percentage and viewport
          const snowflakeX = (window.innerWidth * flake.left) / 100;
          const snowflakeY = window.innerHeight * 
            (((Date.now() / 1000 - flake.delay) % flake.animationDuration) / flake.animationDuration);

          // Calculate distance from mouse/touch point
          const dx = snowflakeX - mousePos.x;
          const dy = snowflakeY - mousePos.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Apply deflection if within range
          if (distance < 150) {
            const force = (150 - distance) / 150; // Stronger effect when closer
            deflectionX = (dx / distance) * force * 50;
            deflectionY = (dy / distance) * force * 50;
          }
        }

        return (
          <div
            key={flake.id}
            className="snowflake absolute text-white will-change-transform"
            style={{
              left: `${flake.left}%`,
              animationDuration: `${flake.animationDuration}s`,
              animationDelay: `${flake.delay}s`,
              opacity: 0,
              fontSize: `${flake.size}px`,
              animation: `snowfall ${flake.animationDuration}s linear ${flake.delay}s infinite`,
              transform: `translate(${deflectionX}px, ${deflectionY}px)`,
              transition: 'transform 0.2s ease-out',
            }}
          >
            {"❄"}
          </div>
        )
      })}

      <style jsx>{`
        @keyframes snowfall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(360deg);
            opacity: 1;
          }
        }

        .snowflake {
          will-change: transform;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}