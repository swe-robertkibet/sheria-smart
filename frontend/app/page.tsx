"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import {
  MessageCircle,
  FileText,
  Shield,
  Brain,
  Download,
  Star,
  Home,
  Briefcase,
  ShoppingCart,
  FileCheck,
  Building,
  Users,
  Smartphone,
  Mic,
  Globe,
  Wifi,
  Scale,
  Menu,
  Linkedin,
  Mail,
  Github,
  ExternalLink,
  Heart,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { TypewriterText } from "@/components/typewriter-text";
import { CounterAnimation } from "@/components/counter-animation";
import { ScrollReveal } from "@/components/scroll-reveal";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { AuthLoading } from "@/components/auth-loading";
import { FaXTwitter } from "react-icons/fa6";

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { isAuthenticated, isValidatingToken, loadingContext } = useAuth();

  // All useEffect hooks must come before any conditional returns
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Note: Removed loading screen from home page as it's public content
  // Authentication state is checked but doesn't block page rendering

  return (
    <div className="min-h-screen bg-[#FEFCF3] overflow-x-hidden">
      {/* Navigation Header */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#FEFCF3]/90 backdrop-blur-md shadow-lg"
            : "bg-transparent"
        }`}
      >
        <nav className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Image
                src="/sheria-smart-ico.png"
                alt="Sheria Smart Icon"
                width={24}
                height={24}
                className="h-6 w-6"
              />
              <div className="text-xl font-bold">
                <span className="text-[#7C9885]">Sheria</span>
                <span className="text-[#C99383]"> Smart</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#how-it-works"
                className="text-[#2D3748] hover:text-[#7C9885] transition-colors"
              >
                How It Works
              </a>
              <a
                href="#use-cases"
                className="text-[#2D3748] hover:text-[#7C9885] transition-colors"
              >
                Use Cases
              </a>
              <a
                href="#about"
                className="text-[#2D3748] hover:text-[#7C9885] transition-colors"
              >
                About
              </a>
              <a
                href="#help"
                className="text-[#2D3748] hover:text-[#7C9885] transition-colors"
              >
                Help
              </a>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="bg-[#7C9885] hover:bg-[#5D7A6B] text-white transition-all duration-300"
                >
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/login")}
                    className="border-[#7C9885] text-[#7C9885] hover:bg-[#7C9885] hover:text-white bg-transparent transition-all duration-300"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => router.push("/login")}
                    className="bg-[#7C9885] hover:bg-[#5D7A6B] text-white transition-all duration-300"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Hamburger Menu */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="min-h-[44px] min-w-[44px] touch-manipulation"
                  >
                    <Menu className="w-6 h-6 text-[#2D3748]" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 bg-[#FEFCF3]">
                  <SheetHeader>
                    <VisuallyHidden.Root>
                      <SheetTitle>
                        Navigation menu and authentication options
                      </SheetTitle>
                      <SheetDescription>
                        Navigation menu and authentication options
                      </SheetDescription>
                    </VisuallyHidden.Root>
                  </SheetHeader>

                  <div className="mt-8 space-y-6">
                    {/* Navigation Links */}
                    <div className="space-y-4">
                      <a
                        href="#how-it-works"
                        className="block text-[#2D3748] hover:text-[#7C9885] transition-colors text-lg py-2 min-h-[44px] flex items-center touch-manipulation"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        How It Works
                      </a>
                      <a
                        href="#use-cases"
                        className="block text-[#2D3748] hover:text-[#7C9885] transition-colors text-lg py-2 min-h-[44px] flex items-center touch-manipulation"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Use Cases
                      </a>
                      <a
                        href="#about"
                        className="block text-[#2D3748] hover:text-[#7C9885] transition-colors text-lg py-2 min-h-[44px] flex items-center touch-manipulation"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        About
                      </a>
                      <a
                        href="#help"
                        className="block text-[#2D3748] hover:text-[#7C9885] transition-colors text-lg py-2 min-h-[44px] flex items-center touch-manipulation"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Help
                      </a>
                    </div>

                    {/* Auth Buttons */}
                    <div className="space-y-3 pt-6 border-t border-gray-200">
                      {isAuthenticated ? (
                        <Button
                          onClick={() => {
                            router.push("/dashboard");
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full bg-[#7C9885] hover:bg-[#5D7A6B] text-white transition-all duration-300 min-h-[48px] text-lg touch-manipulation"
                        >
                          Go to Dashboard
                        </Button>
                      ) : (
                        <>
                          <Button
                            onClick={() => {
                              router.push("/login");
                              setIsMobileMenuOpen(false);
                            }}
                            variant="outline"
                            className="w-full border-[#7C9885] text-[#7C9885] hover:bg-[#7C9885] hover:text-white bg-transparent transition-all duration-300 min-h-[48px] text-lg touch-manipulation"
                          >
                            Login
                          </Button>
                          <Button
                            onClick={() => {
                              router.push("/login");
                              setIsMobileMenuOpen(false);
                            }}
                            className="w-full bg-[#7C9885] hover:bg-[#5D7A6B] text-white transition-all duration-300 min-h-[48px] text-lg touch-manipulation"
                          >
                            Get Started
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 overflow-x-hidden">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-3 space-y-8">
              <div className="space-y-6">
                <h1 className="text-6xl lg:text-7xl font-bold text-[#2D3748] leading-tight">
                  <TypewriterText text="Legal Guidance Made Simple" />
                </h1>

                <ScrollReveal delay={800}>
                  <h2 className="text-2xl text-[#7C9885] font-medium">
                    AI-Powered Legal Assistant for Every Kenyan
                  </h2>
                </ScrollReveal>

                <ScrollReveal delay={1200} direction="left">
                  <p className="text-lg text-[#718096] max-w-2xl">
                    Get instant legal guidance, generate documents, and
                    understand your rights—all for free
                  </p>
                </ScrollReveal>
              </div>

              <ScrollReveal delay={1600}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    onClick={() => {
                      if (isAuthenticated) {
                        router.push("/dashboard");
                      } else {
                        router.push("/login");
                      }
                    }}
                    className="bg-gradient-to-r from-[#7C9885] to-[#5D7A6B] hover:from-[#5D7A6B] hover:to-[#4A6356] text-white px-8 py-4 text-lg rounded-xl transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl animate-pulse-gentle"
                  >
                    {isAuthenticated
                      ? "Go to Dashboard"
                      : "Get Started Free"}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      const element = document.getElementById("how-it-works");
                      element?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="border-2 border-[#C99383] text-[#C99383] hover:bg-[#C99383] hover:text-white px-8 py-4 text-lg rounded-xl transition-all duration-300 bg-transparent"
                  >
                    Learn How It Works
                  </Button>
                </div>
              </ScrollReveal>
            </div>

            <div className="lg:col-span-2">
              <ScrollReveal delay={1000}>
                {/* Rotated Card Container with Extra Padding */}
                <div className="relative w-full flex justify-center items-center py-16 px-8">
                  <div className="bg-gradient-to-br from-[#7C9885] to-[#5D7A6B] rounded-3xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500 w-full max-w-sm">
                    <div className="space-y-6">
                      <div className="flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                          <MessageCircle className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-white/10 rounded-lg p-3 text-white text-sm">
                          "Can my landlord increase rent without notice?"
                        </div>
                        <div className="bg-white/20 rounded-lg p-3 text-white text-sm ml-4">
                          "Under Kenyan law, landlords must give 3 months
                          notice..."
                        </div>
                      </div>
                      <div className="flex justify-center space-x-2">
                        <div className="w-2 h-2 bg-[#F7DC6F] rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-[#F7DC6F] rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-[#F7DC6F] rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 overflow-x-hidden">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Block 1 - Largest */}
            <ScrollReveal direction="left" className="lg:col-span-7">
              <Card className="bg-gradient-to-br from-[#7C9885] to-[#5D7A6B] border-0 h-full transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl">
                <CardContent className="p-8 text-white h-full flex flex-col justify-center">
                  <div className="space-y-6">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                      <MessageCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-3xl font-bold">
                      AI Legal Chat & Analysis
                    </h3>
                    <p className="text-lg text-white/90 leading-relaxed">
                      Two powerful AI modes: Quick Chat for instant answers and
                      Structured Legal Analysis for detailed guidance on complex
                      legal matters.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
                        Quick Chat
                      </div>
                      <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
                        Legal Analysis
                      </div>
                      <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
                        Session History
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            <div className="lg:col-span-5 space-y-8">
              {/* Block 2 */}
              <ScrollReveal direction="right">
                <Card className="bg-gradient-to-br from-[#C99383] to-[#B8826F] border-0 transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl">
                  <CardContent className="p-6 text-white">
                    <div className="space-y-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold">25+ Legal Documents</h3>
                      <p className="text-white/90">
                        Complete document generation across 8 categories:
                        Employment, Business, Property, Family Law, Corporate,
                        IP, Compliance & Dispute Resolution.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>

              {/* Block 3 */}
              <ScrollReveal delay={200}>
                <Card className="bg-gradient-to-br from-[#F7DC6F] to-[#F4D03F] border-0 transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl">
                  <CardContent className="p-6 text-[#2D3748]">
                    <div className="space-y-4">
                      <div className="w-12 h-12 bg-[#2D3748]/10 rounded-xl flex items-center justify-center">
                        <Scale className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold">
                        Kenyan Law Expertise
                      </h3>
                      <p className="text-[#2D3748]/80">
                        Trained specifically on Kenyan legal framework. From
                        Constitution to Commercial Law - get accurate, localized
                        guidance.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-20 px-6 bg-white overflow-x-hidden"
      >
        <div className="container mx-auto max-w-7xl">
          <ScrollReveal>
            <h2 className="text-4xl font-bold text-center text-[#2D3748] mb-16">
              How It Works
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-[#7C9885] via-[#C99383] to-[#F7DC6F]">
              <div className="absolute inset-0 bg-gradient-to-r from-[#7C9885] via-[#C99383] to-[#F7DC6F] animate-pulse"></div>
            </div>

            {/* Step 1 */}
            <ScrollReveal delay={200}>
              <div className="text-center space-y-6">
                <div className="relative">
                  <div className="text-8xl font-bold text-[#7C9885] opacity-20">
                    01
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-[#7C9885] rounded-full flex items-center justify-center">
                      <MessageCircle className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[#2D3748]">
                  Ask Your Question
                </h3>
                <p className="text-[#718096]">
                  Type your legal concern in plain English or Swahili
                </p>
                <div className="bg-[#F8FAF9] rounded-lg p-4 text-sm text-[#2D3748] italic">
                  <TypewriterText
                    text="Can my employer fire me without notice?"
                    speed={100}
                  />
                </div>
              </div>
            </ScrollReveal>

            {/* Step 2 */}
            <ScrollReveal delay={400}>
              <div className="text-center space-y-6">
                <div className="relative">
                  <div className="text-8xl font-bold text-[#C99383] opacity-20">
                    02
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-[#C99383] rounded-full flex items-center justify-center">
                      <Brain className="w-8 h-8 text-white animate-pulse" />
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[#2D3748]">
                  AI Analyzes & Responds
                </h3>
                <p className="text-[#718096]">
                  Our AI reviews Kenyan law and provides instant guidance
                </p>
                <div className="flex justify-center space-x-2">
                  <div className="w-3 h-3 bg-[#C99383] rounded-full animate-ping"></div>
                  <div
                    className="w-3 h-3 bg-[#C99383] rounded-full animate-ping"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-3 h-3 bg-[#C99383] rounded-full animate-ping"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </ScrollReveal>

            {/* Step 3 */}
            <ScrollReveal delay={600}>
              <div className="text-center space-y-6">
                <div className="relative">
                  <div className="text-8xl font-bold text-[#F7DC6F] opacity-20">
                    03
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-[#F7DC6F] rounded-full flex items-center justify-center">
                      <Download className="w-8 h-8 text-[#2D3748]" />
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[#2D3748]">
                  Get Your Answer + Documents
                </h3>
                <p className="text-[#718096]">
                  Receive clear advice plus generated documents if needed
                </p>
                <div className="bg-[#F7DC6F]/20 rounded-lg p-4 border-2 border-dashed border-[#F7DC6F] animate-bounce-gentle">
                  <FileText className="w-8 h-8 text-[#2D3748] mx-auto" />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 px-6 bg-[#F8FAF9] overflow-x-hidden">
        <div className="container mx-auto max-w-7xl">
          <ScrollReveal>
            <h2 className="text-4xl font-bold text-center text-[#2D3748] mb-16">
              Trusted by Thousands of Kenyans
            </h2>
          </ScrollReveal>

          {/* Statistics */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <ScrollReveal delay={200}>
              <Card className="text-center p-8 border-0 shadow-lg">
                <CardContent className="space-y-4">
                  <div className="text-4xl font-bold text-[#7C9885]">
                    <CounterAnimation end={10000} suffix="+" />
                  </div>
                  <p className="text-[#718096]">Legal Questions Answered</p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={400}>
              <Card className="text-center p-8 border-0 shadow-lg">
                <CardContent className="space-y-4">
                  <div className="text-4xl font-bold text-[#C99383]">
                    <CounterAnimation end={5000} suffix="+" />
                  </div>
                  <p className="text-[#718096]">Documents Generated</p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={600}>
              <Card className="text-center p-8 border-0 shadow-lg">
                <CardContent className="space-y-4">
                  <div className="text-4xl font-bold text-[#F7DC6F]">
                    <CounterAnimation end={98} suffix="%" />
                  </div>
                  <p className="text-[#718096]">User Satisfaction</p>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-3 gap-8">
            <ScrollReveal delay={200}>
              <Card className="p-6 border-l-4 border-[#7C9885] shadow-lg">
                <CardContent className="space-y-4">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-[#F7DC6F] text-[#F7DC6F]"
                      />
                    ))}
                  </div>
                  <p className="italic text-[#718096]">
                    "Sheria Smart helped me understand my tenancy rights when my
                    landlord tried to evict me unfairly. The AI gave me clear
                    guidance and even generated a legal notice!"
                  </p>
                  <div className="text-sm text-[#2D3748] font-medium">
                    J.M. - Small Business Owner, Nairobi
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={400}>
              <Card className="p-6 border-l-4 border-[#C99383] shadow-lg">
                <CardContent className="space-y-4">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-[#F7DC6F] text-[#F7DC6F]"
                      />
                    ))}
                  </div>
                  <p className="italic text-[#718096]">
                    "As a university student, I couldn't afford a lawyer. Sheria
                    Smart helped me review my employment contract and spot
                    unfair clauses."
                  </p>
                  <div className="text-sm text-[#2D3748] font-medium">
                    A.K. - Student, Mombasa
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={600}>
              <Card className="p-6 border-l-4 border-[#F7DC6F] shadow-lg">
                <CardContent className="space-y-4">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-[#F7DC6F] text-[#F7DC6F]"
                      />
                    ))}
                  </div>
                  <p className="italic text-[#718096]">
                    "The document generation feature saved me thousands of
                    shillings in legal fees. Professional contracts in minutes!"
                  </p>
                  <div className="text-sm text-[#2D3748] font-medium">
                    M.W. - Entrepreneur, Kisumu
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>

          {/* Trust Signals */}
          <ScrollReveal delay={800}>
            <div className="mt-16 text-center space-y-4">
              <div className="flex justify-center space-x-8 text-sm text-[#718096]">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-[#7C9885]" />
                  <span>Reviewed by Kenyan Legal Experts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-[#7C9885]" />
                  <span>Data Protected & Encrypted</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-[#7C9885]" />
                  <span>KDPA 2019 Compliant</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-20 px-6 bg-white overflow-x-hidden">
        <div className="container mx-auto max-w-7xl">
          <ScrollReveal>
            <h2 className="text-4xl font-bold text-center text-[#2D3748] mb-16">
              Comprehensive Legal Solutions
            </h2>
            <p className="text-center text-[#718096] text-lg mb-12 max-w-3xl mx-auto">
              From AI-powered legal advice to professional document generation,
              we've got you covered
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: MessageCircle,
                title: "AI Legal Chat",
                description: "Get instant answers to legal questions",
                bg: "from-[#7C9885] to-[#5D7A6B]",
                action: "chat",
              },
              {
                icon: Scale,
                title: "Legal Analysis",
                description: "Detailed structured legal guidance",
                bg: "from-[#C99383] to-[#B8826F]",
                action: "analysis",
              },
              {
                icon: FileText,
                title: "Employment Documents",
                description: "Contracts, agreements & HR documents",
                bg: "from-[#F7DC6F] to-[#F4D03F]",
                action: "employment",
              },
              {
                icon: Home,
                title: "Property & Real Estate",
                description: "Lease agreements & property contracts",
                bg: "from-[#7C9885] to-[#5D7A6B]",
                action: "property",
              },
              {
                icon: Briefcase,
                title: "Business Contracts",
                description: "Partnership, sales & commercial agreements",
                bg: "from-[#C99383] to-[#B8826F]",
                action: "business",
              },
              {
                icon: Users,
                title: "Family Law Documents",
                description: "Prenuptial, postnuptial & custody agreements",
                bg: "from-[#F7DC6F] to-[#F4D03F]",
                action: "family",
              },
              {
                icon: Building,
                title: "Corporate Governance",
                description: "Articles, shareholder agreements & resolutions",
                bg: "from-[#7C9885] to-[#5D7A6B]",
                action: "corporate",
              },
              {
                icon: Shield,
                title: "Compliance Documents",
                description: "Data protection, AML & environmental compliance",
                bg: "from-[#C99383] to-[#B8826F]",
                action: "compliance",
              },
              {
                icon: FileCheck,
                title: "Dispute Resolution",
                description: "Settlement, arbitration & mediation agreements",
                bg: "from-[#F7DC6F] to-[#F4D03F]",
                action: "dispute",
              },
            ].map((useCase, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <Card
                  className={`bg-gradient-to-br ${useCase.bg} border-0 transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl cursor-pointer group`}
                  onClick={() => {
                    if (
                      useCase.action === "chat" ||
                      useCase.action === "analysis"
                    ) {
                      if (isAuthenticated) {
                        router.push("/dashboard");
                      } else {
                        router.push("/login");
                      }
                    } else {
                      if (isAuthenticated) {
                        router.push("/dashboard");
                      } else {
                        router.push("/login");
                      }
                    }
                  }}
                >
                  <CardContent className="p-8 text-center space-y-4">
                    {(() => {
                      const isYellowCard = useCase.bg.includes("#F7DC6F");
                      return (
                        <>
                          <div
                            className={`w-16 h-16 ${
                              isYellowCard ? "bg-[#2D3748]/10" : "bg-white/20"
                            } rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}
                          >
                            <useCase.icon
                              className={`w-8 h-8 ${
                                isYellowCard ? "text-[#2D3748]" : "text-white"
                              }`}
                            />
                          </div>
                          <h3
                            className={`text-xl font-bold ${
                              isYellowCard ? "text-[#2D3748]" : "text-white"
                            }`}
                          >
                            {useCase.title}
                          </h3>
                          <p
                            className={`text-sm leading-relaxed ${
                              isYellowCard
                                ? "text-[#2D3748]/80"
                                : "text-white/90"
                            }`}
                          >
                            {useCase.description}
                          </p>
                          <Button
                            variant="outline"
                            className={`${
                              isYellowCard
                                ? "border-[#2D3748] text-[#2D3748] hover:bg-[#2D3748] hover:text-white"
                                : "border-white text-white hover:bg-white hover:text-[#2D3748]"
                            } transition-all duration-300 bg-transparent`}
                          >
                            {isAuthenticated
                              ? "Go to Dashboard"
                              : "Get Started"}
                          </Button>
                        </>
                      );
                    })()}
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile/Accessibility Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#FEFCF3] to-[#F8FAF9] overflow-x-hidden">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left">
              {/* Rotated Card Container with Extra Padding */}
              <div className="relative w-full flex justify-center items-center py-16 px-8">
                <div className="bg-gradient-to-br from-[#7C9885] to-[#5D7A6B] rounded-3xl p-8 transform -rotate-3 hover:rotate-0 transition-transform duration-500 w-full max-w-md">
                  <div className="bg-white rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-[#2D3748]">
                        Sheria Smart
                      </div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-[#F8FAF9] rounded-lg p-3 text-sm">
                        "Hujambo! How can I help with your legal question?"
                      </div>
                      <div className="bg-[#7C9885] text-white rounded-lg p-3 text-sm ml-8">
                        "I need help with my employment contract"
                      </div>
                      <div className="bg-[#F8FAF9] rounded-lg p-3 text-sm">
                        "I can help you review that. Please share the specific
                        clauses you're concerned about..."
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="space-y-8">
                <h2 className="text-4xl font-bold text-[#2D3748]">
                  Legal Help Anywhere, Anytime
                </h2>

                <div className="space-y-6">
                  {[
                    { icon: Scale, text: "Kenyan Law Expertise" },
                    { icon: MessageCircle, text: "Dual AI Chat Modes" },
                    { icon: FileText, text: "25+ Document Templates" },
                    { icon: Brain, text: "Context-Aware Guidance" },
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-[#7C9885] rounded-xl flex items-center justify-center">
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-lg text-[#2D3748]">
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#5D7A6B] to-[#4A6356] relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-[#F7DC6F]/20 rounded-full animate-float-delayed"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-[#C99383]/20 rounded-full animate-float"></div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <ScrollReveal>
            <div className="space-y-8">
              <h2 className="text-5xl font-bold text-white">
                Start Your Free Legal Consultation
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Join thousands of Kenyans getting smart legal help
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button
                  size="lg"
                  onClick={() => {
                    if (isAuthenticated) {
                      router.push("/dashboard");
                    } else {
                      router.push("/login");
                    }
                  }}
                  className="bg-[#F7DC6F] hover:bg-[#F4D03F] text-[#2D3748] px-12 py-4 text-xl rounded-xl transform hover:-translate-y-1 transition-all duration-300 shadow-2xl hover:shadow-3xl font-bold"
                >
                  {isAuthenticated ? "Go to Dashboard" : "Get Started Now"}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    const element = document.getElementById("how-it-works");
                    element?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="border-2 border-white text-white hover:bg-white hover:text-[#2D3748] px-12 py-4 text-xl rounded-xl transition-all duration-300 bg-transparent"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2D3748] text-[#E2E8F0] py-16 px-6 overflow-x-hidden">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">
                About Sheria Smart
              </h3>
              <p className="text-sm">
                Making legal help accessible to every Kenyan through AI-powered
                assistance.
              </p>
              <div className="text-[#7C9885] font-medium">"Proudly Kenyan"</div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">
                Document Categories
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#use-cases"
                    className="hover:text-[#7C9885] transition-colors"
                  >
                    Employment & HR
                  </a>
                </li>
                <li>
                  <a
                    href="#use-cases"
                    className="hover:text-[#7C9885] transition-colors"
                  >
                    Business Contracts
                  </a>
                </li>
                <li>
                  <a
                    href="#use-cases"
                    className="hover:text-[#7C9885] transition-colors"
                  >
                    Property & Real Estate
                  </a>
                </li>
                <li>
                  <a
                    href="#use-cases"
                    className="hover:text-[#7C9885] transition-colors"
                  >
                    Family Law Documents
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-[#7C9885] transition-colors"
                  >
                    Legal Guides
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[#7C9885] transition-colors"
                  >
                    Know Your Rights
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[#7C9885] transition-colors"
                  >
                    Document Templates
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.reuters.com/legal/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#7C9885] transition-colors"
                  >
                    Legal News
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Support</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-[#7C9885] transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-[#7C9885] transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#4A5568] pt-8">
            {/* Made with Love Attribution */}
            <div className="text-center mb-6">
              <p className="text-sm text-[#A0AEC0] flex items-center justify-center space-x-1">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
                <span>by</span>
                <a
                  href="https://robertkibet.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#7C9885] hover:text-[#F7DC6F] transition-colors duration-300 font-medium ml-1"
                >
                  Robert Kibet
                </a>
              </p>
            </div>

            {/* Copyright and Social Links */}
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-sm">
                © 2025 Sheria Smart. All rights reserved.
              </div>

              {/* Social Links */}
              <div className="flex space-x-3 mt-4 md:mt-0">
                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/robert-kibet/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-10 h-10 bg-[#0077B5] rounded-full flex items-center justify-center hover:bg-[#005885] transition-all duration-300 hover:scale-110 hover:rotate-12 shadow-lg hover:shadow-xl"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
                </a>

                {/* Email */}
                <a
                  href="mailto:swe.robertkibet@gmail.com"
                  className="group w-10 h-10 bg-[#EA4335] rounded-full flex items-center justify-center hover:bg-[#C23321] transition-all duration-300 hover:scale-110 hover:rotate-12 shadow-lg hover:shadow-xl"
                  aria-label="Send Email"
                >
                  <Mail className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
                </a>

                {/* GitHub */}
                <a
                  href="https://github.com/swe-robertkibet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-10 h-10 bg-[#7C9885] rounded-full flex items-center justify-center hover:bg-[#5D7A6B] transition-all duration-300 hover:scale-110 hover:rotate-12 shadow-lg hover:shadow-xl"
                  aria-label="GitHub Profile"
                >
                  <Github className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
                </a>

                {/* Portfolio */}
                <a
                  href="https://robertkibet.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-10 h-10 bg-[#F7DC6F] rounded-full flex items-center justify-center hover:bg-[#F4D03F] transition-all duration-300 hover:scale-110 hover:rotate-12 shadow-lg hover:shadow-xl"
                  aria-label="Portfolio Website"
                >
                  <ExternalLink className="w-5 h-5 text-[#2D3748] group-hover:scale-110 transition-transform duration-300" />
                </a>

                {/* X */}
                <a
                  href="https://x.com/21_stoic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-10 h-10 bg-[#C99383] rounded-full flex items-center justify-center hover:bg-[#B8826F] transition-all duration-300 hover:scale-110 hover:rotate-12 shadow-lg hover:shadow-xl"
                  aria-label="X Profile"
                >
                  <FaXTwitter className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
