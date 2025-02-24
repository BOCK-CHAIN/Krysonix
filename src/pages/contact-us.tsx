'use client'
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { contactUs } from "~/Components/legacydetails";

const ContactUsPage = () => {
  return (
    <div className="bg-[#0D0D0D] flex justify-center items-center min-h-screen">
      <Link href="/" className="absolute top-4 left-4">
        <Image
          src="/logo.svg"
          alt="Home Logo"
          width={120}
          height={40}
          className="cursor-pointer"
        />
      </Link>
      <div className="bg-[#0D0D0D] text-gray-100 min-h-screen w-[80%] px-6 py-8">
        <h1 className="text-4xl font-bold mb-6 text-center ">
          Contact Us
        </h1>
        <p className="text-sm text-gray-400 text-center mb-8">
          <strong>Last Updated:</strong> {contactUs.lastUpdated}
        </p>

        {/* General Inquiries Section */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-indigo-300 mb-4">1. General Inquiries</h2>
          <p className="text-gray-300">{contactUs.sections.generalInquiries.description}</p>
          <p className="text-gray-300 mt-4">
            <strong>Email:</strong> <a href={`mailto:${contactUs.sections.generalInquiries.email}`} className="text-indigo-400 hover:text-indigo-500">{contactUs.sections.generalInquiries.email}</a>
          </p>
          <p className="text-gray-300">
            <strong>Phone:</strong> <a href={`tel:${contactUs.sections.generalInquiries.phone}`} className="text-indigo-400 hover:text-indigo-500">{contactUs.sections.generalInquiries.phone}</a>
          </p>
          <p className="text-gray-300">
            <strong>Office Address:</strong> {contactUs.sections.generalInquiries.officeAddress}
          </p>
          <p className="text-gray-300">
            <strong>Business Hours:</strong> {contactUs.sections.generalInquiries.businessHours}
          </p>
          <p className="text-gray-300 mt-4">{contactUs.sections.generalInquiries.enterpriseContact}</p>
        </section>

        {/* Customer Support Section */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-indigo-300 mb-4">2. Customer Support</h2>

          {/* Technical Support */}
          <div className="mb-4 ml-4">
            <h3 className="text-xl font-semibold text-indigo-200 mb-2">2.1 Technical Support</h3>
            <p className="leading-relaxed ml-6">{contactUs.sections.customerSupport.technicalSupport.description}</p>
            <p className="leading-relaxed ml-6 mt-2">
              <strong>Email:</strong> <a href={`mailto:${contactUs.sections.customerSupport.technicalSupport.email}`} className="text-indigo-400 hover:text-indigo-500">{contactUs.sections.customerSupport.technicalSupport.email}</a>
            </p>
            <p className="leading-relaxed ml-6 mt-2">
              <strong>Support Hours:</strong> {contactUs.sections.customerSupport.technicalSupport.supportHours}
            </p>
          </div>

          {/* Subscription & Billing Support */}
          <div className="mb-4 ml-4">
            <h3 className="text-xl font-semibold text-indigo-200 mb-2">2.2 Subscription & Billing Support</h3>
            <p className="leading-relaxed ml-6">{contactUs.sections.customerSupport.subscriptionBillingSupport.description}</p>
            <p className="leading-relaxed ml-6 mt-2">
              <strong>Email:</strong> <a href={`mailto:${contactUs.sections.customerSupport.subscriptionBillingSupport.email}`} className="text-indigo-400 hover:text-indigo-500">{contactUs.sections.customerSupport.subscriptionBillingSupport.email}</a>
            </p>
            <p className="leading-relaxed ml-6 mt-2">
              <strong>Phone:</strong> <a href={`tel:${contactUs.sections.customerSupport.subscriptionBillingSupport.phone}`} className="text-indigo-400 hover:text-indigo-500">{contactUs.sections.customerSupport.subscriptionBillingSupport.phone}</a>
            </p>
          </div>
        </section>

        {/* Sales & Enterprise Solutions Section */}

        {/* Reporting Abuse & Security Issues Section */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-indigo-300 mb-4">3. Reporting Abuse & Security Issues</h2>

          {/* Security Vulnerability */}
          <div className="mb-4 ml-4">
            <h3 className="text-xl font-semibold text-indigo-200 mb-2">3.1 Reporting a Security Vulnerability</h3>
            <p className="leading-relaxed ml-6">{contactUs.sections.reportingAbuseSecurityIssues.securityVulnerability.description}</p>
            <p className="leading-relaxed ml-6 mt-2">
              <strong>Email:</strong> <a href={`mailto:${contactUs.sections.reportingAbuseSecurityIssues.securityVulnerability.email}`} className="text-indigo-400 hover:text-indigo-500">{contactUs.sections.reportingAbuseSecurityIssues.securityVulnerability.email}</a>
            </p>
            <p className="leading-relaxed ml-6 mt-2">{contactUs.sections.reportingAbuseSecurityIssues.securityVulnerability.disclosurePolicy}</p>
          </div>

          {/* Misuse or Abuse */}
          <div className="mb-4 ml-4">
            <h3 className="text-xl font-semibold text-indigo-200 mb-2">3.2 Reporting Misuse or Abuse</h3>
            <p className="leading-relaxed ml-6">{contactUs.sections.reportingAbuseSecurityIssues.misuseAbuse.description}</p>
            <p className="leading-relaxed ml-6 mt-2">
              <strong>Email:</strong> <a href={`mailto:${contactUs.sections.reportingAbuseSecurityIssues.misuseAbuse.email}`} className="text-indigo-400 hover:text-indigo-500">{contactUs.sections.reportingAbuseSecurityIssues.misuseAbuse.email}</a>
            </p>
          </div>
        </section>

        {/* Escalation Process Section */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-indigo-300 mb-4">4. Escalation Process</h2>
          <p className="text-gray-300">{contactUs.sections.escalationProcess.description}</p>
          <ol className="ml-6 list-decimal mt-4 space-y-2">
            {contactUs.sections.escalationProcess.steps.map((step, stepIndex) => (
              <li key={stepIndex} className="text-gray-300">{step}</li>
            ))}
          </ol>
          <p className="text-gray-300 mt-4">{contactUs.sections.escalationProcess.resolutionTimeline}</p>
        </section>

        {/* Office Locations Section */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-indigo-300 mb-4">5. Office Locations</h2>
          <h3 className="text-xl font-semibold text-indigo-200 mb-2">Headquarters</h3>
          <p className="leading-relaxed ml-6"><strong>Company Name: </strong>{" "}{contactUs.sections.officeLocations.headquarters.companyName}</p>
          <p className="leading-relaxed ml-6"><strong>Platform Name:</strong>{" "}{contactUs.sections.officeLocations.headquarters.platformName}</p>
          <p className="leading-relaxed ml-6">
            <strong>Email:</strong>{" "}
            <a href={`mailto:${contactUs.sections.officeLocations.headquarters.email}`} className="text-indigo-200">
              {contactUs.sections.officeLocations.headquarters.email}
            </a>
          </p>
          <p className="leading-relaxed ml-6">
            <strong>Phone:</strong> <a href={`tel:${contactUs.sections.officeLocations.headquarters.phone}`} className="text-indigo-400 hover:text-indigo-500">{contactUs.sections.officeLocations.headquarters.phone}</a>
          </p>
          <p className="leading-relaxed ml-6"><strong>Corporate Office:</strong>{" "}
            {contactUs.sections.officeLocations.headquarters.corporateOffice}
          </p>
          <p className="leading-relaxed ml-6"><strong>Registered Office:</strong>{" "}{contactUs.sections.officeLocations.headquarters.registeredOffice}</p>
        </section>
      </div>
    </div>
  );
};

export default ContactUsPage;
