import React from 'react';

const GirlsWithWineLanding = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white font-sans antialiased">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-8 px-4 text-center shadow-2xl">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
            Escort Services | Girls With Wine
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            100% Verified Profiles * 24/7 Support * Confidential Bookings
          </p>
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search profiles..."
              className="w-full max-w-md px-6 py-4 rounded-full text-lg shadow-xl border-none focus:outline-none focus:ring-4 focus:ring-white/50 mx-auto block mb-6"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#"
              className="bg-white text-orange-600 px-10 py-4 rounded-full text-xl font-semibold shadow-2xl hover:scale-105 hover:shadow-3xl transition-all duration-300"
            >
              View Profiles
            </a>
            <a
              href="#"
              className="border-2 border-white text-white px-10 py-4 rounded-full text-xl font-semibold hover:bg-white hover:text-orange-600 transition-all duration-300"
            >
              Call Now
            </a>
          </div>
        </div>
      </header>

      {/* Premium Services */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-orange-600 mb-12">
            Premium Escort Services at ₹2999
          </h2>
          <p className="text-xl text-gray-700 text-center max-w-4xl mx-auto mb-12 leading-relaxed">
            Girls With Wine offers professional services with verified independent escorts suitable for private meetings, events, or travel companionship. 
            The escorts are well-groomed and trained to fit perfectly in an elite environment.
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-5xl mx-auto">
            {[
              'VIP Escort Services',
              'Independent Escort Services',
              'Couple-friendly Adult Meetings',
              'Sexy Call Girl Service',
              'Hotel Escort Services'
            ].map((service, idx) => (
              <li key={idx} className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-orange-100">
                <div className="text-2xl font-bold text-orange-600 mb-2">{service}</div>
              </li>
            ))}
          </ul>
        </div>
      </section>

    

      {/* Why Choose Us */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#00B9BE] mb-12">
            Why Girls With Wine is a Trusted Choice?
          </h2>
          <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
            <p>Confused about an agency to book escorts from? Girls With Wine has been serving more than a thousand clients for the past few years.</p>
            <p>Every profile comprises genuine details with accurate charges. We assure confidentiality using a secure communication channel.</p>
            <p>We request mutual consent from clients before confirming an independent escort service to avoid any legal discrepancies.</p>
          </div>
        </div>
      </section>

      {/* 24/7 Services */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-orange-600 mb-12">
            24/7 Escort Services in (city/state)
          </h2>
          <p className="text-xl text-gray-700 text-center max-w-3xl mx-auto mb-16 leading-relaxed">
            Our platform lists profiles suitable for travelers, professionals, or local resident whether it is a day or late at night.
          </p>
          <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-12">
            Simple Booking Steps
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              'Browse Profiles',
              'Choose a Companion',
              'Contact Team',
              'Confirm Time & Location',
              'Make a Payment'
            ].map((step, idx) => (
              <div key={idx} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-center group hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">
                  {idx + 1}
                </div>
                <div className="font-semibold text-gray-800 text-lg">{step}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-orange-600 mb-12">
            Pricing Transparency
          </h2>
          <p className="text-xl text-gray-700 text-center max-w-3xl mx-auto mb-16 leading-relaxed">
            Afraid to pay hidden charges? Girls With Wine uses a transparent payment process, ensuring a clear confirmation before booking.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
              <thead>
                <tr className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
                  <th className="px-8 py-6 text-xl font-bold">Duration</th>
                  <th className="px-8 py-6 text-xl font-bold">Regular Escorts</th>
                  <th className="px-8 py-6 text-xl font-bold">Independent Escorts</th>
                  <th className="px-8 py-6 text-xl font-bold">VIP Escorts</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { duration: '1 Hour', regular: '₹2999', independent: '₹3999', vip: '₹5999' },
                  { duration: '2 Hours', regular: '₹4999', independent: '₹6999', vip: '₹9999' },
                  { duration: 'Full Night', regular: '₹9999', independent: '₹14999', vip: '₹19999' },
                  { duration: 'Customized Hours', regular: 'Contact Us', independent: 'Contact Us', vip: 'Contact Us' }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-orange-50 transition-colors duration-200 border-b border-gray-100">
                    <td className="px-8 py-6 font-semibold text-gray-800">{row.duration}</td>
                    <td className="px-8 py-6 font-bold text-2xl text-green-600">{row.regular}</td>
                    <td className="px-8 py-6 font-bold text-2xl text-blue-600">{row.independent}</td>
                    <td className="px-8 py-6 font-bold text-2xl text-purple-600">{row.vip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Safety */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#00B9BE] mb-12">
            Safety and Privacy
          </h2>
          <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
            <p>Girls With Wine follows privacy standards to ensure a safe and respectful experience.</p>
            <p>Unnecessary details will not be asked by the support team. Clients have the freedom to choose profiles carefully.</p>
            <p>They can use UPI, Cash, or any other suitable payment method.</p>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-orange-600 mb-16">
            FAQs – Girls With Wine Escort Services
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'How Do I Book Escort Services Quickly?',
                a: 'Clients can contact our support team directly to book a service instantly.'
              },
              {
                q: 'Are My Details Confidential?',
                a: 'Absolutely. Girls With Wine never exposes a client\'s information publicly. It is always kept private.'
              },
              {
                q: 'Are the Escort Profiles 100% Verified?',
                a: 'Yes, all the companions are listed after a verification process. Their photos and details are authentic.'
              },
              {
                q: 'Can I Make a Payment in Cash?',
                a: 'We offer flexible booking and payment options for clients that are safe to make.'
              },
              {
                q: 'Can Tourist Book an Escort Service?',
                a: 'Yes, bookings are available even late at night, early mornings, evening time, or any day.'
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
                <h4 className="text-2xl font-bold text-orange-600 mb-4">{faq.q}</h4>
                <p className="text-gray-700 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 bg-gradient-to-r from-orange-500 to-red-600 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 drop-shadow-lg">
            Ready to experience your deepest darkest desires?
          </h2>
          <p className="text-2xl mb-12 opacity-90">Contact our team now.</p>
          <a
            href="#"
            className="inline-block bg-white text-orange-600 px-12 py-6 rounded-full text-2xl font-bold shadow-2xl hover:scale-105 hover:shadow-3xl transition-all duration-300"
          >
            Contact Now
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <p className="text-lg">
            Disclaimer: Girls With Wine facilitates connections strictly for individuals who are above 18 years. 
            We never promote or get involved in illegal activities. Coupling is based on mutual consent.
          </p>
          <p>SEO: best escort agency, luxury escorts, call girls near me, independent escort services, VIP escort services</p>
        </div>
      </footer>
    </div>
  );
};

export default GirlsWithWineLanding;
