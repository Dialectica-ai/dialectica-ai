"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, Mail, Phone } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactPurpose: "",
    role: "",
    message: "",
  });

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Enter a valid email address";
    if (!formData.contactPurpose.trim()) errors.contactPurpose = "Please select a contact purpose";
    if (!formData.role.trim()) errors.role = "Please select your role";
    if (!formData.message.trim() || formData.message.length < 10)
      errors.message = "Message must be at least 10 characters long";

    return errors;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      const newErrors = { ...formErrors };
      delete newErrors[field];
      setFormErrors(newErrors);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("⚠️ Please fix the form errors before submitting.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      toast.success("✅ Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", contactPurpose: "", role: "", message: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="max-w-3xl min-h-screen mx-auto py-16 px-4">
      <div className="text-center mb-12">

        <Link href="/"><ChevronLeft height={20} width={20}/></Link>
        <h1 className="text-4xl md:text-6xl font-bold text-blue-400 mb-4 dialecta-heading">
          Contact Dialecta AI
        </h1>
        <p className="text-white/80 text-lg max-w-2xl mx-auto">
          Have questions about our AI-powered solutions? Want to schedule a demo? 
          We're here to help transform your business with intelligent automation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="space-y-3">
            <Label htmlFor="name" className="font-medium text-white">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="John Doe"
              className={`text-white scan-effect transition-all duration-300 bg-black/50 ${
                formErrors.name ? "border-dialecta-blue focus-visible:ring-dialecta-blue" : "border-white/20"
              }`}
            />
            {formErrors.name && (
              <p className="text-sm text-dialecta-blue font-medium">{formErrors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-3 text-white">
            <Label htmlFor="email" className="font-medium">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="example@company.com"
              className={`scan-effect transition-all duration-300 bg-black/50 text-white ${
                formErrors.email ? "border-dialecta-blue focus-visible:ring-dialecta-blue" : "border-white/20"
              }`}
            />
            {formErrors.email && (
              <p className="text-sm text-dialecta-blue font-medium">{formErrors.email}</p>
            )}
          </div>
        </div>

        {/* Professional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Purpose */}
          <div className="space-y-3">
            <Label className="text-white font-medium">Contact Purpose *</Label>
            <Select 
              value={formData.contactPurpose} 
              onValueChange={(value:string) => handleInputChange("contactPurpose", value)}
            >
              <SelectTrigger className={`scan-effect border rounded-xl px-4 py-3 w-full text-white shadow-lg transition-all duration-300 bg-black/50 ${
                formErrors.contactPurpose ? "border-dialecta-blue" : "border-white/20"
              }`}>
                <SelectValue placeholder="What brings you here?" />
              </SelectTrigger>
              <SelectContent className="bg-black/80 border border-white/10 backdrop-blur-xl text-white rounded-xl z-50">
                <SelectItem value="demo">Request Demo</SelectItem>
                <SelectItem value="sales">Sales Inquiry</SelectItem>
                <SelectItem value="support">Customer Support</SelectItem>
                <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                <SelectItem value="integration">Integration Questions</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {formErrors.contactPurpose && (
              <p className="text-sm text-dialecta-blue font-medium">{formErrors.contactPurpose}</p>
            )}
          </div>

          {/* Your Role */}
          <div className="space-y-3">
            <Label className="text-white font-medium">Your Role *</Label>
            <Select 
              value={formData.role} 
              onValueChange={(value) => handleInputChange("role", value)}
            >
              <SelectTrigger className={`scan-effect border rounded-xl px-4 py-3 text-white shadow-lg w-full transition-all duration-300 bg-black/50 ${
                formErrors.role ? "border-dialecta-blue" : "border-white/20"
              }`}>
                <SelectValue placeholder="Who are you?" />
              </SelectTrigger>
              <SelectContent className="bg-black/80 border border-white/10 backdrop-blur-xl text-white rounded-xl z-50">
                <SelectItem value="decision-maker">Decision Maker / Executive</SelectItem>
                <SelectItem value="manager">Product / Project Manager</SelectItem>
                <SelectItem value="developer">Developer / Engineer</SelectItem>
                <SelectItem value="customer">Current Customer</SelectItem>
                <SelectItem value="prospect">Prospective Customer</SelectItem>
                <SelectItem value="partner">Partner / Reseller</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {formErrors.role && (
              <p className="text-sm text-dialecta-blue font-medium">{formErrors.role}</p>
            )}
          </div>
        </div>

        {/* Message */}
        <div className="space-y-3 text-white">
          <Label htmlFor="message" className="font-medium">Your Message *</Label>
          <Textarea
            id="message"
            value={formData.message}
            onChange={(e) => handleInputChange("message", e.target.value)}
            placeholder="Tell us about your needs, questions, or how we can help you..."
            className={`scan-effect min-h-[140px] transition-all duration-300 bg-black/50 text-white ${
              formErrors.message ? "border-dialecta-blue focus-visible:ring-dialecta-blue" : "border-white/20"
            }`}
          />
          {formErrors.message && (
            <p className="text-sm text-dialecta-blue font-medium">{formErrors.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-dialecta-blue hover:bg-dialecta-blue/90 text-white dialecta-glow font-semibold py-3 text-lg transition-all duration-300 mt-6"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending Message...
            </span>
          ) : (
            "Send Message"
          )}
        </Button>
      </form>

      {/* Additional Contact Info */}
      <div className="mt-16 text-center">
        <div className="inline-flex flex-col sm:flex-row gap-6 text-white/70 text-sm">
          <div className="flex items-center justify-center gap-2">
            <Mail className="w-4 h-4" />
            <span>support@dialecta.ai</span>
          </div>
          
        </div>
        <p className="mt-4 text-white/50 text-xs">
          We typically respond within 24 hours during business days
        </p>
      </div>
    </div>
  );
}
