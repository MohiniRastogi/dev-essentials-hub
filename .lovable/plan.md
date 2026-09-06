# Plan: Add "AI Intern" Certification Badge

## Goal
Append an "AI Intern" certification badge to the existing Certifications section on the `/about` page, matching the existing pill-style badges exactly.

## Current State
The Certifications section in `src/routes/about.tsx` renders three badges from a hardcoded array:
- Introduction to AI
- Introduction to Generative AI
- AI and Generative AI for Video Content Creation

## Change
Update the array in `src/routes/about.tsx` to include a fourth item, `"AI Intern"`, immediately after the last existing item. The existing `Badge` component styling (`variant="secondary"`, `rounded-full`, `px-3`, `py-1`, `text-xs`) will be reused automatically since the array is mapped through the same renderer.

## Files to Modify
- `src/routes/about.tsx`

## Verification
- Preview the `/about` page.
- Confirm the Certifications section now shows four badges: the original three plus "AI Intern" at the end.
- Confirm the new badge matches the existing visual style (light blue/pill shape, font, spacing).
