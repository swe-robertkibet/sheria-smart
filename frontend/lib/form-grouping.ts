import { DocumentType } from "@/types/document";
import { getRequiredFields } from "@/lib/document-config";

export interface FormField {
  key: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  fields: FormField[];
}

// Helper function to categorize fields based on their content
const categorizeField = (field: FormField): string => {
  const key = field.key.toLowerCase();
  const label = field.label.toLowerCase();
  
  // Personal/Entity Information
  if (key.includes('name') || key.includes('title') || key.includes('owner') || 
      key.includes('director') || key.includes('manager') || key.includes('employee') ||
      key.includes('party') || key.includes('individual') || key.includes('entity') ||
      label.includes('name') || label.includes('party') || label.includes('person')) {
    return 'personal';
  }
  
  // Contact Information
  if (key.includes('address') || key.includes('email') || key.includes('phone') ||
      key.includes('contact') || key.includes('location') || key.includes('city') ||
      key.includes('country') || key.includes('postal') || key.includes('zip') ||
      label.includes('address') || label.includes('contact') || label.includes('location')) {
    return 'contact';
  }
  
  // Financial/Legal Terms
  if (key.includes('salary') || key.includes('payment') || key.includes('amount') ||
      key.includes('price') || key.includes('fee') || key.includes('cost') ||
      key.includes('compensation') || key.includes('wage') || key.includes('rent') ||
      key.includes('deposit') || key.includes('currency') || key.includes('tax') ||
      label.includes('salary') || label.includes('payment') || label.includes('amount') ||
      label.includes('price') || label.includes('cost') || label.includes('rent')) {
    return 'financial';
  }
  
  // Dates and Timeline
  if (key.includes('date') || key.includes('duration') || key.includes('period') ||
      key.includes('term') || key.includes('start') || key.includes('end') ||
      key.includes('expiry') || key.includes('deadline') || key.includes('time') ||
      label.includes('date') || label.includes('period') || label.includes('term') ||
      label.includes('duration') || label.includes('start') || label.includes('end')) {
    return 'timeline';
  }
  
  // Legal Compliance and Requirements
  if (key.includes('compliance') || key.includes('regulatory') || key.includes('legal') ||
      key.includes('requirement') || key.includes('obligation') || key.includes('liability') ||
      key.includes('governing') || key.includes('jurisdiction') || key.includes('law') ||
      label.includes('compliance') || label.includes('legal') || label.includes('requirement') ||
      label.includes('jurisdiction') || label.includes('governing')) {
    return 'legal';
  }
  
  // Property/Asset Information
  if (key.includes('property') || key.includes('asset') || key.includes('land') ||
      key.includes('building') || key.includes('premises') || key.includes('unit') ||
      key.includes('plot') || key.includes('title') || key.includes('deed') ||
      label.includes('property') || label.includes('asset') || label.includes('premises') ||
      label.includes('land') || label.includes('building')) {
    return 'property';
  }
  
  // Business/Work Details  
  if (key.includes('business') || key.includes('company') || key.includes('work') ||
      key.includes('service') || key.includes('product') || key.includes('industry') ||
      key.includes('position') || key.includes('role') || key.includes('job') ||
      key.includes('department') || key.includes('function') || key.includes('responsibility') ||
      label.includes('business') || label.includes('service') || label.includes('position') ||
      label.includes('role') || label.includes('work') || label.includes('responsibility')) {
    return 'business';
  }
  
  // Default to general details
  return 'details';
};

// Create form sections based on document type and fields
export const createFormSections = (documentType: DocumentType): FormSection[] => {
  const fields = getRequiredFields(documentType);
  
  // Group fields by category
  const fieldGroups: { [key: string]: FormField[] } = {};
  
  fields.forEach(field => {
    const category = categorizeField(field);
    if (!fieldGroups[category]) {
      fieldGroups[category] = [];
    }
    fieldGroups[category].push(field);
  });
  
  // Define section configurations
  const sectionConfigs = {
    personal: {
      title: 'Personal & Entity Information',
      description: 'Basic information about the parties involved',
      icon: 'user'
    },
    contact: {
      title: 'Contact Information',
      description: 'Address and communication details',
      icon: 'phone'
    },
    business: {
      title: 'Business Details',
      description: 'Work, service, or business-related information',
      icon: 'briefcase'
    },
    property: {
      title: 'Property & Asset Information',
      description: 'Details about properties, assets, or premises',
      icon: 'building'
    },
    financial: {
      title: 'Financial Terms',
      description: 'Payment, compensation, and financial arrangements',
      icon: 'dollar-sign'
    },
    timeline: {
      title: 'Timeline & Duration',
      description: 'Important dates, periods, and deadlines',
      icon: 'calendar'
    },
    legal: {
      title: 'Legal & Compliance',
      description: 'Legal requirements, jurisdiction, and compliance matters',
      icon: 'shield'
    },
    details: {
      title: 'Additional Details',
      description: 'Other important information',
      icon: 'file-text'
    }
  };
  
  // Create sections with proper ordering
  const sectionOrder = ['personal', 'contact', 'business', 'property', 'financial', 'timeline', 'legal', 'details'];
  const sections: FormSection[] = [];
  
  sectionOrder.forEach(categoryKey => {
    if (fieldGroups[categoryKey] && fieldGroups[categoryKey].length > 0) {
      const config = sectionConfigs[categoryKey as keyof typeof sectionConfigs];
      sections.push({
        id: categoryKey,
        title: config.title,
        description: config.description,
        icon: config.icon,
        fields: fieldGroups[categoryKey].sort((a, b) => {
          // Sort required fields first, then by label
          if (a.required && !b.required) return -1;
          if (!a.required && b.required) return 1;
          return a.label.localeCompare(b.label);
        })
      });
    }
  });
  
  return sections;
};

// Helper function to get icon component name for Lucide React
export const getIconName = (iconKey: string): string => {
  const iconMap: { [key: string]: string } = {
    'user': 'User',
    'phone': 'Phone', 
    'briefcase': 'Briefcase',
    'building': 'Building2',
    'dollar-sign': 'DollarSign',
    'calendar': 'Calendar',
    'shield': 'Shield',
    'file-text': 'FileText'
  };
  
  return iconMap[iconKey] || 'FileText';
};

export default createFormSections;