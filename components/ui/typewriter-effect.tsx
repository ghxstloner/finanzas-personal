"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export const TypewriterEffect = ({
  words,
  className,
  cursorClassName,
}: {
  words: Array<{ text: string; className?: string }>
  className?: string
  cursorClassName?: string
}) => {
  // Split text inside of words into array of characters
  const wordsArray = words.map((word) => {
    return {
      ...word,
      text: word.text.split(""),
    }
  })

  const renderWords = () => {
    return (
      <div>
        {wordsArray.map((word, idx) => {
          return (
            <div key={`word-${idx}`} className="inline-block">
              {word.text.map((char, index) => (
                <motion.span
                  initial={{
                    opacity: 0.5,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  transition={{
                    duration: 0.3,
                    delay: idx * 0.1 + index * 0.05,
                  }}
                  className={cn(
                    `dark:text-white text-black`,
                    word.className
                  )}
                  key={`char-${index}`}
                >
                  {char}
                </motion.span>
              ))}
              &nbsp;
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className={cn("text-base sm:text-xl md:text-3xl lg:text-5xl font-bold", className)}>
      <motion.div
        className="inline-block rounded-md"
        initial={{
          width: "0%",
        }}
        whileInView={{
          width: "fit-content",
        }}
        transition={{
          duration: 2,
          ease: "linear",
          delay: 1,
        }}
      >
        <div
          className="inline-block overflow-hidden"
          style={{
            whiteSpace: "nowrap",
          }}
        >
          {renderWords()}{" "}
        </div>{" "}
      </motion.div>
      <motion.span
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className={cn(
          "inline-block rounded-sm w-[4px] h-4 md:h-6 lg:h-10 bg-blue-500",
          cursorClassName
        )}
      ></motion.span>
    </div>
  )
}