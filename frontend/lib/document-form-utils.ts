import { DocumentType, DocumentFormat } from "@/types/document";

interface FormField {
  key: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
}

interface RequestData {
  documentType: DocumentType;
  userInput: Record<string, any>;
  backstory: string;
  formats: DocumentFormat[];
}

export const processUserInput = (
  formData: Record<string, any>,
  documentType: DocumentType
): Record<string, any> => {
  let processedUserInput = { ...formData };

  // Trim whitespace from all string values
  Object.keys(processedUserInput).forEach(key => {
    const value = processedUserInput[key];
    if (typeof value === 'string') {
      processedUserInput[key] = value.trim();
    }
  });

  // Handle Partnership Agreement partners array conversion
  if (
    documentType === DocumentType.PARTNERSHIP_AGREEMENT &&
    processedUserInput.partnersInfo
  ) {
    try {
      processedUserInput.partners = JSON.parse(processedUserInput.partnersInfo);
      delete processedUserInput.partnersInfo;
    } catch (error) {
      throw new Error(
        "Invalid partners information format. Please provide valid JSON."
      );
    }
  }

  return processedUserInput;
};

export const validateRequiredFields = (
  formData: Record<string, any>,
  requiredFields: FormField[]
): string[] => {
  const missingFields = requiredFields
    .filter((field) => {
      const value = formData[field.key];
      if (field.required) {
        // Handle radio button fields specifically
        if (field.type === "radio") {
          return !value || value === "";
        }
        // Handle other field types
        return !value || value.toString().trim() === "";
      }
      return false;
    })
    .map((field) => field.label);

  return missingFields;
};

export const createRequestData = (
  documentType: DocumentType,
  processedUserInput: Record<string, any>,
  selectedFormats: DocumentFormat[],
  getDocumentTitle: (documentType: DocumentType) => string
): RequestData => {
  return {
    documentType,
    userInput: processedUserInput,
    backstory: `Generate a ${getDocumentTitle(documentType)} based on the provided information.`,
    formats: selectedFormats,
  };
};