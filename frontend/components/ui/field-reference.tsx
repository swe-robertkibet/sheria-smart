"use client"

import * as React from "react"
import { ChevronDown, ChevronUp, Copy, FileText, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { generateFieldReference, fromCamelCase } from "@/lib/field-mapping"
import { cn } from "@/lib/utils"

export interface FieldReferenceProps {
  fields: Array<{ key: string; label: string; required: boolean }>
  className?: string
}

export function FieldReference({ fields, className }: FieldReferenceProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [copiedSection, setCopiedSection] = React.useState<string | null>(null)
  
  const reference = generateFieldReference(fields)

  const copyToClipboard = async (content: string, sectionName: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedSection(sectionName)
      setTimeout(() => setCopiedSection(null), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  const copyAllFieldNames = () => {
    const jsonTemplate = reference.allKeys.reduce((acc, key) => {
      acc[key] = `// ${fromCamelCase(key)}`
      return acc
    }, {} as Record<string, string>)
    
    const jsonString = JSON.stringify(jsonTemplate, null, 2)
    copyToClipboard(jsonString, 'all')
  }

  const copyRequiredFieldNames = () => {
    const jsonTemplate = reference.requiredKeys.reduce((acc, key) => {
      acc[key] = `// ${fromCamelCase(key)}`
      return acc
    }, {} as Record<string, string>)
    
    const jsonString = JSON.stringify(jsonTemplate, null, 2)
    copyToClipboard(jsonString, 'required')
  }

  const copyCategoryFields = (categoryFields: Array<{ key: string; label: string; required: boolean }>, categoryName: string) => {
    const jsonTemplate = categoryFields.reduce((acc, field) => {
      acc[field.key] = `// ${field.label}`
      return acc
    }, {} as Record<string, string>)
    
    const jsonString = JSON.stringify(jsonTemplate, null, 2)
    copyToClipboard(jsonString, categoryName)
  }

  return (
    <div className={cn("border border-gray-200 rounded-lg bg-gray-50", className)}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            className="w-full justify-between p-4 h-auto font-normal hover:bg-gray-100"
          >
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Field Reference Guide
              </span>
              <Badge variant="secondary" className="text-xs">
                {reference.allKeys.length} fields
              </Badge>
            </div>
            {isOpen ? (
              <ChevronUp className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            )}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="px-4 pb-4">
          <div className="space-y-4">
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={copyAllFieldNames}
                className="text-xs"
              >
                <Copy className="w-3 h-3 mr-1" />
                {copiedSection === 'all' ? 'Copied!' : 'Copy All Fields'}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={copyRequiredFieldNames}
                className="text-xs"
              >
                <Copy className="w-3 h-3 mr-1" />
                {copiedSection === 'required' ? 'Copied!' : 'Copy Required Only'}
              </Button>
            </div>

            {/* Field Categories */}
            <div className="space-y-4">
              {Object.entries(reference.byCategory).map(([category, categoryFields]) => (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-800">{category}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => copyCategoryFields(categoryFields, category)}
                      className="text-xs h-6 px-2"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      {copiedSection === category ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                  
                  <div className="grid gap-1 pl-2">
                    {categoryFields.map((field) => (
                      <div key={field.key} className="flex items-center justify-between text-xs">
                        <code className="bg-white px-2 py-1 rounded border text-gray-700 font-mono">
                          {field.key}
                        </code>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500 text-xs">{field.label}</span>
                          {field.required && (
                            <Badge variant="destructive" className="text-xs px-1">
                              Required
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Usage Instructions */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h5 className="text-sm font-medium text-blue-800 mb-2">How to use:</h5>
              <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
                <li>Copy the field template above or use the field names exactly as shown</li>
                <li>Replace the comment values with your actual data</li>
                <li>Paste the JSON using the "Paste from Clipboard" button</li>
                <li>The system will automatically match field names and fill the form</li>
              </ol>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}