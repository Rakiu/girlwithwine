import React from "react";
import Footer from "./common/Footer";
import Header from "./common/header";

const PrivacyPolicy = ({ lastUpdated = "December 2025" }) => {
  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-5xl mx-auto bg-white shadow-md rounded-xl p-8">

          {/* Last Updated */}
          <div className="mb-10">
            <p className="text-sm text-gray-600">
              Last Updated: {lastUpdated}
            </p>
          </div>

          {/* PRIVACY POLICY CONTENT */}
          <section
            className="
              prose prose-sm lg:prose-lg text-gray-700 leading-relaxed
              [&_p]:text-gray-700 [&_p]:text-base [&_p]:mb-4
              [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#A3195B] [&_h2]:mt-8 [&_h2]:mb-3
              [&_ul]:list-disc [&_ul]:pl-6
            "
          >
            <p>
              We are dedicated to protecting the personal information of all users and advertisers who interact with our platform. In order to comply with applicable Data Protection Laws, every piece of data you share with us is managed with strict confidentiality and used only for legitimate operational purposes. While we take full responsibility for safeguarding the information you provide privately, any details an Offeror User chooses to make public on their profile remain under their own control, and the platform cannot be held liable if such openly shared information is accessed or misused by unintended parties. This Privacy Policy may be modified occasionally to align with new legal requirements or regulatory directives, and any important updates will be communicated through revised links or on-site notices.
            </p>

            <p>
              The information we collect may include personal details such as your name, phone number, email address, and identification documents, as well as payment-related data such as your transaction history and purchase records. You may also voluntarily provide additional details like your age, gender, profile images, or other information you choose to share. In some cases, preference-based categories may be collected if you submit them willingly. Technical information may also be gathered automatically, including your IP address, device type, browser information, and cookie data. Along with this, non-identifiable aggregated data may be gathered to help us understand user behavior and improve the performance of our services.
            </p>

            <p>
            Your personal information is used for several lawful purposes, including enabling account creation, allowing the smooth use of the website, communicating with other users, publishing advertisements, and completing verification requirements. It also helps us process payments, send promotional messages when you have agreed to receive them, enhance our services through analytics, protect the platform from fraud or misuse, and comply with legal obligations or court orders. We obtain this information when you browse the site, create an account, post or respond to an advertisement, contact customer support, or undergo age-verification checks. If you provide information on behalf of someone else, you must ensure they have reviewed this Privacy Policy, agree to its terms, and that you inform us promptly of any changes to their data.
            </p>

            <p>
             To protect your information, we rely on multiple security measures such as encrypted systems, secure servers, and restricted access controls, ensuring that your data is shielded from unauthorized access. We retain your information only for the duration required for each purpose: account and browsing data may be stored for up to two years of inactivity; advertisement data for up to one year after expiration; verification records for up to one year after account deletion; and transaction records for at least ten years as required by law. Data used for marketing or analytics may be kept for up to two years unless you withdraw consent earlier, while information necessary for legal or compliance purposes may be retained as long as regulations demand.
            </p>
            <p>
              Your information may be accessed only by authorized employees or trusted third-party service providers who support us with essential tasks such as age verification and technical support. You may request a complete list of these external partners at any time. As a user, you have the right to access the information we hold about you, request corrections, withdraw consent, object to certain types of data processing, or file a complaint with our Grievance Officer. All such requests can be made free of charge.

            </p>

           

            <p className="mt-8 text-gray-600 italic">
              © 2025 Girls With Wine. All Rights Reserved.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default PrivacyPolicy;
