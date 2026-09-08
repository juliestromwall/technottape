# Getting testimonials up

The section is built. `app/components/Testimonials.jsx` renders on `/work/`
and shows nothing while `app/testimonials.js` is empty, so the page is
complete and simply has no quotes block yet. Add real ones and it appears.

## Why there are no placeholder quotes

The site is live. Anything in that file is read by real prospects as a genuine
endorsement, and invented ones are deceptive — the FTC treats fabricated
endorsements as false advertising, and a prospect who spots one stops
believing the rest of the page too. Empty is better than fake.

## The fastest way to real ones

Most people say yes and most never get asked. Send this to three or four past
clients today — text or email, whichever you normally use:

> Hi [name] — I've just launched a proper site for my business
> (technottape.com) and I'm putting a few client comments on it.
>
> Would you mind a sentence or two about working with me? Something like what
> the problem was before and what changed is perfect — it doesn't need to be
> polished.
>
> Happy to write a draft you can edit or veto if that's easier. And let me
> know how you'd like to be credited — first name only, or name and business.
>
> No worries at all if you'd rather not.
> Julie

**Offering to draft it roughly doubles the reply rate.** People want to help
but stall on the writing. Sending them something to correct is not the same
as inventing one — they read it, change it, and approve it in their own name.

## What makes a good one

Specifics beat praise every time.

- Weak: "Julie was great to work with, highly recommend."
- Strong: "We were quoting jobs by hand on an evening. Now it takes ten
  minutes and we've stopped losing work to whoever replied first."

Ask what it was like *before*. That answer is the testimonial.

## Adding them

```js
// app/testimonials.js
export const testimonials = [
  {
    quote: 'What they actually said.',
    name: 'Sarah M.',
    role: 'Owner, a landscaping business',
    accent: 'var(--ochre)',       // sage | ochre | terracotta
  },
];
```

Client names and businesses only with their permission — the Work page
deliberately keeps clients anonymous, so a first name and a description of
the business is a reasonable default.
