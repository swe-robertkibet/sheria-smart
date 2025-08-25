"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  isCurrentPage?: boolean;
}

interface BreadcrumbNavigationProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

export function BreadcrumbNavigation({
  items,
  className = "",
  showHome = true,
}: BreadcrumbNavigationProps) {
  const allItems: BreadcrumbItem[] = showHome
    ? [
        {
          label: "Home",
          onClick: items[0]?.onClick, // Assume first item's onClick goes to home
        },
        ...items,
      ]
    : items;

  const handleItemClick = (item: BreadcrumbItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.href) {
      window.location.href = item.href;
    }
  };

  return (
    <nav
      className={`flex items-center space-x-1 text-sm text-[#718096] ${className}`}
      aria-label="Breadcrumb"
    >
      {allItems.map((item, index) => {
        const isLast = index === allItems.length - 1;
        const isHome = showHome && index === 0;

        return (
          <div key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 mx-1 text-[#CBD5E0]" />
            )}
            
            {item.isCurrentPage || isLast ? (
              <span
                className={`${
                  item.isCurrentPage || isLast
                    ? "text-[#2D3748] font-medium"
                    : "text-[#718096]"
                }`}
              >
                {isHome ? (
                  <div className="flex items-center">
                    <Home className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </div>
                ) : (
                  item.label
                )}
              </span>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className={`h-auto p-0 text-[#718096] hover:text-[#7C9885] hover:bg-transparent font-normal ${
                  isHome ? "flex items-center" : ""
                }`}
                onClick={() => handleItemClick(item)}
              >
                {isHome ? (
                  <>
                    <Home className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </>
                ) : (
                  item.label
                )}
              </Button>
            )}
          </div>
        );
      })}
    </nav>
  );
}

// Helper function to shorten category names for breadcrumbs
const shortenCategoryName = (categoryName: string): string => {
  const shorteningMap: Record<string, string> = {
    "Business & Commercial": "Business",
    "Property & Real Estate": "Property", 
    "Employment & HR": "Employment",
    "Corporate Governance": "Corporate",
    "Litigation & Dispute Resolution": "Litigation",
    "Regulatory & Compliance": "Compliance",
    "Intellectual Property": "IP",
    "Family Law": "Family"
  };
  
  return shorteningMap[categoryName] || categoryName;
};

// Helper function to create breadcrumb items for common navigation patterns
export const createDocumentBreadcrumbs = (
  categoryName?: string,
  documentName?: string,
  onNavigateHome?: () => void,
  onNavigateToDocuments?: () => void,
  onNavigateToCategory?: () => void
): BreadcrumbItem[] => {
  const items: BreadcrumbItem[] = [];

  if (onNavigateToDocuments) {
    items.push({
      label: "Documents",
      onClick: onNavigateToDocuments,
    });
  }

  if (categoryName && onNavigateToCategory) {
    items.push({
      label: shortenCategoryName(categoryName),
      onClick: onNavigateToCategory,
    });
  }

  if (documentName) {
    items.push({
      label: documentName,
      isCurrentPage: true,
    });
  }


  return items;
};

// Helper function for chat breadcrumbs
export const createChatBreadcrumbs = (
  chatType: "Quick Chat" | "Legal Analysis",
  sessionId?: string,
  onNavigateHome?: () => void
): BreadcrumbItem[] => {
  const items: BreadcrumbItem[] = [
    {
      label: chatType,
      onClick: onNavigateHome,
    },
  ];

  if (sessionId) {
    items.push({
      label: `Session ${sessionId.slice(-8)}`,
      isCurrentPage: true,
    });
  }

  return items;
};