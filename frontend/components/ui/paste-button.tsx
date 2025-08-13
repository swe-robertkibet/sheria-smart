"use client"

import * as React from "react"
import { Clipboard, ClipboardCheck, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useClipboard, type ClipboardResult } from "@/hooks/use-clipboard"
import { cn } from "@/lib/utils"

export interface PasteButtonProps {
  onPaste: (data: Record<string, any>) => void
  onError?: (error: string) => void
  className?: string
  disabled?: boolean
  size?: "default" | "sm" | "lg"
  variant?: "default" | "outline" | "secondary" | "ghost"
}

export function PasteButton({
  onPaste,
  onError,
  className,
  disabled = false,
  size = "default",
  variant = "outline"
}: PasteButtonProps) {
  const { pasteFromClipboard, isLoading, lastResult } = useClipboard()
  const [showSuccess, setShowSuccess] = React.useState(false)

  const handlePaste = React.useCallback(async () => {
    const result: ClipboardResult = await pasteFromClipboard()
    
    if (result.success && result.data) {
      onPaste(result.data)
      setShowSuccess(true)
      
      // Hide success state after 2 seconds
      setTimeout(() => {
        setShowSuccess(false)
      }, 2000)
    } else if (result.error) {
      onError?.(result.error)
    }
  }, [pasteFromClipboard, onPaste, onError])

  const getButtonIcon = () => {
    if (isLoading) {
      return <Loader2 className="animate-spin" />
    }
    if (showSuccess) {
      return <ClipboardCheck />
    }
    if (lastResult && !lastResult.success) {
      return <AlertCircle />
    }
    return <Clipboard />
  }

  const getButtonText = () => {
    if (isLoading) {
      return "Pasting..."
    }
    if (showSuccess) {
      return "Pasted!"
    }
    if (lastResult && !lastResult.success) {
      return "Paste Failed"
    }
    return "Paste from Clipboard"
  }

  const getButtonVariant = () => {
    if (showSuccess) {
      return "default"
    }
    if (lastResult && !lastResult.success) {
      return "destructive" as const
    }
    return variant
  }

  const tooltipContent = (
    <div className="max-w-xs">
      <p className="font-medium mb-1">Paste JSON Data</p>
      <p className="text-xs text-muted-foreground">
        Copy JSON data to your clipboard and click this button to automatically fill all form fields.
      </p>
      <div className="mt-2 text-xs">
        <p className="font-medium">Example format:</p>
        <code className="block mt-1 p-1 bg-muted rounded text-xs">
          {`{"fieldName": "value", "anotherField": "value"}`}
        </code>
      </div>
    </div>
  )

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant={getButtonVariant()}
            size={size}
            onClick={handlePaste}
            disabled={disabled || isLoading}
            className={cn(
              "transition-all duration-200",
              showSuccess && "bg-green-600 hover:bg-green-700 text-white",
              lastResult && !lastResult.success && "bg-red-600 hover:bg-red-700 text-white",
              className
            )}
          >
            {getButtonIcon()}
            <span className="ml-2">{getButtonText()}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}