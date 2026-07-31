import React, { useState } from 'react';
import { Star, Send, CheckCircle2, AlertCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { GlassCard } from './GlassCard';

export interface ClientReviewItem {
  id: string;
  name: string;
  companyOrRole?: string;
  rating: number; // 1-5
  review: string;
  consentGiven: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const GOOGLE_REVIEW_URL = "https://g.page/r/CQmYzXtxKLqQEBM/review";

export const ClientReviewForm: React.FC<{
  onSubmitReview?: (review: Omit<ClientReviewItem, 'id' | 'createdAt' | 'status'>) => Promise<void> | void;
}> = ({ onSubmitReview }) => {
  const [name, setName] = useState('');
  const [companyOrRole, setCompanyOrRole] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [review, setReview] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Sanitize input to prevent HTML/Script injection
  const sanitize = (str: string) => str.replace(/</g, '&lt;').replace(/>/g, '&gt;').trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanName = sanitize(name);
    const cleanCompany = sanitize(companyOrRole);
    const cleanReview = sanitize(review);

    // Validation
    if (!cleanName) {
      setErrorMessage('Please enter your name.');
      return;
    }
    if (cleanName.length > 60) {
      setErrorMessage('Name must be 60 characters or less.');
      return;
    }
    if (rating < 1 || rating > 5) {
      setErrorMessage('Please select a rating between 1 and 5 stars.');
      return;
    }
    if (!cleanReview) {
      setErrorMessage('Please write a short review or testimonial.');
      return;
    }
    if (cleanReview.length > 1000) {
      setErrorMessage('Review text must be 1000 characters or less.');
      return;
    }
    if (!consentGiven) {
      setErrorMessage('Please confirm consent to publish your review on this website.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (onSubmitReview) {
        await onSubmitReview({
          name: cleanName,
          companyOrRole: cleanCompany || undefined,
          rating,
          review: cleanReview,
          consentGiven,
        });
      } else {
        // Mock submission latency
        await new Promise(res => setTimeout(res, 600));
      }

      setSubmitSuccess(true);
      setName('');
      setCompanyOrRole('');
      setRating(5);
      setReview('');
      setConsentGiven(false);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GlassCard style={{ padding: '32px 28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', margin: 0 }}>
            Submit a Client Review
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4, margin: 0 }}>
            Worked with Pratheesh? Submit your genuine experience for website display.
          </p>
        </div>

        {/* External Google Review Link */}
        <a
          href={GOOGLE_REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
          style={{
            fontSize: '0.8rem',
            padding: '8px 14px',
            textDecoration: 'none',
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--bg-tertiary)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          Review on Google <ExternalLink size={13} />
        </a>
      </div>

      {submitSuccess ? (
        <div style={{
          padding: '24px 20px',
          borderRadius: 12,
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          textAlign: 'center',
        }}>
          <CheckCircle2 size={32} color="var(--accent-mint)" style={{ marginBottom: 10 }} />
          <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
            Thank You for Your Feedback!
          </h4>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
            Your review has been received and submitted for moderation. Approved reviews will appear publicly on the website.
          </p>
          <button
            onClick={() => setSubmitSuccess(false)}
            className="btn-primary"
            style={{ marginTop: 16, fontSize: '0.82rem', padding: '8px 16px' }}
          >
            Submit Another Review
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {errorMessage && (
            <div style={{
              padding: '12px 16px',
              borderRadius: 8,
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Name & Role Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            <div>
              <label htmlFor="review-name" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
                Your Name <span style={{ color: 'var(--accent-primary)' }}>*</span>
              </label>
              <input
                id="review-name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                maxLength={60}
                placeholder="e.g. Mariya Pratheesh"
                required
                aria-required="true"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label htmlFor="review-company" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
                Company / Role <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>(Optional)</span>
              </label>
              <input
                id="review-company"
                type="text"
                value={companyOrRole}
                onChange={e => setCompanyOrRole(e.target.value)}
                maxLength={80}
                placeholder="e.g. Marketing Manager at JBHL"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Star Rating Picker */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
              Rating <span style={{ color: 'var(--accent-primary)' }}>*</span>
            </label>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }} role="radiogroup" aria-label="Star Rating">
              {[1, 2, 3, 4, 5].map(starIndex => {
                const isActive = starIndex <= (hoverRating || rating);
                return (
                  <button
                    key={starIndex}
                    type="button"
                    role="radio"
                    aria-checked={rating === starIndex}
                    aria-label={`${starIndex} Star${starIndex > 1 ? 's' : ''}`}
                    onClick={() => setRating(starIndex)}
                    onMouseEnter={() => setHoverRating(starIndex)}
                    onMouseLeave={() => setHoverRating(0)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 2,
                      cursor: 'pointer',
                      color: isActive ? '#f59e0b' : 'var(--text-tertiary)',
                      transition: 'transform 0.15s ease, color 0.15s ease',
                      transform: isActive ? 'scale(1.15)' : 'scale(1)',
                    }}
                  >
                    <Star size={24} fill={isActive ? '#f59e0b' : 'none'} />
                  </button>
                );
              })}
              <span style={{ marginLeft: 8, fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                {rating} / 5 Stars
              </span>
            </div>
          </div>

          {/* Review Textarea */}
          <div>
            <label htmlFor="review-text" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
              Your Review / Testimonial <span style={{ color: 'var(--accent-primary)' }}>*</span>
            </label>
            <textarea
              id="review-text"
              value={review}
              onChange={e => setReview(e.target.value)}
              rows={4}
              maxLength={1000}
              placeholder="Describe your working experience, project scope, and results..."
              required
              aria-required="true"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 8,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--bg-tertiary)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                outline: 'none',
                resize: 'vertical',
              }}
            />
            <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 4 }}>
              {review.length} / 1000 characters
            </div>
          </div>

          {/* Consent Checkbox */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <input
              id="review-consent"
              type="checkbox"
              checked={consentGiven}
              onChange={e => setConsentGiven(e.target.checked)}
              required
              aria-required="true"
              style={{ marginTop: 3, cursor: 'pointer' }}
            />
            <label htmlFor="review-consent" style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, cursor: 'pointer' }}>
              I confirm this review reflects my genuine experience and may be displayed on this website.
            </label>
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginTop: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
              <ShieldCheck size={14} color="var(--accent-mint)" />
              <span>Moderated submission · No spam</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{
                fontSize: '0.88rem',
                padding: '10px 20px',
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? 'wait' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
              <Send size={14} />
            </button>
          </div>
        </form>
      )}
    </GlassCard>
  );
};
