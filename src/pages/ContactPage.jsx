import React, { useState } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <section className="w-full max-w-[1380px] mx-auto px-6 sm:px-10 py-12 sm:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        <div className="max-w-xl pt-2">
          <p className="text-[#4DE2BD] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Contact us</p>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-5">Let’s talk about learning.</h1>
          <p className="text-[#A9C0C7] text-base sm:text-lg leading-relaxed">
            Have a question about LMS? Send us a message and our team will get back to you soon.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#0D2229]/95 border border-[#1D363E] rounded-2xl p-6 sm:p-8 shadow-lg space-y-5">
          {submitted && (
            <div className="bg-[#14323A] border border-[#4DE2BD]/40 text-[#B9F6E4] text-sm rounded-xl px-4 py-3">
              Thanks for reaching out. Your message has been received.
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-xs font-semibold text-white mb-2">Name</label>
            <input id="name" type="text" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full bg-[#091B21] border border-[#1D363E] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#4DE2BD] transition-colors" />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-white mb-2">Email</label>
            <input id="email" type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="w-full bg-[#091B21] border border-[#1D363E] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#4DE2BD] transition-colors" />
          </div>

          <div>
            <label htmlFor="message" className="block text-xs font-semibold text-white mb-2">Message</label>
            <textarea id="message" required rows="5" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} className="w-full resize-none bg-[#091B21] border border-[#1D363E] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#4DE2BD] transition-colors" />
          </div>

          <button type="submit" className="bg-[#4DE2BD] hover:bg-[#41D1AC] text-[#07181E] font-bold text-sm px-7 py-3 rounded-full transition-all duration-200">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
