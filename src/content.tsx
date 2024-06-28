//content.tsx
import cssText from "data-text:~style.css"
import type { PlasmoCSConfig, PlasmoGetOverlayAnchorList } from "plasmo"
import React, { useState, useEffect, useCallback } from "react"
import { HiSparkles } from "react-icons/hi"
import { FaWandMagicSparkles } from "react-icons/fa6"
import PromptModal from "~features/PromptModal"

// Configuration for Plasmo
export const config: PlasmoCSConfig = {
  matches: ["https://*.linkedin.com/*"]
}

// Function to inject styles
export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

// Function to get overlay anchor list
export const getOverlayAnchorList: PlasmoGetOverlayAnchorList = async () =>
  document.querySelectorAll(".msg-form__contenteditable p")

// Unique ID for shadow host
export const getShadowHostId = () => "plasmo-inline-example-unique-id"

// Props interface for PlasmoOverlay component
interface PlasmoOverlayProps {
  anchor: {
    element: HTMLTextAreaElement
  }
}

const PlasmoOverlay: React.FC<PlasmoOverlayProps> = ({ anchor }) => {
  const [isFocused, setIsFocused] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const textarea = anchor.element
  // Error handling: Use optional chaining to safely access the focus element
  const focus = document.querySelector(".msg-form__contenteditable")

  // Handle clicks outside the textarea
  const handleClickOutside = useCallback((event: MouseEvent) => {
    // Error handling: Check if focus element exists before using it
    if (!focus) {
      console.warn("Focus element not found")
      return
    }

    // Error handling: Type guard to ensure event.target is a Node
    if (!(event.target instanceof Node)) {
      console.warn("Invalid event target")
      return
    }

    if (!focus.contains(event.target)) {
      setIsFocused(false)
    } else {
      setIsFocused(true)
    }
  }, [focus])

  // Set up and clean up event listener
  useEffect(() => {
    document.addEventListener('click', handleClickOutside)
    // Clean up function to remove event listener
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [handleClickOutside])

  // Handler to open the modal
  const handleOpenModal = () => {
    setIsOpen(true)
  }

  return (
    <div className="relative">
      {/* Conditional rendering of the magic wand button */}
      {isFocused && (
        <div className="absolute top-24 -right-[38rem] bg-white rounded-full p-2 cursor-pointer shadow-md transition-all hover:shadow-lg">
          {isOpen ? (
            <HiSparkles className="text-xl text-[#3b82f6]" />
          ) : (
            <FaWandMagicSparkles
              onClick={handleOpenModal}
              className="text-xl text-[#3b82f6]"
            />
          )}
        </div>
      )}
      {/* PromptModal component */}
      <PromptModal 
        textarea={textarea} 
        isOpen={isOpen} 
        setIsOpen={setIsOpen} 
      />
    </div>
  )
}

export default PlasmoOverlay