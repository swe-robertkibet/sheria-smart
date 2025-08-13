/**
 * Utilities for mapping human-readable field names to form field keys
 */

export interface FieldMappingResult {
  mappedData: Record<string, any>
  matchedFields: number
  totalFields: number
  unmatchedFields: string[]
  suggestions: Array<{ provided: string; suggested: string; confidence: number }>
}

/**
 * Convert a human-readable string to camelCase
 * "Vendor Name" -> "vendorName"
 * "Property Type" -> "propertyType"
 */
export function toCamelCase(str: string): string {
  return str
    .replace(/[^\w\s]/g, '') // Remove special characters
    .split(/\s+/) // Split on whitespace
    .map((word, index) => {
      if (index === 0) {
        return word.toLowerCase()
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join('')
}

/**
 * Convert camelCase to human-readable format
 * "vendorName" -> "Vendor Name"
 */
export function fromCamelCase(str: string): string {
  return str
    .replace(/([A-Z])/g, ' $1') // Add space before uppercase letters
    .replace(/^./, (match) => match.toUpperCase()) // Capitalize first letter
    .trim()
}

/**
 * Calculate similarity between two strings using Levenshtein distance
 */
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2
  const shorter = str1.length > str2.length ? str2 : str1
  
  if (longer.length === 0) return 1.0
  
  const editDistance = levenshteinDistance(longer, shorter)
  return (longer.length - editDistance) / longer.length
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null))
  
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      )
    }
  }
  
  return matrix[str2.length][str1.length]
}

/**
 * Smart field mapping that tries multiple strategies to match field names
 */
export function mapFieldNames(
  pastedData: Record<string, any>,
  validFieldKeys: string[]
): FieldMappingResult {
  const mappedData: Record<string, any> = {}
  const unmatchedFields: string[] = []
  const suggestions: Array<{ provided: string; suggested: string; confidence: number }> = []
  let matchedFields = 0
  const totalFields = Object.keys(pastedData).length

  Object.entries(pastedData).forEach(([key, value]) => {
    let bestMatch: string | null = null
    let bestMatchScore = 0
    
    // Strategy 1: Exact match (case-sensitive)
    if (validFieldKeys.includes(key)) {
      bestMatch = key
      bestMatchScore = 1.0
    }
    
    // Strategy 2: Case-insensitive exact match
    if (!bestMatch) {
      const caseInsensitiveMatch = validFieldKeys.find(
        field => field.toLowerCase() === key.toLowerCase()
      )
      if (caseInsensitiveMatch) {
        bestMatch = caseInsensitiveMatch
        bestMatchScore = 0.95
      }
    }
    
    // Strategy 3: Convert human-readable to camelCase
    if (!bestMatch) {
      const camelCaseKey = toCamelCase(key)
      if (validFieldKeys.includes(camelCaseKey)) {
        bestMatch = camelCaseKey
        bestMatchScore = 0.9
      }
    }
    
    // Strategy 4: Try removing common suffixes/prefixes
    if (!bestMatch) {
      const cleanedKey = key
        .replace(/\s*\(optional\)\s*/gi, '')
        .replace(/\s*\(required\)\s*/gi, '')
        .trim()
      const camelCaseCleanedKey = toCamelCase(cleanedKey)
      if (validFieldKeys.includes(camelCaseCleanedKey)) {
        bestMatch = camelCaseCleanedKey
        bestMatchScore = 0.85
      }
    }
    
    // Strategy 5: Fuzzy matching (similarity-based)
    if (!bestMatch) {
      const keyLower = key.toLowerCase()
      const camelCaseKey = toCamelCase(key)
      
      validFieldKeys.forEach(field => {
        const fieldLower = field.toLowerCase()
        const humanReadableField = fromCamelCase(field).toLowerCase()
        
        // Check similarity with the field key itself
        const directSimilarity = calculateSimilarity(keyLower, fieldLower)
        // Check similarity with human-readable version
        const humanSimilarity = calculateSimilarity(keyLower, humanReadableField)
        // Check similarity between camelCase versions
        const camelSimilarity = calculateSimilarity(camelCaseKey.toLowerCase(), fieldLower)
        
        const maxSimilarity = Math.max(directSimilarity, humanSimilarity, camelSimilarity)
        
        if (maxSimilarity > bestMatchScore && maxSimilarity >= 0.7) {
          bestMatch = field
          bestMatchScore = maxSimilarity
        }
      })
    }
    
    // If we found a match, use it
    if (bestMatch && bestMatchScore >= 0.7) {
      mappedData[bestMatch] = value
      matchedFields++
      
      // Add to suggestions if it wasn't an exact match
      if (bestMatchScore < 1.0) {
        suggestions.push({
          provided: key,
          suggested: bestMatch,
          confidence: bestMatchScore
        })
      }
    } else {
      unmatchedFields.push(key)
      
      // Find the best suggestion even if below threshold
      let bestSuggestion = ''
      let bestSuggestionScore = 0
      
      validFieldKeys.forEach(field => {
        const similarity = Math.max(
          calculateSimilarity(key.toLowerCase(), field.toLowerCase()),
          calculateSimilarity(key.toLowerCase(), fromCamelCase(field).toLowerCase()),
          calculateSimilarity(toCamelCase(key).toLowerCase(), field.toLowerCase())
        )
        
        if (similarity > bestSuggestionScore) {
          bestSuggestion = field
          bestSuggestionScore = similarity
        }
      })
      
      if (bestSuggestion && bestSuggestionScore > 0.3) {
        suggestions.push({
          provided: key,
          suggested: bestSuggestion,
          confidence: bestSuggestionScore
        })
      }
    }
  })

  return {
    mappedData,
    matchedFields,
    totalFields,
    unmatchedFields,
    suggestions
  }
}

