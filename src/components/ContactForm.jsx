import { useState } from 'react';
import { site } from '../config/site';

/**
 * Lightweight contact form.
 * Without a mail service configured it opens the customer's mail
 * app (mailto) — or WhatsApp when a number is configured. This
 * keeps the first version genuinely functional without a server.
 */
export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | ready | error

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, subject, message } = form;
    const hasWhatsApp = Boolean(site.contact.whatsapp);

    if (name.trim() && message.trim()) {
      const text = encodeURIComponent(
        `Hello Priscilla,\n\n${message}\n\n— ${name}${email ? `\n${email}` : ''}`
      );
      if (hasWhatsApp) {
        window.open(
          `https://wa.me/${site.contact.whatsapp}?text=${text}`,
          '_blank',
          'noopener,noreferrer'
        );
        setStatus('ready');
      } else if (site.contact.email) {
        window.location.href = `mailto:${site.contact.email}?subject=${encodeURIComponent(
          subject || `Message from ${name}`
        )}&body=${text}`;
        setStatus('idle');
      } else {
        setStatus('error');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {status === 'error' && (
        <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Thanks for reaching out. Contact details are not configured yet —
          check back soon, or connect via the links below.
        </p>
      )}
      {status === 'ready' && (
        <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">
          Opening WhatsApp — press send to deliver your message.
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-chocolate-700">
            Name
          </label>
          <input id="cf-name" required value={form.name} onChange={update('name')} className="input" placeholder="Your name" />
        </div>
        <div>
          <label htmlFor="cf-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-chocolate-700">
            Email
          </label>
          <input id="cf-email" type="email" value={form.email} onChange={update('email')} className="input" placeholder="you@example.com" />
        </div>
      </div>

      <div>
        <label htmlFor="cf-subject" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-chocolate-700">
          Subject
        </label>
        <input id="cf-subject" value={form.subject} onChange={update('subject')} className="input" placeholder="Wedding cake, catering, training…" />
      </div>

      <div>
        <label htmlFor="cf-message" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-chocolate-700">
          Message
        </label>
        <textarea id="cf-message" required rows={5} value={form.message} onChange={update('message')} className="input resize-y" placeholder="Tell Priscilla about your event or enquiry…" />
      </div>

      <button type="submit" className="btn-dark w-full sm:w-auto">
        Send Message
      </button>
    </form>
  );
}