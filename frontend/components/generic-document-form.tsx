"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2, FileText, Download } from "lucide-react";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { DocumentType, DocumentFormat } from "@/types/document";
import { PasteButton } from "@/components/ui/paste-button";
import { FieldReference } from "@/components/ui/field-reference";
import { mapFieldNames, type FieldMappingResult } from "@/lib/field-mapping";
import { 
  getDocumentTitle, 
  getDocumentDescription, 
  getRequiredFields 
} from "@/lib/document-config";
import {
  processUserInput,
  validateRequiredFields,
  createRequestData
} from "@/lib/document-form-utils";

interface GenericDocumentFormProps {
  onBack: () => void;
  documentType: DocumentType;
}

export function GenericDocumentForm({
  onBack,
  documentType,
}: GenericDocumentFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [selectedFormats, setSelectedFormats] = useState<DocumentFormat[]>([
    DocumentFormat.PDF,
  ]);
  const [pasteError, setPasteError] = useState<string | null>(null);
  const [pasteSuccess, setPasteSuccess] = useState<string | null>(null);
  const [mappingResult, setMappingResult] = useState<FieldMappingResult | null>(
    null
  );

  // Reset scroll position when component mounts
  useScrollToTop();

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleFormatChange = (format: DocumentFormat, checked: boolean) => {
    if (checked) {
      setSelectedFormats((prev) => [...prev, format]);
    } else {
      setSelectedFormats((prev) => prev.filter((f) => f !== format));
    }
  };

  const handlePasteData = (pastedData: Record<string, any>) => {
    setPasteError(null);
    setPasteSuccess(null);
    setMappingResult(null);

    const requiredFields = getRequiredFields(documentType);
    const validFieldKeys = requiredFields.map((field) => field.key);

    // Use smart field mapping
    const result = mapFieldNames(pastedData, validFieldKeys);
    setMappingResult(result);

    // Update form data with mapped fields
    const newFormData = { ...formData, ...result.mappedData };
    setFormData(newFormData);

    // Provide detailed user feedback
    if (result.matchedFields === 0) {
      const topSuggestions = result.suggestions
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 3)
        .map((s) => `"${s.provided}" → "${s.suggested}"`)
        .join(", ");

      setPasteError(
        `No fields could be matched automatically. ${
          topSuggestions
            ? `Try renaming these fields: ${topSuggestions}`
            : "Please check the field reference below for correct field names."
        }`
      );
    } else {
      // Success message with details
      let message = `Successfully filled ${result.matchedFields} field${
        result.matchedFields > 1 ? "s" : ""
      }!`;

      if (result.totalFields > result.matchedFields) {
        message += ` ${result.totalFields - result.matchedFields} field${
          result.totalFields - result.matchedFields > 1 ? "s were" : " was"
        } skipped.`;
      }

      // Add smart mapping info if any fields were auto-converted
      const autoConverted = result.suggestions.filter(
        (s) => s.confidence >= 0.7
      ).length;
      if (autoConverted > 0) {
        message += ` ${autoConverted} field${
          autoConverted > 1 ? "s were" : " was"
        } automatically converted from human-readable format.`;
      }

      setPasteSuccess(message);
    }

    // Clear messages after 6 seconds
    setTimeout(() => {
      setPasteSuccess(null);
      setPasteError(null);
    }, 6000);
  };

  const handlePasteError = (errorMessage: string) => {
    setPasteError(errorMessage);
    setPasteSuccess(null);

    // Clear error message after 5 seconds
    setTimeout(() => {
      setPasteError(null);
    }, 5000);
  };

  // Function to scroll to first missing field
  const scrollToFirstMissingField = (missingFields: string[]) => {
    if (missingFields.length > 0) {
      const firstMissingField = missingFields[0];
      const fieldElement = document.getElementById(firstMissingField);
      if (fieldElement) {
        fieldElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
        // Focus the field for better UX
        fieldElement.focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const requiredFields = getRequiredFields(documentType);
      const missingFields = validateRequiredFields(formData, requiredFields);

      if (missingFields.length > 0) {
        // Scroll to first missing field instead of showing error message
        scrollToFirstMissingField(missingFields);
        setLoading(false);
        return; // Exit early, don't show error message
      }

      if (selectedFormats.length === 0) {
        // Scroll to document formats section
        const formatsElement = document.getElementById('pdf-format') || document.getElementById('docx-format');
        if (formatsElement) {
          formatsElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
          });
        }
        setLoading(false);
        return; // Exit early, don't show error message
      }

      const processedUserInput = processUserInput(formData, documentType);

      const requestData = createRequestData(
        documentType,
        processedUserInput,
        selectedFormats,
        getDocumentTitle
      );

      // Debug logging to see what's being sent

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/documents/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate document");
      }

      const result = await response.json();

      // Check if the result indicates a validation failure
      if (
        result.status === "FAILED" ||
        (result.message && result.message.includes("Validation failed:"))
      ) {
        throw new Error(result.message || "Document validation failed");
      }

      setSuccess(
        `Your legal document has been successfully generated and will be delivered to your registered email address. Request ID: ${result.requestId}`
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate document"
      );
    } finally {
      setLoading(false);
    }
  };

  const fields = getRequiredFields(documentType);

  return (
    <div className="min-h-screen bg-[#FEFCF3]">
      {/* Header */}
      <header className="bg-[#FEFCF3] border-b border-[#F5F5F5] sticky top-0 z-50 h-[64px] px-4">
        <div className="flex items-center gap-4 h-full max-w-full">
          <div className="flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-[#7C9885]"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex-1 min-w-0 h-10 flex flex-col justify-center gap-0.5">
            <h1 
              className="text-sm sm:text-base lg:text-lg font-semibold text-[#2D3748] leading-normal truncate h-[22px]"
              title={getDocumentTitle(documentType)}
            >
              {getDocumentTitle(documentType)}
            </h1>
            <p 
              className="text-xs text-[#718096] leading-normal truncate h-[16px]"
              title={getDocumentDescription(documentType)}
            >
              {getDocumentDescription(documentType)}
            </p>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Paste Button Section */}
          <div className="bg-white border border-[#E5E7EB] border-l-[4px] border-l-[#7C9885] rounded-lg p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#2D3748] mb-2">
                  Quick Fill from Clipboard
                </h3>
                <p className="text-sm text-[#718096]">
                  Have your form data ready in JSON format? Click the button
                  below to automatically fill all matching fields.
                </p>
              </div>
              <div className="flex-shrink-0">
                <PasteButton
                  onPaste={handlePasteData}
                  onError={handlePasteError}
                  size="lg"
                  variant="default"
                  className="bg-[#7C9885] hover:bg-[#7C9885]/90 text-white"
                />
              </div>
            </div>

            {/* Paste Feedback Messages */}
            {pasteError && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="space-y-2">
                  <p className="text-red-800 text-sm font-medium">
                    {pasteError}
                  </p>

                  {/* Show suggestions if available */}
                  {mappingResult && mappingResult.suggestions.length > 0 && (
                    <div className="mt-3 p-2 bg-red-100 rounded border">
                      <p className="text-red-700 text-xs font-medium mb-2">
                        Suggested field name corrections:
                      </p>
                      <div className="space-y-1">
                        {mappingResult.suggestions
                          .slice(0, 5)
                          .map((suggestion, index) => (
                            <div
                              key={index}
                              className="text-xs text-red-600 font-mono"
                            >
                              <span className="bg-red-200 px-1 rounded">
                                "{suggestion.provided}"
                              </span>
                              {" → "}
                              <span className="bg-green-200 px-1 rounded text-green-800">
                                "{suggestion.suggested}"
                              </span>
                              <span className="text-red-500 ml-2">
                                ({Math.round(suggestion.confidence * 100)}%
                                match)
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {pasteSuccess && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="space-y-2">
                  <p className="text-green-800 text-sm font-medium">
                    {pasteSuccess}
                  </p>

                  {/* Show mapping details if available */}
                  {mappingResult && mappingResult.suggestions.length > 0 && (
                    <div className="mt-3 p-2 bg-green-100 rounded border">
                      <p className="text-green-700 text-xs font-medium mb-2">
                        Auto-converted field names:
                      </p>
                      <div className="space-y-1">
                        {mappingResult.suggestions
                          .filter((s) => s.confidence >= 0.7)
                          .slice(0, 5)
                          .map((suggestion, index) => (
                            <div
                              key={index}
                              className="text-xs text-green-600 font-mono"
                            >
                              <span className="bg-blue-200 px-1 rounded">
                                "{suggestion.provided}"
                              </span>
                              {" → "}
                              <span className="bg-green-200 px-1 rounded">
                                "{suggestion.suggested}"
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Show skipped fields if any */}
                  {mappingResult &&
                    mappingResult.unmatchedFields.length > 0 && (
                      <div className="mt-3 p-2 bg-yellow-100 rounded border">
                        <p className="text-yellow-700 text-xs font-medium mb-2">
                          Skipped fields (not found):
                        </p>
                        <div className="text-xs text-yellow-600 font-mono">
                          {mappingResult.unmatchedFields
                            .slice(0, 10)
                            .map((field, index) => (
                              <span
                                key={index}
                                className="bg-yellow-200 px-1 rounded mr-1 mb-1 inline-block"
                              >
                                "{field}"
                              </span>
                            ))}
                          {mappingResult.unmatchedFields.length > 10 && (
                            <span className="text-yellow-500">
                              ...and {mappingResult.unmatchedFields.length - 10}{" "}
                              more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            )}

            {/* Field Reference */}
            <div className="mt-4">
              <FieldReference fields={getRequiredFields(documentType)} />
            </div>
          </div>
          {/* Form Fields Sections */}
          {(() => {
            // Group fields into logical sections for better organization
            const fieldSections = [];
            const fieldsPerSection = Math.ceil(fields.length / 3);
            
            for (let i = 0; i < fields.length; i += fieldsPerSection) {
              fieldSections.push(fields.slice(i, i + fieldsPerSection));
            }
            
            const accentColors = ['#7C9885', '#C99383', '#E1A857'];
            
            return fieldSections.map((sectionFields, sectionIndex) => {
              const accentColor = accentColors[sectionIndex % accentColors.length];
              
              return (
                <div
                  key={`section-${sectionIndex}`}
                  className="bg-white border border-[#E5E7EB] rounded-lg p-6 shadow-sm"
                  style={{ borderLeft: `4px solid ${accentColor}` }}
                >
                  <div className="grid gap-6 md:grid-cols-2">
                    {sectionFields.map((field) => (
                      <div
                        key={field.key}
                        className={field.type === "textarea" ? "md:col-span-2" : ""}
                      >
                        <Label
                          htmlFor={field.key}
                          className="text-sm font-medium text-[#2D3748]"
                        >
                          {field.label}
                          {field.required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </Label>
                        {field.type === "textarea" ? (
                          <Textarea
                            id={field.key}
                            value={formData[field.key] || ""}
                            onChange={(e) =>
                              handleInputChange(field.key, e.target.value)
                            }
                            className="mt-1 focus:ring-[#7C9885] focus:border-[#7C9885]"
                            rows={3}
                            placeholder={(field as any).placeholder || ""}
                          />
                        ) : field.type === "select" ? (
                          <Select
                            value={formData[field.key] || ""}
                            onValueChange={(value) =>
                              handleInputChange(field.key, value)
                            }
                          >
                            <SelectTrigger className="mt-1 focus:ring-[#7C9885] focus:border-[#7C9885]">
                              <SelectValue placeholder={`Select ${field.label}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {(field as any).options?.map((option: string) => (
                                <SelectItem key={option} value={option}>
                                  {option
                                    .replace("_", " ")
                                    .split(" ")
                                    .map(
                                      (word) =>
                                        word.charAt(0).toUpperCase() +
                                        word.slice(1).toLowerCase()
                                    )
                                    .join(" ")}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : field.type === "radio" ? (
                          <div className="mt-1 space-y-2">
                            {(field as any).options?.map((option: string) => (
                              <div key={option} className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  id={`${field.key}-${option}`}
                                  name={field.key}
                                  value={option}
                                  checked={formData[field.key] === option}
                                  onChange={(e) =>
                                    handleInputChange(field.key, e.target.value)
                                  }
                                  className="focus:ring-[#7C9885] text-[#7C9885]"
                                />
                                <Label
                                  htmlFor={`${field.key}-${option}`}
                                  className="text-sm"
                                >
                                  {option === "true"
                                    ? "Yes"
                                    : option === "false"
                                    ? "No"
                                    : option}
                                </Label>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <Input
                            id={field.key}
                            type={field.type}
                            value={formData[field.key] || ""}
                            onChange={(e) =>
                              handleInputChange(field.key, e.target.value)
                            }
                            className="mt-1 focus:ring-[#7C9885] focus:border-[#7C9885]"
                            placeholder={(field as any).placeholder || ""}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            });
          })()}

          {/* Document Formats */}
          <div className="bg-white border border-[#E5E7EB] border-l-[4px] border-l-[#C99383] rounded-lg p-6 shadow-sm space-y-4">
            <Label className="text-sm font-medium text-[#2D3748]">
              Document Formats <span className="text-red-500">*</span>
            </Label>
            <div className="flex space-x-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pdf-format"
                  checked={selectedFormats.includes(DocumentFormat.PDF)}
                  onCheckedChange={(checked) =>
                    handleFormatChange(DocumentFormat.PDF, !!checked)
                  }
                />
                <Label htmlFor="pdf-format" className="text-sm">
                  PDF
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="docx-format"
                  checked={selectedFormats.includes(DocumentFormat.DOCX)}
                  onCheckedChange={(checked) =>
                    handleFormatChange(DocumentFormat.DOCX, !!checked)
                  }
                />
                <Label htmlFor="docx-format" className="text-sm">
                  Word Document
                </Label>
              </div>
            </div>
          </div>

          {/* Email Delivery Notice */}
          <div className="bg-[#F8FAFC] border border-[#E5E7EB] border-l-[4px] border-l-[#3B82F6] rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-2">
              <svg
                className="w-5 h-5 text-[#3B82F6]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-[#2D3748]">
                  Secure Document Delivery
                </p>
                <p className="text-sm text-[#6B7280]">
                  Your legal document will be delivered directly to your registered email address upon completion.
                </p>
              </div>
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 border-l-[4px] border-l-red-500 rounded-lg p-4 shadow-sm">
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 border-l-[4px] border-l-green-500 rounded-lg p-4 shadow-sm">
              <p className="text-green-800 text-sm font-medium">{success}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-between items-center gap-4 pt-6 flex-wrap">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="px-6 py-3 border-[#E2E8F0] text-[#718096] hover:bg-[#F8FAF9] order-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#7C9885] hover:bg-[#7C9885]/90 text-white font-semibold transform hover:scale-105 transition-all duration-200 order-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Document...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Document
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
