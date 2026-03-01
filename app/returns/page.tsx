"use client"

import Link from "next/link"
import { ArrowLeft, Package, RefreshCw, Clock, CheckCircle, XCircle, Mail, Phone, Shield } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function ReturnsPage() {
  const returnSteps = [
    {
      step: "1",
      title: "Contact Us",
      description: "Email us at support@quickclean.com with your order number, product name, and reason for return."
    },
    {
      step: "2", 
      title: "Get Return Label",
      description: "We'll send you a prepaid return label within 24 hours."
    },
    {
      step: "3",
      title: "Pack Your Item", 
      description: "Use original packaging if possible. Include all accessories and protect the product."
    },
    {
      step: "4",
      title: "Ship Your Return",
      description: "Drop off at any Canada Post location. Keep your receipt as proof."
    },
    {
      step: "5",
      title: "Get Your Refund",
      description: "Inspection within 1-2 days, refund processed within 3-5 business days."
    }
  ]

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-gray-600 hover:text-[#5a9ea8] transition-colors mb-6 font-[var(--font-dm-sans)]"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            
            <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4 font-[var(--font-dm-sans)]">
              Returns & Exchanges
            </h1>
            <p className="text-lg text-gray-600 font-[var(--font-dm-sans)]">
              We want you to love your QuickClean. If you're not satisfied, we're here to help.
            </p>
          </div>

          {/* Return Policy */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <h2 className="text-xl font-semibold text-[#1a1a1a] mb-4 flex items-center gap-2 font-[var(--font-dm-sans)]">
              <Shield className="w-5 h-5 text-[#5a9ea8]" />
              30-Day Return Policy
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-green-800 mb-1 font-[var(--font-dm-sans)]">0-30 days</h3>
                <p className="text-green-700 text-sm font-[var(--font-dm-sans)]">Full refund or exchange</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <h3 className="font-semibold text-yellow-800 mb-1 font-[var(--font-dm-sans)]">30+ days</h3>
                <p className="text-yellow-700 text-sm font-[var(--font-dm-sans)]">2-month warranty for defects only</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <h3 className="font-semibold text-red-800 mb-1 font-[var(--font-dm-sans)]">Used/Damaged</h3>
                <p className="text-red-700 text-sm font-[var(--font-dm-sans)]">No refund for misuse</p>
              </div>
            </div>
          </div>

          {/* Return Process */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <h2 className="text-xl font-semibold text-[#1a1a1a] mb-6 flex items-center gap-2 font-[var(--font-dm-sans)]">
              <Package className="w-5 h-5 text-[#5a9ea8]" />
              How to Return a Product
            </h2>
            
            <div className="space-y-6">
              {returnSteps.map((step, index) => (
                <div key={step.step} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#5a9ea8] text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1a1a1a] mb-1 font-[var(--font-dm-sans)]">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 font-[var(--font-dm-sans)]">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Exchanges */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <h2 className="text-xl font-semibold text-[#1a1a1a] mb-4 flex items-center gap-2 font-[var(--font-dm-sans)]">
              <RefreshCw className="w-5 h-5 text-[#5a9ea8]" />
              Exchanges
            </h2>
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2 font-[var(--font-dm-sans)]">
                <RefreshCw className="w-4 h-4" />
                Simplified Exchange Process
              </h3>
              <p className="text-blue-700 mb-3 font-[var(--font-dm-sans)]">
                Prefer to exchange rather than return? We make it easy!
              </p>
              <ul className="space-y-2 text-blue-700 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="font-[var(--font-dm-sans)]">Same process as returns - just mention you want an exchange</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="font-[var(--font-dm-sans)]">We ship your new product as soon as we receive the old one</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="font-[var(--font-dm-sans)]">Price difference charged or refunded if applicable</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
            <h2 className="text-xl font-semibold text-[#1a1a1a] mb-4 font-[var(--font-dm-sans)]">
              Need Help with Your Return?
            </h2>
            <p className="text-gray-600 mb-6 font-[var(--font-dm-sans)]">
              Our customer service team is here to make your return process as smooth as possible.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center justify-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-[#5a9ea8]" />
                <div className="text-left">
                  <p className="font-semibold text-[#1a1a1a] font-[var(--font-dm-sans)]">Email Support</p>
                  <p className="text-sm text-gray-600 font-[var(--font-dm-sans)]">support@quickclean.com</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-[#5a9ea8]" />
                <div className="text-left">
                  <p className="font-semibold text-[#1a1a1a] font-[var(--font-dm-sans)]">Phone Support</p>
                  <p className="text-sm text-gray-600 font-[var(--font-dm-sans)]">1-800-QUICKCLEAN</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-[#5a9ea8] hover:bg-[#4a8a94] text-white px-6 py-3 rounded-lg font-medium transition-colors font-[var(--font-dm-sans)]"
              >
                Contact Support
              </Link>
              <Link
                href="/order-tracking"
                className="border border-[#5a9ea8] text-[#5a9ea8] hover:bg-[#5a9ea8] hover:text-white px-6 py-3 rounded-lg font-medium transition-colors font-[var(--font-dm-sans)]"
              >
                Track Your Order
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  )
}
