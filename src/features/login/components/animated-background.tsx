"use client"

import { useEffect, useRef } from "react"

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const googleColors = [
      { hue: 217, sat: 89, light: 61 }, // Google Blue
      { hue: 4, sat: 90, light: 58 }, // Google Red
      { hue: 45, sat: 100, light: 51 }, // Google Yellow
      { hue: 142, sat: 71, light: 49 }, // Google Green
      { hue: 291, sat: 64, light: 42 }, // Purple
      { hue: 24, sat: 100, light: 50 }, // Orange
      { hue: 195, sat: 100, light: 39 }, // Cyan
    ]

    const cornerParticles: Array<{
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      rotation?: number
      rotationSpeed?: number
      color: { hue: number; sat: number; light: number }
      opacity: number
      isGeometric: boolean
      corner: "topLeft" | "topRight" | "bottomLeft" | "bottomRight"
      isFront: boolean // Added to determine if element is in front
      isOutlined: boolean // Added to determine if element should be outlined
    }> = []

    // Initialize 7 particles positioned in corners
    const corners = ["topLeft", "topRight", "bottomLeft", "bottomRight"] as const

    for (let i = 0; i < 7; i++) {
      const corner = corners[i % 4]
      const isGeometric = Math.random() > 0.5

      let x, y
      const margin = 100
      const spread = 200

      switch (corner) {
        case "topLeft":
          x = Math.random() * spread + margin
          // Front elements positioned lower, can go off-screen
          y = isGeometric ? Math.random() * spread + canvas.height * 0.6 : Math.random() * spread + margin
          break
        case "topRight":
          x = canvas.width - spread - margin + Math.random() * spread
          // Front elements positioned lower, can go off-screen
          y = isGeometric ? Math.random() * spread + canvas.height * 0.6 : Math.random() * spread + margin
          break
        case "bottomLeft":
          x = Math.random() * spread + margin
          // Front elements can extend below screen
          y = isGeometric
            ? canvas.height - margin + Math.random() * 150
            : canvas.height - spread - margin + Math.random() * spread
          break
        case "bottomRight":
          x = canvas.width - spread - margin + Math.random() * spread
          // Front elements can extend below screen
          y = isGeometric
            ? canvas.height - margin + Math.random() * 150
            : canvas.height - spread - margin + Math.random() * spread
          break
      }

      const size = Math.random() * 30 + 20
      const isFront = size > 35 || Math.random() > 0.6
      const isOutlined = isFront && Math.random() > 0.5

      const particle: any = {
        x,
        y,
        size,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        color: googleColors[i % googleColors.length],
        opacity: isFront ? 1 : Math.random() * 0.3 + 0.2,
        isGeometric,
        corner,
        isFront,
        isOutlined,
      }

      if (isGeometric) {
        particle.rotation = Math.random() * 360
        particle.rotationSpeed = (Math.random() - 0.5) * 1.2
      }

      cornerParticles.push(particle)
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const blueColor = googleColors[0]
      ctx.strokeStyle = `hsla(${blueColor.hue}, ${blueColor.sat}%, ${blueColor.light}%, 0.15)`
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, canvas.height * 0.2)
      ctx.bezierCurveTo(
        canvas.width * 0.15,
        canvas.height * 0.1,
        canvas.width * 0.2,
        canvas.height * 0.3,
        canvas.width * 0.35,
        canvas.height * 0.25,
      )
      ctx.stroke()

      const redColor = googleColors[1]
      ctx.setLineDash([10, 6])
      ctx.strokeStyle = `hsla(${redColor.hue}, ${redColor.sat}%, ${redColor.light}%, 0.2)`
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(canvas.width * 0.75, canvas.height * 0.15)
      ctx.lineTo(canvas.width * 0.9, canvas.height * 0.25)
      ctx.stroke()
      ctx.setLineDash([])

      // Animate corner particles
      cornerParticles.forEach((particle) => {
        particle.x += particle.speedX
        particle.y += particle.speedY

        const margin = 50
        const spread = 250

        switch (particle.corner) {
          case "topLeft":
            if (particle.x < margin || particle.x > margin + spread) particle.speedX *= -1
            if (!particle.isFront && (particle.y < margin || particle.y > margin + spread)) particle.speedY *= -1
            particle.x = Math.max(margin, Math.min(margin + spread, particle.x))
            if (!particle.isFront) {
              particle.y = Math.max(margin, Math.min(margin + spread, particle.y))
            }
            break
          case "topRight":
            const rightX = canvas.width - spread - margin
            if (particle.x < rightX || particle.x > canvas.width - margin) particle.speedX *= -1
            if (!particle.isFront && (particle.y < margin || particle.y > margin + spread)) particle.speedY *= -1
            particle.x = Math.max(rightX, Math.min(canvas.width - margin, particle.x))
            if (!particle.isFront) {
              particle.y = Math.max(margin, Math.min(margin + spread, particle.y))
            }
            break
          case "bottomLeft":
            const bottomY = canvas.height - spread - margin
            if (particle.x < margin || particle.x > margin + spread) particle.speedX *= -1
            if (!particle.isFront && (particle.y < bottomY || particle.y > canvas.height - margin))
              particle.speedY *= -1
            particle.x = Math.max(margin, Math.min(margin + spread, particle.x))
            if (!particle.isFront) {
              particle.y = Math.max(bottomY, Math.min(canvas.height - margin, particle.y))
            }
            break
          case "bottomRight":
            const rightBottomX = canvas.width - spread - margin
            const rightBottomY = canvas.height - spread - margin
            if (particle.x < rightBottomX || particle.x > canvas.width - margin) particle.speedX *= -1
            if (!particle.isFront && (particle.y < rightBottomY || particle.y > canvas.height - margin))
              particle.speedY *= -1
            particle.x = Math.max(rightBottomX, Math.min(canvas.width - margin, particle.x))
            if (!particle.isFront) {
              particle.y = Math.max(rightBottomY, Math.min(canvas.height - margin, particle.y))
            }
            break
        }

        const colorString = `hsl(${particle.color.hue}, ${particle.color.sat}%, ${particle.color.light}%)`
        const alphaColorString = `hsla(${particle.color.hue}, ${particle.color.sat}%, ${particle.color.light}%, ${particle.opacity})`

        if (particle.isGeometric) {
          particle.rotation = (particle.rotation || 0) + (particle.rotationSpeed || 0)
          ctx.save()
          ctx.translate(particle.x, particle.y)
          ctx.rotate(((particle.rotation || 0) * Math.PI) / 180)

          if (particle.isOutlined) {
            ctx.strokeStyle = colorString
            ctx.lineWidth = 3
            ctx.strokeRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size)
          } else {
            ctx.fillStyle = particle.isFront ? colorString : alphaColorString
            ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size)
          }
          ctx.restore()
        } else {
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)

          if (particle.isOutlined) {
            ctx.strokeStyle = colorString
            ctx.lineWidth = 3
            ctx.stroke()
          } else {
            ctx.fillStyle = particle.isFront ? colorString : alphaColorString
            ctx.fill()
          }
        }
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)" }}
    />
  )
}