/**
 * Generate a formatted list of available field names for a given set of field keys
 */
export function generateFieldReference(fields: Array<{ key: string; label: string; required: boolean }>): {
  byCategory: Record<string, Array<{ key: string; label: string; required: boolean }>>
  allKeys: string[]
  requiredKeys: string[]
  optionalKeys: string[]
} {
  const byCategory: Record<string, Array<{ key: string; label: string; required: boolean }>> = {}
  const allKeys = fields.map(f => f.key)
  const requiredKeys = fields.filter(f => f.required).map(f => f.key)
  const optionalKeys = fields.filter(f => !f.required).map(f => f.key)
  
  // Categorize fields by their prefix/purpose
  fields.forEach(field => {
    let category = 'Other'
    
    if (field.key.startsWith('vendor') || field.key.startsWith('seller')) {
      category = 'Vendor/Seller Information'
    } else if (field.key.startsWith('purchaser') || field.key.startsWith('buyer') || field.key.startsWith('client')) {
      category = 'Purchaser/Buyer Information'
    } else if (field.key.startsWith('property') || field.key.startsWith('land')) {
      category = 'Property Details'
    } else if (field.key.startsWith('employee') && !field.key.startsWith('employer')) {
      category = 'Employee Information'
    } else if (field.key.startsWith('employer')) {
      category = 'Employer Information'
    } else if (field.key.startsWith('landlord')) {
      category = 'Landlord Information'
    } else if (field.key.startsWith('tenant')) {
      category = 'Tenant Information'
    } else if (field.key.startsWith('contractor')) {
      category = 'Contractor Information'
    } else if (field.key.startsWith('service')) {
      category = 'Service Details'
    } else if (field.key.includes('payment') || field.key.includes('price') || field.key.includes('cost') || field.key.includes('fee')) {
      category = 'Financial Terms'
    } else if (field.key.includes('date') || field.key.includes('time') || field.key.includes('schedule')) {
      category = 'Dates and Timeline'
    } else if (field.key.includes('legal') || field.key.includes('law') || field.key.includes('court') || field.key.includes('jurisdiction')) {
      category = 'Legal Terms'
    } else if (field.key.includes('insurance') || field.key.includes('liability') || field.key.includes('risk')) {
      category = 'Insurance and Liability'
    }
    
    if (!byCategory[category]) {
      byCategory[category] = []
    }
    byCategory[category].push(field)
  })
  
  return {
    byCategory,
    allKeys,
    requiredKeys,
    optionalKeys
  }
}