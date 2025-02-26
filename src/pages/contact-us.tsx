"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { contactUs } from "~/Components/legacydetails";

const ContactUsPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0D0D0D]">
      <Link href="/" className="absolute left-4 top-4">
        <Image
          src="/logo.svg"
          alt="Home Logo"
          width={120}
          height={40}
          className="cursor-pointer"
        />
      </Link>
      <div className="mt-4 min-h-screen w-[80%] bg-[#0D0D0D] px-6 py-8 text-gray-100">
        <h1 className="mb-6 text-center text-4xl font-bold ">Contact Us</h1>
        <p className="mb-8 text-center text-sm text-gray-400">
          <strong>Last Updated:</strong> {contactUs.lastUpdated}
        </p>

        <section className="mb-8">
          <h2 className="mb-4 text-3xl font-bold text-indigo-300">
            1. General Inquiries
          </h2>
          <p className="text-gray-300">
            {contactUs.sections.generalInquiries.description}
          </p>
          <p className="mt-4 text-gray-300">
            <strong>Email:</strong>{" "}
            <a
              href={`mailto:${contactUs.sections.generalInquiries.email}`}
              className="text-indigo-400 hover:text-indigo-500"
            >
              {contactUs.sections.generalInquiries.email}
            </a>
          </p>
          <p className="text-gray-300">
            <strong>Phone:</strong>{" "}
            <a
              href={`tel:${contactUs.sections.generalInquiries.phone}`}
              className="text-indigo-400 hover:text-indigo-500"
            >
              {contactUs.sections.generalInquiries.phone}
            </a>
          </p>
          <p className="text-gray-300">
            <strong>Office Address:</strong>{" "}
            {contactUs.sections.generalInquiries.officeAddress}
          </p>
          <p className="text-gray-300">
            <strong>Business Hours:</strong>{" "}
            {contactUs.sections.generalInquiries.businessHours}
          </p>
          <p className="mt-4 text-gray-300">
            {contactUs.sections.generalInquiries.enterpriseContact}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-3xl font-bold text-indigo-300">
            2. Customer Support
          </h2>

          <div className="mb-4 ml-4">
            <h3 className="mb-2 text-xl font-semibold text-indigo-200">
              2.1 Technical Support
            </h3>
            <p className="ml-6 leading-relaxed">
              {contactUs.sections.customerSupport.technicalSupport.description}
            </p>
            <p className="ml-6 mt-2 leading-relaxed">
              <strong>Email:</strong>{" "}
              <a
                href={`mailto:${contactUs.sections.customerSupport.technicalSupport.email}`}
                className="text-indigo-400 hover:text-indigo-500"
              >
                {contactUs.sections.customerSupport.technicalSupport.email}
              </a>
            </p>
            <p className="ml-6 mt-2 leading-relaxed">
              <strong>Support Hours:</strong>{" "}
              {contactUs.sections.customerSupport.technicalSupport.supportHours}
            </p>
          </div>

          <div className="mb-4 ml-4">
            <h3 className="mb-2 text-xl font-semibold text-indigo-200">
              2.2 Subscription & Billing Support
            </h3>
            <p className="ml-6 leading-relaxed">
              {
                contactUs.sections.customerSupport.subscriptionBillingSupport
                  .description
              }
            </p>
            <p className="ml-6 mt-2 leading-relaxed">
              <strong>Email:</strong>{" "}
              <a
                href={`mailto:${contactUs.sections.customerSupport.subscriptionBillingSupport.email}`}
                className="text-indigo-400 hover:text-indigo-500"
              >
                {
                  contactUs.sections.customerSupport.subscriptionBillingSupport
                    .email
                }
              </a>
            </p>
            <p className="ml-6 mt-2 leading-relaxed">
              <strong>Phone:</strong>{" "}
              <a
                href={`tel:${contactUs.sections.customerSupport.subscriptionBillingSupport.phone}`}
                className="text-indigo-400 hover:text-indigo-500"
              >
                {
                  contactUs.sections.customerSupport.subscriptionBillingSupport
                    .phone
                }
              </a>
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-3xl font-bold text-indigo-300">
            3. Reporting Abuse & Security Issues
          </h2>

          <div className="mb-4 ml-4">
            <h3 className="mb-2 text-xl font-semibold text-indigo-200">
              3.1 Reporting a Security Vulnerability
            </h3>
            <p className="ml-6 leading-relaxed">
              {
                contactUs.sections.reportingAbuseSecurityIssues
                  .securityVulnerability.description
              }
            </p>
            <p className="ml-6 mt-2 leading-relaxed">
              <strong>Email:</strong>{" "}
              <a
                href={`mailto:${contactUs.sections.reportingAbuseSecurityIssues.securityVulnerability.email}`}
                className="text-indigo-400 hover:text-indigo-500"
              >
                {
                  contactUs.sections.reportingAbuseSecurityIssues
                    .securityVulnerability.email
                }
              </a>
            </p>
            <p className="ml-6 mt-2 leading-relaxed">
              {
                contactUs.sections.reportingAbuseSecurityIssues
                  .securityVulnerability.disclosurePolicy
              }
            </p>
          </div>

          <div className="mb-4 ml-4">
            <h3 className="mb-2 text-xl font-semibold text-indigo-200">
              3.2 Reporting Misuse or Abuse
            </h3>
            <p className="ml-6 leading-relaxed">
              {
                contactUs.sections.reportingAbuseSecurityIssues.misuseAbuse
                  .description
              }
            </p>
            <p className="ml-6 mt-2 leading-relaxed">
              <strong>Email:</strong>{" "}
              <a
                href={`mailto:${contactUs.sections.reportingAbuseSecurityIssues.misuseAbuse.email}`}
                className="text-indigo-400 hover:text-indigo-500"
              >
                {
                  contactUs.sections.reportingAbuseSecurityIssues.misuseAbuse
                    .email
                }
              </a>
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-3xl font-bold text-indigo-300">
            4. Escalation Process
          </h2>
          <p className="text-gray-300">
            {contactUs.sections.escalationProcess.description}
          </p>
          <ol className="ml-6 mt-4 list-decimal space-y-2">
            {contactUs.sections.escalationProcess.steps.map(
              (step, stepIndex) => (
                <li key={stepIndex} className="text-gray-300">
                  {step}
                </li>
              )
            )}
          </ol>
          <p className="mt-4 text-gray-300">
            {contactUs.sections.escalationProcess.resolutionTimeline}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-3xl font-bold text-indigo-300">
            5. Office Locations
          </h2>
          <h3 className="mb-2 text-xl font-semibold text-indigo-200">
            Headquarters
          </h3>
          <p className="ml-6 leading-relaxed">
            <strong>Company Name: </strong>{" "}
            {contactUs.sections.officeLocations.headquarters.companyName}
          </p>
          <p className="ml-6 leading-relaxed">
            <strong>Platform Name:</strong>{" "}
            {contactUs.sections.officeLocations.headquarters.platformName}
          </p>
          <p className="ml-6 leading-relaxed">
            <strong>Email:</strong>{" "}
            <a
              href={`mailto:${contactUs.sections.officeLocations.headquarters.email}`}
              className="text-indigo-200"
            >
              {contactUs.sections.officeLocations.headquarters.email}
            </a>
          </p>
          <p className="ml-6 leading-relaxed">
            <strong>Phone:</strong>{" "}
            <a
              href={`tel:${contactUs.sections.officeLocations.headquarters.phone}`}
              className="text-indigo-400 hover:text-indigo-500"
            >
              {contactUs.sections.officeLocations.headquarters.phone}
            </a>
          </p>
          <p className="ml-6 leading-relaxed">
            <strong>Corporate Office:</strong>{" "}
            {contactUs.sections.officeLocations.headquarters.corporateOffice}
          </p>
          <p className="ml-6 leading-relaxed">
            <strong>Registered Office:</strong>{" "}
            {contactUs.sections.officeLocations.headquarters.registeredOffice}
          </p>
        </section>
      </div>
    </div>
  );
};

export default ContactUsPage;
