import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaPaperPlane } from 'react-icons/fa';
import { submitContactAPI } from '../services/api';

export default function ContactUsPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitContactAPI(formData);
      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all";
  const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Get in Touch</h1>
          <p className="text-gray-500 mt-2 text-sm">We'd love to hear from you. Send us a message and we'll respond shortly.</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden md:flex">

          {/* Left Panel */}
          <div className="md:w-[38%] bg-[#0a0f1e] p-8 md:p-10 text-white relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600 rounded-full opacity-[0.07] blur-3xl -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500 rounded-full opacity-[0.07] blur-3xl -ml-10 -mb-10" />

            <div className="relative">
              <h2 className="text-xl font-black mb-2">Contact Information</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">Our team is ready to help with any questions or feedback.</p>

              <div className="space-y-6">
                {[
                  { icon: <FaMapMarkerAlt size={14} />, label: 'Address', value: '123, ShopHub Street, Karachi, Pakistan' },
                  { icon: <FaPhoneAlt size={13} />, label: 'Phone', value: '+92 (300) 123-4567' },
                  { icon: <FaEnvelope size={13} />, label: 'Email', value: 'contact@shophub.com' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-9 h-9 bg-white/[.06] border border-white/[.08] rounded-xl flex items-center justify-center text-blue-400 flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">{item.label}</p>
                      <p className="text-sm font-medium text-white/90">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="relative text-[10px] text-gray-600 font-medium mt-10 uppercase tracking-widest">
              © 2026 ShopHub. All rights reserved.
            </p>
          </div>

          {/* Right Form */}
          <div className="md:w-[62%] p-8 md:p-10">
            <h2 className="text-xl font-black text-gray-900 mb-1">Send a Message</h2>
            <p className="text-sm text-gray-500 mb-6">Fill out the form and we'll get back to you within 24 hours.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required
                    placeholder="John Doe" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required
                    placeholder="you@email.com" className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Subject</label>
                <input type="text" name="subject" value={formData.subject} onChange={handleChange} required
                  placeholder="How can we help?" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Message</label>
                <textarea name="message" rows={5} value={formData.message} onChange={handleChange} required
                  placeholder="Write your message here..." className={`${inputClass} resize-none`} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[.98] shadow-lg shadow-blue-500/20 disabled:opacity-60">
                {loading
                  ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><FaPaperPlane size={12} /> Send Message</>
                }
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}