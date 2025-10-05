"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Maximize2, Minimize2 } from "lucide-react"
import Image from "next/image"

const bookData = {
  cover: {
    image: "/images/book-cover-new.png",
    alt: "Portada - Luma & Her Trip to Earth",
  },
  pages: [
    {
      left: { image: "/images/book-cover.png", alt: "Luma se presenta" },
      right: { image: "/images/page-1.png", alt: "Luma interfiere con satélite" },
    },
    {
      left: { image: "/images/page-2.png", alt: "Luma se dirige a la Tierra" },
      right: { image: "/images/page-3.png", alt: "Efectos del GPS" },
    },
    {
      left: { image: "/images/page-4.png", alt: "Apagones y auroras" },
      right: { image: "/images/page-5.png", alt: "Atlas lee sobre Luma" },
    },
    {
      left: { image: "/images/page-6.png", alt: "Atlas aprende más" },
      right: { image: "/images/page-7.png", alt: "Fin del viaje de Luma" },
    },
  ],
  ending: {
    image: "/images/book-ending.png",
    alt: "Contraportada - An Interessan story for young readers",
  },
}

export default function BookViewer() {
  const [showInitial, setShowInitial] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationDirection, setAnimationDirection] = useState<"next" | "prev" | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const totalSlides = bookData.pages.length + 2 // +1 for cover, +1 for ending

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showInitial) {
        if (e.key === "ArrowRight") nextSlide()
        if (e.key === "ArrowLeft") prevSlide()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showInitial, currentSlide, isAnimating])

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!showInitial) {
        if (e.deltaY > 0 || e.deltaX > 0) nextSlide()
        if (e.deltaY < 0 || e.deltaX < 0) prevSlide()
      }
    }
    window.addEventListener("wheel", handleWheel, { passive: true })
    return () => window.removeEventListener("wheel", handleWheel)
  }, [showInitial, currentSlide, isAnimating])

  useEffect(() => {
    let touchStartX = 0
    const handleTouchStart = (e: TouchEvent) => {
      if (!showInitial) touchStartX = e.changedTouches[0].screenX
    }
    const handleTouchEnd = (e: TouchEvent) => {
      if (!showInitial) {
        const touchEndX = e.changedTouches[0].screenX
        const diff = touchStartX - touchEndX
        if (Math.abs(diff) > 50) {
          if (diff > 0) nextSlide()
          else prevSlide()
        }
      }
    }
    window.addEventListener("touchstart", handleTouchStart, { passive: true })
    window.addEventListener("touchend", handleTouchEnd, { passive: true })
    return () => {
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchend", handleTouchEnd)
    }
  }, [showInitial, currentSlide, isAnimating])

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1 && !isAnimating) {
      setIsAnimating(true)
      setAnimationDirection("next")
      setTimeout(() => {
        setCurrentSlide(currentSlide + 1)
        setAnimationDirection(null)
        setIsAnimating(false)
      }, 800)
    }
  }

  const prevSlide = () => {
    if (currentSlide === 0 && !isAnimating) {
      setIsAnimating(true)
      setTimeout(() => {
        setShowInitial(true)
        setIsAnimating(false)
      }, 500)
    } else if (currentSlide > 0 && !isAnimating) {
      setIsAnimating(true)
      setAnimationDirection("prev")
      setTimeout(() => {
        setCurrentSlide(currentSlide - 1)
        setAnimationDirection(null)
        setIsAnimating(false)
      }, 800)
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  if (showInitial) {
    return (
      <div className="relative w-full h-screen bg-[#1A2C4D] overflow-hidden flex flex-col justify-between items-center">
        {/* Stars */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(800)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-[#F1FAEE] rounded-full animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="flex-1 flex items-center justify-center px-4">
          <h1 className="text-[#FFD166] text-6xl md:text-8xl lg:text-9xl font-bold text-center z-10 leading-tight">
            Luma & her trip to the earth
          </h1>
        </div>

        <div
          className="w-0 h-0 border-l-[30px] border-r-[30px] border-t-[40px] border-l-transparent border-r-transparent border-t-[#F1FAEE] mb-8 cursor-pointer z-10 animate-bounce"
          onClick={() => setShowInitial(false)}
        />
      </div>
    )
  }

  return (
    <div className="relative w-full h-screen bg-[#1A2C4D] overflow-hidden">
      {/* Fullscreen button */}
      <Button
        onClick={toggleFullscreen}
        className="fixed top-4 right-4 z-50 bg-[#E63946] hover:bg-[#d32f3e] text-[#F1FAEE] font-bold"
      >
        {isFullscreen ? <Minimize2 className="w-4 h-4 mr-2" /> : <Maximize2 className="w-4 h-4 mr-2" />}
        {isFullscreen ? "Salir" : "Pantalla Completa"}
      </Button>

      {/* Slides container with double frames */}
      <div className="absolute top-0 left-0 w-full h-[75%] bg-[#E63946] p-2">
        <div className="w-full h-full bg-[#FFD166] p-2">
          <div className="relative w-full h-full bg-[#F1FAEE] overflow-hidden">
            {/* Cover slide */}
            {currentSlide === 0 && (
              <div
                className={`absolute inset-0 flex flex-col justify-center items-center p-12 bg-[#F1FAEE] ${
                  animationDirection === "next" ? "animate-curl-next" : ""
                }`}
              >
                <div className="relative w-full max-w-[600px] h-auto max-h-[70vh]">
                  <Image
                    src={bookData.cover.image || "/placeholder.svg"}
                    alt={bookData.cover.alt}
                    width={600}
                    height={450}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}

            {/* Two-page spreads */}
            {bookData.pages.map((spread, index) => {
              const slideIndex = index + 1
              if (currentSlide !== slideIndex) return null

              return (
                <div
                  key={slideIndex}
                  className={`absolute inset-0 flex flex-row bg-[#F1FAEE] ${
                    animationDirection === "next"
                      ? "animate-curl-next"
                      : animationDirection === "prev"
                        ? "animate-curl-prev"
                        : ""
                  }`}
                >
                  {/* Left page */}
                  <div className="flex-1 flex flex-col justify-center items-center p-8 border-r-2 border-[#1A2C4D]">
                    <div className="relative w-full max-w-[500px] h-auto">
                      <Image
                        src={spread.left.image || "/placeholder.svg"}
                        alt={spread.left.alt}
                        width={500}
                        height={400}
                        className="w-full h-auto object-contain rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Book spine */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-r from-[#1A2C4D]/30 via-[#1A2C4D]/60 to-[#1A2C4D]/30 transform -translate-x-1/2 shadow-lg" />

                  {/* Right page */}
                  <div className="flex-1 flex flex-col justify-center items-center p-8 border-l-2 border-[#1A2C4D]">
                    <div className="relative w-full max-w-[500px] h-auto">
                      <Image
                        src={spread.right.image || "/placeholder.svg"}
                        alt={spread.right.alt}
                        width={500}
                        height={400}
                        className="w-full h-auto object-contain rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Ending slide */}
            {currentSlide === totalSlides - 1 && (
              <div
                className={`absolute inset-0 flex flex-col justify-center items-center p-12 bg-[#F1FAEE] ${
                  animationDirection === "prev" ? "animate-curl-prev" : ""
                }`}
              >
                <div className="relative w-full max-w-[600px] h-auto max-h-[70vh]">
                  <Image
                    src={bookData.ending.image || "/placeholder.svg"}
                    alt={bookData.ending.alt}
                    width={600}
                    height={450}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* References section */}
      <div className="absolute bottom-0 left-0 w-full h-[25%] bg-[#1A2C4D] p-4 md:p-8">
        {/* Stars in references */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(300)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-[#F1FAEE] rounded-full animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <h3 className="text-[#FFD166] text-2xl font-bold mb-4 relative z-10">Referencias:</h3>
        <div className="flex gap-8 justify-between relative z-10">
          <div className="flex-1">
            <ul className="list-none space-y-2">
              <li className="text-[#F1FAEE] text-sm font-bold pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-[#4ECDC4]">
                Esmeraldas
              </li>
              <li className="text-[#F1FAEE] text-sm font-bold pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-[#4ECDC4]">
                Ecuador
              </li>
              <li className="text-[#F1FAEE] text-sm font-bold pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-[#4ECDC4]">
                {/* Additional reference here */}
              </li>
            </ul>
          </div>
          <div className="flex-1">
            <ul className="list-none space-y-2">
              <li className="text-[#F1FAEE] text-sm font-bold pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-[#4ECDC4]">
                ATLAS-EC
              </li>
              <li className="text-[#F1FAEE] text-sm font-bold pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-[#4ECDC4]">
                Nasa challenge 2025
              </li>
              <li className="text-[#F1FAEE] text-sm font-bold pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-[#4ECDC4]">
                Spacial Weather
              </li>
            </ul>
          </div>
          <div className="flex-1">
            <ul className="list-none space-y-2">
              <li className="text-[#F1FAEE] text-sm font-bold pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-[#4ECDC4]">
                Dominique Grob
              </li>
              <li className="text-[#F1FAEE] text-sm font-bold pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-[#4ECDC4]">
                Marina Aguilar
              </li>
              <li className="text-[#F1FAEE] text-sm font-bold pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-[#4ECDC4]">
                Emiliano Salvador
              </li>
              <li className="text-[#F1FAEE] text-sm font-bold pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-[#4ECDC4]">
                Gianni Casanova
              </li>
              <li className="text-[#F1FAEE] text-sm font-bold pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-[#4ECDC4]">
                Gerardo Polo
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
