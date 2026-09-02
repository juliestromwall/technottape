'use client';

import { useState } from 'react';
import { Arrow } from './Icons';
import { site } from '../site';

const initial = {
  name: '',
  business: '',
  email: '',
  phone: '',
  service: '',
  message: '',
};

export default function ContactForm() {
  const [values, setValues] = useState(initial);
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const update = (e) =>
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  // No Formspree ID configured yet, so fall back to opening a pre-filled email
  // rather than silently swallowing the enquiry.
  const sendByMail = () => {
    const body = [
      `Name: ${values.name}`,
      `Business: ${values.business}`,
      `Email: ${values.email}`,
      `Phone: ${values.phone}`,
      `Interested in: ${values.service}`,
      '',
      values.message,
    ].join('\n');

    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
      `Project enquiry — ${values.name || 'website'}`
    )}&body=${encodeURIComponent(body)}`;

    setStatus({
      state: 'ok',
      message:
        'Your email app should have opened with this message ready to send. If it did not, email ' +
        site.email +
        ' directly.',
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Honeypot — real people leave this empty.
    if (e.target.company_website?.value) return;

    if (!site.formspreeId) {
      sendByMail();
      return;
    }

    setStatus({ state: 'sending', message: '' });

    try {
      const res = await fetch(`https://formspree.io/f/${site.formspreeId}`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error('Request failed');

      setValues(initial);
      setStatus({
        state: 'ok',
        message: "Thanks — that came through. I'll get back to you within one business day.",
      });
    } catch {
      setStatus({
        state: 'err',
        message: `That didn't send. Email ${site.email} or call ${site.phone} and I'll pick it up from there.`,
      });
    }
  };

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="field--half-row">
        <div className="field">
          <label htmlFor="name">Your name</label>
          <input id="name" name="name" value={values.name} onChange={update} required />
        </div>
        <div className="field">
          <label htmlFor="business">Business name</label>
          <input id="business" name="business" value={values.business} onChange={update} />
        </div>
      </div>

      <div className="field--half-row">
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={update}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="phone">Phone</label>
          <input id="phone" name="phone" type="tel" value={values.phone} onChange={update} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="service">What do you need?</label>
        <select id="service" name="service" value={values.service} onChange={update}>
          <option value="">Pick the closest thing</option>
          <option>A new website</option>
          <option>Fixing or replacing an existing site</option>
          <option>A web app or customer portal</option>
          <option>An internal tool to replace a spreadsheet</option>
          <option>Hosting, domain, or email help</option>
          <option>Ongoing support for something I already have</option>
          <option>Not sure yet</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="message">What&rsquo;s the situation?</label>
        <textarea
          id="message"
          name="message"
          value={values.message}
          onChange={update}
          placeholder="What your business does, what is not working, and what you would like it to do instead."
          required
        />
      </div>

      {/* honeypot */}
      <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
        <label htmlFor="company_website">Leave this empty</label>
        <input id="company_website" name="company_website" tabIndex={-1} autoComplete="off" />
      </div>

      <button className="btn btn--primary" type="submit" disabled={status.state === 'sending'}>
        {status.state === 'sending' ? 'Sending…' : 'Send it'} <Arrow />
      </button>

      {status.message ? (
        <div
          className={`form__status form__status--${status.state === 'err' ? 'err' : 'ok'}`}
          role="status"
        >
          {status.message}
        </div>
      ) : null}

      <p className="form__note">
        I read every one of these myself and reply within one business day. No
        mailing list, no follow-up sequence.
      </p>
    </form>
  );
}
