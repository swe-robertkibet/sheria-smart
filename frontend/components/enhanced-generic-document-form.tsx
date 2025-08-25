"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { ArrowLeft, Loader2, FileText, User, Phone, Briefcase, Building2, DollarSign, Calendar, Shield } from "lucide-react";
import { 
  Form, 
  Input, 
  Select, 
  Checkbox, 
  Radio, 
  Button, 
  Card, 
  Space, 
  Row, 
  Col, 
  Alert, 
  Modal,
  Typography,
  theme,
  Divider
} from "antd";
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
import { createFormSections, getIconName } from "@/lib/form-grouping";
import { semanticColors, formSections } from "@/lib/theme-config";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface EnhancedGenericDocumentFormProps {
  onBack: () => void;
  documentType: DocumentType;
}

export function EnhancedGenericDocumentForm({
  onBack,
  documentType,
}: EnhancedGenericDocumentFormProps) {
  const [form] = Form.useForm();
  const { token } = theme.useToken();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  // Removed selectedFormats state - using Form state only for instant responsiveness
  const [pasteError, setPasteError] = useState<string | null>(null);
  const [pasteSuccess, setPasteSuccess] = useState<string | null>(null);
  const [mappingResult, setMappingResult] = useState<FieldMappingResult | null>(
    null
  );

  // Refs for feedback message elements
  const errorAlertRef = useRef<HTMLDivElement>(null);
  const successAlertRef = useRef<HTMLDivElement>(null);

  // Scroll utility function for feedback messages
  const scrollToFeedback = (elementRef: React.RefObject<HTMLDivElement>) => {
    if (elementRef.current) {
      elementRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
    }
  };

  // Reset scroll position when component mounts
  useScrollToTop();

  // Scroll to feedback messages when they appear (only for non-validation errors)
  useEffect(() => {
    if (error && !error.includes('Validation Error')) {
      // Small delay to ensure DOM is updated
      setTimeout(() => scrollToFeedback(errorAlertRef), 100);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      // Small delay to ensure DOM is updated
      setTimeout(() => scrollToFeedback(successAlertRef), 100);
    }
  }, [success]);

  // Get form sections for this document type - memoized to prevent recalculation
  const formSectionsList = useMemo(() => createFormSections(documentType), [documentType]);

  // Helper function to get icon component - memoized icon map
  const iconMap = useMemo(() => ({
    'user': User,
    'phone': Phone,
    'briefcase': Briefcase,
    'building': Building2,
    'dollar-sign': DollarSign,
    'calendar': Calendar,
    'shield': Shield,
    'file-text': FileText
  }), []);
  
  const getIconComponent = useCallback((iconKey: string) => {
    return iconMap[iconKey] || FileText;
  }, [iconMap]);


  // Removed handleFormatChange - Form handles state directly for instant responsiveness

  const handlePasteData = useCallback((pastedData: Record<string, any>) => {
    setPasteError(null);
    setPasteSuccess(null);
    setMappingResult(null);

    const requiredFields = getRequiredFields(documentType);
    const validFieldKeys = requiredFields.map((field) => field.key);

    // Use smart field mapping
    const result = mapFieldNames(pastedData, validFieldKeys);
    setMappingResult(result);

    // Update form directly with mapped fields
    form.setFieldsValue(result.mappedData);

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
  }, [form, documentType]);

  const handlePasteError = useCallback((errorMessage: string) => {
    setPasteError(errorMessage);
    setPasteSuccess(null);

    // Clear error message after 5 seconds
    setTimeout(() => {
      setPasteError(null);
    }, 5000);
  }, []);

  // Handle form validation failures
  const handleFinishFailed = (errorInfo: any) => {
    console.log('Form validation failed:', errorInfo);
    
    // Don't set error messages for field validation failures
    // Let Ant Design's scrollToFirstError handle the UX
    // Only log for debugging purposes
    const errorFields = errorInfo.errorFields;
    if (errorFields && errorFields.length > 0) {
      console.log('Field validation errors detected, letting form handle scroll to fields');
    }
  };

  const handleSubmit = useCallback(async (values: Record<string, any>) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const requiredFields = getRequiredFields(documentType);
      const missingFields = validateRequiredFields(values, requiredFields);

      if (missingFields.length > 0) {
        throw new Error(
          `Please fill in all required fields: ${missingFields.join(", ")}`
        );
      }

      // Get formats from form state instead of removed selectedFormats
      const formats = values.formats || [DocumentFormat.PDF];
      
      if (formats.length === 0) {
        throw new Error("Please select at least one document format");
      }

      const processedUserInput = processUserInput(values, documentType);

      const requestData = createRequestData(
        documentType,
        processedUserInput,
        formats,
        getDocumentTitle
      );

      // Debug logging to see what's being sent
      console.log("📋 FORM DEBUG: Request data being sent to backend:", {
        documentType,
        userInputKeys: Object.keys(processedUserInput),
        userInputValues: processedUserInput,
        formats: formats,
        allRequiredFields: getRequiredFields(documentType)
          .filter((f) => f.required)
          .map((f) => f.key),
      });

      const response = await fetch(
        "http://localhost:5000/api/documents/generate",
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
      console.error("Error generating document:", err);
      setError(
        err instanceof Error ? err.message : "Failed to generate document"
      );
    } finally {
      setLoading(false);
    }
  }, [documentType]);

  // Form layout configuration
  const formLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };

  const responsiveFormLayout = {
    labelCol: { xs: { span: 24 }, sm: { span: 8 }, md: { span: 6 } },
    wrapperCol: { xs: { span: 24 }, sm: { span: 16 }, md: { span: 18 } },
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FEFCF3" }}>
      {/* Header */}
      <Card
        style={{ 
          borderRadius: 0, 
          borderBottom: `1px solid ${token.colorBorder}`,
          position: "sticky",
          top: 0,
          zIndex: 50,
          minHeight: '64px'
        }}
        styles={{ 
          body: { 
            padding: `16px ${token.paddingXL}px`,
            display: 'flex',
            alignItems: 'center',
            minHeight: '64px'
          } 
        }}
      >
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px',
          width: '100%',
          height: '40px' // Increased content height for proper typography
        }}>
          <Button
            type="text"
            icon={<ArrowLeft size={20} />}
            onClick={onBack}
            style={{ 
              color: token.colorPrimary,
              flexShrink: 0
            }}
          />
          <div style={{ 
            flex: 1,
            minWidth: 0,
            height: '40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '2px'
          }}>
            <Title 
              level={3} 
              style={{ 
                margin: 0, 
                color: token.colorText,
                fontSize: 'clamp(14px, 3vw, 18px)',
                lineHeight: 1.3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                height: '22px'
              }}
              title={getDocumentTitle(documentType)}
            >
              {getDocumentTitle(documentType)}
            </Title>
            <Text 
              type="secondary"
              style={{
                fontSize: 'clamp(11px, 2.5vw, 12px)',
                lineHeight: 1.33,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                margin: 0,
                height: '16px'
              }}
              title={getDocumentDescription(documentType)}
            >
              {getDocumentDescription(documentType)}
            </Text>
          </div>
        </div>
      </Card>

      {/* Form */}
      <div style={{ 
        maxWidth: 1200, 
        margin: "0 auto", 
        padding: `${token.paddingXL}px ${token.paddingLG}px`
      }}>
        <Form
          form={form}
          {...formLayout}
          onFinish={handleSubmit}
          onFinishFailed={handleFinishFailed}
          size="middle"
          requiredMark="optional"
          colon={false}
          scrollToFirstError={{ behavior: 'smooth', block: 'center', inline: 'center' }}
          validateTrigger={['onBlur']}
        >
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {/* Paste Button Section */}
            <Card
              style={{
                backgroundColor: 'white',
                border: `1px solid #E5E7EB`,
                borderRadius: token.borderRadiusLG,
                borderLeft: `4px solid #7C9885`,
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
              }}
              styles={{ body: { padding: token.paddingLG } }}
            >
              <Row gutter={[16, 16]} align="middle">
                <Col flex="auto">
                  <Space direction="vertical" size="small">
                    <Title level={4} style={{ margin: 0, color: token.colorText }}>
                      Quick Fill from Clipboard
                    </Title>
                    <Text type="secondary">
                      Have your form data ready in JSON format? Click the button
                      below to automatically fill all matching fields.
                    </Text>
                  </Space>
                </Col>
                <Col flex="none">
                  <PasteButton
                    onPaste={handlePasteData}
                    onError={handlePasteError}
                    size="lg"
                    variant="default"
                    style={{
                      backgroundColor: '#7C9885',
                      borderColor: '#7C9885',
                      color: 'white',
                      fontWeight: token.fontWeightStrong
                    }}
                  />
                </Col>
              </Row>

              {/* Paste Feedback Messages */}
              {pasteError && (
                <Alert
                  message="Paste Error"
                  description={
                    <Space direction="vertical" size="small" style={{ width: "100%" }}>
                      <Text>{pasteError}</Text>
                      
                      {/* Show suggestions if available */}
                      {mappingResult && mappingResult.suggestions.length > 0 && (
                        <Card 
                          size="small" 
                          style={{ 
                            backgroundColor: token.colorErrorBg,
                            border: `1px solid ${token.colorErrorBorder}`
                          }}
                        >
                          <Text strong style={{ color: token.colorError }}>
                            Suggested field name corrections:
                          </Text>
                          <div style={{ marginTop: token.marginXS }}>
                            {mappingResult.suggestions
                              .slice(0, 5)
                              .map((suggestion, index) => (
                                <div key={index} style={{ 
                                  fontSize: token.fontSizeSM,
                                  fontFamily: token.fontFamilyCode,
                                  margin: `${token.marginXXS}px 0`
                                }}>
                                  <span style={{ 
                                    backgroundColor: token.colorErrorBg, 
                                    padding: `2px 6px`, 
                                    borderRadius: token.borderRadiusSM 
                                  }}>
                                    "{suggestion.provided}"
                                  </span>
                                  {" → "}
                                  <span style={{ 
                                    backgroundColor: token.colorSuccessBg, 
                                    padding: `2px 6px`, 
                                    borderRadius: token.borderRadiusSM,
                                    color: token.colorSuccess
                                  }}>
                                    "{suggestion.suggested}"
                                  </span>
                                  <span style={{ color: token.colorTextSecondary, marginLeft: token.marginXS }}>
                                    ({Math.round(suggestion.confidence * 100)}% match)
                                  </span>
                                </div>
                              ))}
                          </div>
                        </Card>
                      )}
                    </Space>
                  }
                  type="error"
                  style={{ marginTop: token.marginMD }}
                />
              )}

              {pasteSuccess && (
                <Alert
                  message="Paste Successful"
                  description={
                    <Space direction="vertical" size="small" style={{ width: "100%" }}>
                      <Text>{pasteSuccess}</Text>
                      
                      {/* Show mapping details if available */}
                      {mappingResult && mappingResult.suggestions.length > 0 && (
                        <Card 
                          size="small" 
                          style={{ 
                            backgroundColor: token.colorSuccessBg,
                            border: `1px solid ${token.colorSuccessBorder}`
                          }}
                        >
                          <Text strong style={{ color: token.colorSuccess }}>
                            Auto-converted field names:
                          </Text>
                          <div style={{ marginTop: token.marginXS }}>
                            {mappingResult.suggestions
                              .filter((s) => s.confidence >= 0.7)
                              .slice(0, 5)
                              .map((suggestion, index) => (
                                <div key={index} style={{ 
                                  fontSize: token.fontSizeSM,
                                  fontFamily: token.fontFamilyCode,
                                  margin: `${token.marginXXS}px 0`
                                }}>
                                  <span style={{ 
                                    backgroundColor: token.colorInfoBg, 
                                    padding: `2px 6px`, 
                                    borderRadius: token.borderRadiusSM 
                                  }}>
                                    "{suggestion.provided}"
                                  </span>
                                  {" → "}
                                  <span style={{ 
                                    backgroundColor: token.colorSuccessBg, 
                                    padding: `2px 6px`, 
                                    borderRadius: token.borderRadiusSM
                                  }}>
                                    "{suggestion.suggested}"
                                  </span>
                                </div>
                              ))}
                          </div>
                        </Card>
                      )}

                      {/* Show skipped fields if any */}
                      {mappingResult && mappingResult.unmatchedFields.length > 0 && (
                        <Card 
                          size="small" 
                          style={{ 
                            backgroundColor: token.colorWarningBg,
                            border: `1px solid ${token.colorWarningBorder}`
                          }}
                        >
                          <Text strong style={{ color: token.colorWarning }}>
                            Skipped fields (not found):
                          </Text>
                          <div style={{ marginTop: token.marginXS, fontSize: token.fontSizeSM }}>
                            {mappingResult.unmatchedFields
                              .slice(0, 10)
                              .map((field, index) => (
                                <span
                                  key={index}
                                  style={{
                                    backgroundColor: token.colorWarningBg,
                                    padding: `2px 6px`,
                                    borderRadius: token.borderRadiusSM,
                                    marginRight: token.marginXS,
                                    marginBottom: token.marginXS,
                                    display: "inline-block",
                                    fontFamily: token.fontFamilyCode
                                  }}
                                >
                                  "{field}"
                                </span>
                              ))}
                            {mappingResult.unmatchedFields.length > 10 && (
                              <Text type="secondary">
                                ...and {mappingResult.unmatchedFields.length - 10} more
                              </Text>
                            )}
                          </div>
                        </Card>
                      )}
                    </Space>
                  }
                  type="success"
                  style={{ marginTop: token.marginMD }}
                />
              )}

              {/* Field Reference */}
              <div style={{ marginTop: token.marginMD }}>
                <FieldReference fields={getRequiredFields(documentType)} />
              </div>
            </Card>

            {/* Form Sections - Vertical Grouping */}
            {formSectionsList.map((section, sectionIndex) => {
              const IconComponent = getIconComponent(section.icon || 'file-text');
              
              // Subtle accent colors for section variety
              const accentColors = ['#7C9885', '#C99383', '#E1A857'];
              const accentColor = accentColors[sectionIndex % accentColors.length];
              
              return (
                <Card
                  key={section.id}
                  style={{
                    borderRadius: token.borderRadiusLG,
                    backgroundColor: 'white',
                    border: `1px solid #E5E7EB`,
                    borderLeft: `4px solid ${accentColor}`,
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                    marginBottom: formSections.spacing.sectionGap,
                  }}
                  styles={{ body: { padding: formSections.styling.sectionPadding } }}
                >
                  {/* Section Header */}
                  <div style={{ marginBottom: formSections.spacing.groupGap }}>
                    <Space align="start" size="middle">
                      <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: `${accentColor}15`,
                        border: `2px solid ${accentColor}30`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <IconComponent size={20} style={{ color: accentColor }} />
                      </div>
                      <div>
                        <Title 
                          level={4} 
                          style={{ 
                            margin: 0,
                            color: formSections.styling.headerColor,
                            fontSize: formSections.styling.headerFontSize,
                            fontWeight: formSections.styling.headerFontWeight
                          }}
                        >
                          {section.title}
                        </Title>
                        {section.description && (
                          <Text 
                            type="secondary"
                            style={{ 
                              fontSize: formSections.styling.descriptionFontSize,
                              color: formSections.styling.descriptionColor
                            }}
                          >
                            {section.description}
                          </Text>
                        )}
                      </div>
                    </Space>
                  </div>

                  <Divider style={{ margin: `${formSections.spacing.fieldGap}px 0` }} />

                  {/* Section Fields */}
                  <Row gutter={[formSections.spacing.fieldGap, formSections.spacing.fieldGap]}>
                    {section.fields.map((field) => (
                      <Col
                        key={field.key}
                        xs={24}
                        sm={field.type === "textarea" ? 24 : 12}
                        md={field.type === "textarea" ? 24 : section.fields.length === 1 ? 24 : 12}
                        lg={field.type === "textarea" ? 24 : section.fields.length <= 2 ? 12 : 8}
                      >
                        <Form.Item
                          name={field.key}
                          label={
                            <span style={{ fontWeight: token.fontWeightStrong }}>
                              {field.label}
                              {field.required && (
                                <span style={{ color: token.colorError, marginLeft: 4 }}>*</span>
                              )}
                            </span>
                          }
                          rules={[
                            {
                              required: field.required,
                              message: `${field.label} is required`,
                            },
                            // Add specific validation for different field types
                            ...(field.type === 'email' ? [{
                              type: 'email' as const,
                              message: `Please enter a valid email address`,
                            }] : []),
                            ...(field.type === 'url' ? [{
                              type: 'url' as const,
                              message: `Please enter a valid URL`,
                            }] : []),
                            // Add minimum length validation for text fields
                            ...(field.type === 'text' || field.type === 'textarea' ? [{
                              min: 2,
                              message: `${field.label} must be at least 2 characters`,
                            }] : []),
                          ]}
                          tooltip={field.required ? "This field is required" : undefined}
                          style={{ marginBottom: formSections.spacing.fieldGap }}
                          hasFeedback={field.required}
                          validateFirst
                        >
                          {field.type === "textarea" ? (
                            <TextArea
                              placeholder={(field as any).placeholder || `Enter ${field.label.toLowerCase()}`}
                              rows={4}
                              style={{ 
                                borderRadius: token.borderRadius,
                                fontSize: token.fontSize
                              }}
                            />
                          ) : field.type === "select" ? (
                            <Select
                              placeholder={`Select ${field.label.toLowerCase()}`}
                              style={{ borderRadius: token.borderRadius }}
                              size="large"
                            >
                              {(field as any).options?.map((option: string) => (
                                <Option key={option} value={option}>
                                  {option
                                    .replace("_", " ")
                                    .split(" ")
                                    .map(
                                      (word) =>
                                        word.charAt(0).toUpperCase() +
                                        word.slice(1).toLowerCase()
                                    )
                                    .join(" ")}
                                </Option>
                              ))}
                            </Select>
                          ) : field.type === "radio" ? (
                            <Radio.Group size="large">
                              <Space direction="vertical" size="middle">
                                {(field as any).options?.map((option: string) => (
                                  <Radio key={option} value={option}>
                                    {option === "true"
                                      ? "Yes"
                                      : option === "false"
                                      ? "No"
                                      : option}
                                  </Radio>
                                ))}
                              </Space>
                            </Radio.Group>
                          ) : (
                            <Input
                              type={field.type}
                              placeholder={(field as any).placeholder || `Enter ${field.label.toLowerCase()}`}
                              style={{ 
                                borderRadius: token.borderRadius,
                                fontSize: token.fontSize
                              }}
                              size="large"
                            />
                          )}
                        </Form.Item>
                      </Col>
                    ))}
                  </Row>
                </Card>
              );
            })}

            {/* Document Formats */}
            <Card
              title={
                <span style={{ color: token.colorText, fontWeight: token.fontWeightStrong }}>
                  Document Formats
                </span>
              }
              style={{
                borderRadius: token.borderRadiusLG,
                backgroundColor: 'white',
                border: `1px solid #E5E7EB`,
                borderLeft: `4px solid #7C9885`,
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
              }}
              styles={{ body: { padding: token.paddingLG } }}
            >
              <Form.Item
                name="formats"
                rules={[{ required: true, message: "Please select at least one format" }]}
                initialValue={[DocumentFormat.PDF]}
              >
                <Checkbox.Group>
                  <Space>
                    <Checkbox value={DocumentFormat.PDF}>PDF</Checkbox>
                    <Checkbox value={DocumentFormat.DOCX}>Word Document</Checkbox>
                  </Space>
                </Checkbox.Group>
              </Form.Item>
            </Card>

            {/* Email Delivery Notice */}
            <Alert
              message="Secure Document Delivery"
              description="Your legal document will be delivered directly to your registered email address upon completion."
              type="info"
              showIcon
              style={{
                borderRadius: token.borderRadiusLG,
                backgroundColor: '#F8FAFC',
                border: `1px solid #E5E7EB`,
                borderLeft: `4px solid #3B82F6`,
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
              }}
            />

            {/* Error/Success Messages */}
            {error && (
              <div ref={errorAlertRef}>
                <Alert
                  message={error.includes('Validation Error') ? "Form Validation Failed" : "Document Generation Error"}
                  description={
                    <div>
                      <p>{error}</p>
                      {error.includes('Validation Error') && (
                        <p style={{ 
                          marginTop: token.marginXS, 
                          fontStyle: 'italic',
                          color: token.colorTextSecondary 
                        }}>
                          Please check the highlighted fields above and correct any errors.
                        </p>
                      )}
                    </div>
                  }
                  type="error"
                  style={{ 
                    borderRadius: token.borderRadiusLG,
                    border: `2px solid ${token.colorError}`,
                    backgroundColor: token.colorErrorBg
                  }}
                  showIcon
                  closable
                  onClose={() => setError(null)}
                />
              </div>
            )}

            {success && (
              <div ref={successAlertRef}>
                <Alert
                  message="Generation Successful"
                  description={success}
                  type="success"
                  style={{ borderRadius: token.borderRadiusLG }}
                />
              </div>
            )}

            {/* Submit Buttons */}
            <div style={{ 
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: token.marginMD,
              paddingTop: token.paddingLG,
              flexWrap: "wrap"
            }}>
              <Button
                type="default"
                onClick={onBack}
                size="large"
                style={{
                  borderRadius: token.borderRadius,
                  minWidth: 120,
                  order: 1
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                icon={!loading ? <FileText size={16} /> : undefined}
                style={{
                  borderRadius: token.borderRadius,
                  minWidth: 180,
                  backgroundColor: '#7C9885',
                  borderColor: '#7C9885',
                  fontWeight: token.fontWeightStrong,
                  order: 2
                }}
              >
                {loading ? "Generating Document..." : "Generate Document"}
              </Button>
            </div>
          </Space>
        </Form>
      </div>
    </div>
  );
}