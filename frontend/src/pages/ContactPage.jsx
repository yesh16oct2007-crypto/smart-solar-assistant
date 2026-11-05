import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  MessageSquare,
  Building,
  User,
  ShieldCheck,
  Clock,
  History
} from 'lucide-react';
import { submitContact, fetchContacts } from '../utils/api';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    inquiry_type: 'Residential Consultation',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [responseInfo, setResponseInfo] = useState(null);
  const [error, setError] = useState(null);
  
  // Stored inquiries history
  const [contactsList, setContactsList] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const loadContacts = async () => {
    try {
      const resp = await fetchContacts();
      if (resp.success && resp.data) {
        setContactsList(resp.data);
      }
    } catch (err) {}
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const validatePhone = (num) => {
    return /^[6-9]\d{9}$/.test(num.replace(/\D/g, ''));
  };

  const validateEmail = (mail) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResponseInfo(null);

    // Validation
    if (!formData.name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!validatePhone(formData.phone)) {
      setError('Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9).');
      return;
    }
    if (!formData.message.trim() || formData.message.length < 10) {
      setError('Please enter a message with at least 10 characters.');
      return;
    }

    setLoading(true);

    try {
      const resp = await submitContact(formData);
      if (resp.success) {
        setResponseInfo({
          ticket_id: resp.ticket_id,
          message: resp.message,
          timestamp: resp.timestamp
        });
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          organization: '',
          inquiry_type: 'Residential Consultation',
          message: ''
        });
        loadContacts();
      } else {
        setError('Submission failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Error reaching the contact server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Get in Touch & Connect
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900">
          Contact & Consultation
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Have questions regarding PM Surya Ghar subsidy registration, commercial rooftop audits, or our B.Tech Prompt Engineering architecture? Send us a validated message.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: CONTACT DETAILS & INFO (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-navy-900 pb-2 border-b border-slate-100">
              Project Lab & Coordination
            </h3>

            <div className="space-y-4 text-xs text-slate-600">
              <div className="flex items-start space-x-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-navy-900 block text-xs">Academic Affiliation</strong>
                  <span>Department of Computer Science & Engineering</span>
                  <span className="block text-slate-400">Prompt Engineering Laboratory, India</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-navy-900 block text-xs">Direct Support Email</strong>
                  <span>solar.support@smartenergy.org.in</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-navy-900 block text-xs">National Solar Helpline</strong>
                  <span>15555 (PM Surya Ghar Toll-Free)</span>
                </div>
              </div>
            </div>

            {/* Verification Guarantee */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
              <div className="flex items-center space-x-2 text-emerald-800 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Working SQLite Submission Service</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Every form submission is validated, timestamped, and stored directly into the backend SQLite database (<code className="text-slate-700">contacts</code> table) with an assigned ticket ID.
              </p>
            </div>

            {/* Toggle History Button */}
            <button
              type="button"
              onClick={() => setShowHistory(!showHistory)}
              className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center justify-center space-x-1.5"
            >
              <History className="w-4 h-4 text-slate-500" />
              <span>{showHistory ? 'Hide Submitted Inquiries' : `View Submitted Inquiries (${contactsList.length})`}</span>
            </button>

          </div>

          {/* SUBMITTED INQUIRIES LIST (IF TOGGLED) */}
          {showHistory && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 animate-fadeIn">
              <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider">
                Database Submission Log
              </h4>
              {contactsList.length === 0 ? (
                <p className="text-xs text-slate-400">No submissions found in database yet.</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {contactsList.map((c) => (
                    <div key={c.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-navy-900">{c.name}</span>
                        <span className="text-[10px] text-emerald-700 font-mono">ID #{c.id}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">{c.email} • {c.phone}</div>
                      <p className="text-[11px] text-slate-700 italic">"{c.message}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: CONTACT FORM (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-7 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          
          <h3 className="text-lg font-bold text-navy-900 pb-2 border-b border-slate-100 flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            <span>Send an Inquiry</span>
          </h3>

          {responseInfo && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-2 animate-fadeIn">
              <div className="flex items-center space-x-2 font-bold text-emerald-800">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>Message Received & Stored in Database!</span>
              </div>
              <p className="text-slate-700">
                {responseInfo.message}
              </p>
              <div className="inline-block px-3 py-1 rounded-lg bg-emerald-100 font-mono font-bold text-emerald-900 text-xs">
                Ticket Reference: {responseInfo.ticket_id}
              </div>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Yeshwanth Kumar"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number (India) *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="10-digit number e.g. 9876543210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Organization / College (Optional)
                </label>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  placeholder="e.g. Engineering College / Tech Park"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Inquiry Category *
              </label>
              <select
                value={formData.inquiry_type}
                onChange={(e) => setFormData({ ...formData, inquiry_type: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Residential Consultation">Residential Solar Sizing & PM Surya Ghar Subsidy</option>
                <option value="Commercial Energy Audit">Commercial / Office Tariff Mitigation</option>
                <option value="College Project Query">B.Tech Prompt Engineering Coursework Inquiry</option>
                <option value="Technical Feedback">Bug Report / Feature Request</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Message / Solar Requirements *
              </label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe your property, current monthly electricity bills, or questions regarding net-metering..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/20 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2 text-xs sm:text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Inquiry to Database...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Inquiry to Database</span>
                </>
              )}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}
