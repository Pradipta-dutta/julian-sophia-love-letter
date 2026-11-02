# Julian Sophia Love Letter

## APPLICATION OVERVIEW
Create a romantic, elegant, and modern single-page wedding invitation website featuring a hero section, love story timeline, event details, and an interactive RSVP form. The site must be completely mobile-responsive and include smooth scroll animations.

## DESIGN & AESTHETIC
- **Color Palette:** Soft warm tones (Cream background, blush/dusty rose accents, and deep burgundy or sage green text).
- **Typography:** Elegant, premium serif headers paired with clean, readable sans-serif body text.
- **Vibe:** Minimalist, intimate, and modern luxury.

## CORE SECTIONS & FEATURES
1. **Hero Section:**
   - Display placeholder couple names: "Julian & Sophia".
   - Include the wedding date and location prominently.
   - Feature a beautiful countdown timer counting down to the big day.
   - Include a smooth-scrolling "RSVP Now" Call-to-Action button.

2. **Our Story:**
   - A minimalist grid or timeline layout highlighting 3–4 milestones with image placeholders and short text snippets.

3. **Event Details:**
   - Display a beautifully styled grid or cards showing details for three main events: Ceremony, Cocktail Hour, and Reception. Include placeholder fields for times, locations, and dress codes.
   - Include a placeholder button to "View Map".

4. **Interactive RSVP Form (Google Sheets Ready):**
   - Design a highly polished form container with the following input fields:
     - Full Name (Text input, Required)
     - Email Address (Email input, Required with format validation)
     - Attendance Status (Radio buttons: "Accepts with Joy" or "Declines with Regret")
     - Total Guests in Party (Dropdown or number picker)
     - Full Names of Plus-Ones/Party Members (Text area, conditionally visible only if Guest Count > 1)
     - Dietary Requirements (Checkboxes: Vegetarian, Vegan, Gluten-Free, None, Other text field)
     - Song Request (Short text input)
   - **Form State Management:** 
     - Implement conditional branching (e.g., if a guest selects "Declines with Regret", hide the plus-one, dietary, and song fields, and dynamically change the submit button text to "Send Blessings").
     - Show a beautiful, animated "Thank you! Your response has been saved" confirmation overlay upon submission.
   - **Data Integration Prep:**
     - Structure the form submission function explicitly so that the form data payload is collected into a clean JSON object. 
     - Leave a clearly commented `handleSubmit` placeholder function in the code where a fetch/POST request can easily be pointed to a Google App Script URL or Make/Zapier webhook to dump the data directly into a Google Sheet.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3b7cab70-5a0b-4236-93aa-4207200dc2a6).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
