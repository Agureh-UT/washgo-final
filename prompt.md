I need you to generate a complete set of responsive HTML page templates for **Crystal Crown**, a mobile car detailing and house cleaning service company. The UI/UX, styling, pages, and components should be based on [shineandgo.org](https://shineandgo.org) **but change the theme color from black to a light blue palette**. Add any additional pages or components necessary for a modern ecommerce website for this type of business. Use the attached **logo.png**, **video.mp4**, **detail.mp4**, and **Other details.pdf** for content and assets.

All styling must be in a single external `globals.css` file – **no inline or internal CSS**. All JavaScript must be in a single external `globals.js` file, written in modern ES6+ syntax.

---

## **File Structure**
Create the following files:
- `globals.css`
- `globals.js`
- `index.html` (home page)
- `services.html` (services listing)
- `about.html` (about us)
- `contact.html` (contact page)
- `booking.html` (booking / appointment page)
- (Optional) `thank-you.html` (post‑booking confirmation)

---

## **Design & Styling Specifications**
- **Color Theme:** Light blue. Define CSS variables in `globals.css` for primary, secondary, accent, background, text, etc. (e.g., `--primary-light: #e6f7ff;`, `--primary-blue: #6ec8e0;`, `--dark-text: #333;`).
- **CSS Variables:** Use them for colors, fonts, spacing, border radii, box shadows, and breakpoints.
- **Units:** Prefer relative units (`rem`, `em`, `%`, `vh`, `vw`, `ch`) over `px` for scalability and responsiveness.
- **Layouts:** Use **CSS Grid** and **Flexbox** exclusively – no floats.
- **Responsive:** Mobile‑first approach with media queries. Ensure fonts, spacing, and components adapt seamlessly to all screen sizes (mobile, tablet, desktop). Use fluid typography techniques if appropriate.

---

## **Page & Component Requirements**

### **Header (reusable on all pages)**
- Logo on the left: `<img src="logo.png" alt="Crystal Crown Logo">`
- Navigation links: Home, Services, About, Contact, Book Now.
- “Book Now” button (styled as a CTA).
- Mobile hamburger menu (toggle functionality via `globals.js`).

### **Footer (reusable on all pages)**
- Business name, address, phone, email.
- Social media icons (Text-based icons/emojis such as 🔔, ✅, 🛒 and other relevant/contextual text-based icons/emojis,Font Awesome or or similar, linked in `<head>`).
- Copyright notice.

### **Home Page (`index.html`)**
- **Hero Section:** Full‑width background video (`video.mp4`) with overlay text.
  - Video attributes: `autoplay`, `muted`, `loop`, `playsinline`.
  - Overlay headline: “Crystal Crown – Premium Mobile Detailing & House Cleaning”
  - Subheadline: “Professional care for your car and home, at your doorstep.”
  - CTA button: “Book Now” (links to `booking.html`).
- **Services Overview:** Grid of 3–4 service cards (car detailing, house cleaning, packages) with icons, short descriptions, and a “Learn More” link. Use content from `Other details.pdf`.
- **About Snippet:** Short intro about the company, with a link to `about.html`.
- **Testimonials Section:** 2–3 customer testimonials (create realistic placeholder quotes).
- **Call to Action:** Banner with text “Ready to shine?” and a button to book.

### **Services Page (`services.html`)**
- **Hero Section:** Background video `detail.mp4` with overlay: “Our Services” and a brief tagline.
- **Service Listings:** Detailed grid of all services (car detailing, house cleaning, add‑ons, packages). Each card includes:
  - Service name, description, price (or “starting at”), and a “Book Now” button.
  - Pull service descriptions from `Other details.pdf`.
- Possibly include a **pricing table** or **accordion** for package details (use JS if needed).

### **About Page (`about.html`)**
- Company story, mission, and values (use content from `Other details.pdf`).
- Optional team member cards (if mentioned in PDF) or placeholder images.
- Include a small video or image collage.

### **Contact Page (`contact.html`)**
- Contact form: name, email, phone, message, submit button.
- Map placeholder (static image or embed iframe).
- Contact details: address, phone, email, business hours.

### **Booking Page (`booking.html`)**
- **Booking form** with fields:
  - Service type (dropdown from services)
  - Date picker
  - Time slot (dropdown or text input)
  - Customer name, email, phone, address
  - Special instructions (textarea)
  - “Submit Booking” button
- Form validation in `globals.js` (client‑side, basic checks).
- After submission, redirect to `thank-you.html` (static confirmation page).

### **Thank‑You Page (`thank-you.html`)**
- Simple message: “Thank you for your booking! We’ll confirm shortly.”
- Link back to home.

---

## **JavaScript (`globals.js`)**
- **ES6+ syntax:** `let`/`const`, arrow functions, template literals, etc.
- **Mobile menu toggle:** Add event listener to hamburger icon, toggle class on nav.
- **Form validation:** For booking and contact forms (prevent submission on errors, highlight fields).
- **Smooth scrolling** for anchor links (optional).
- Keep code well‑commented and modular.

---

## **Assets & Content**
- **Logo:** Use `logo.png` in the header.
- **Videos:** 
  - `index.html` hero → `video.mp4`
  - `services.html` hero → `detail.mp4`
  - Assume videos are in the same directory as HTML files.
- **Text Content:** Refer to the attached **`Other details.pdf`** for accurate service descriptions, company info, taglines, and any other copy. Where the PDF lacks detail, use sensible, industry‑appropriate placeholder text.

---

## **Additional Requirements**
- All HTML files must be valid HTML5, semantic (e.g., `<header>`, `<main>`, `<section>`, `<footer>`).
- Include appropriate `meta` tags for viewport, description, and charset.
- Use Text-based icons/emojis such as 🔔, ✅, 🛒 and other relevant/contextual text-based icons/emojis for icons. Try as much as possible not to depend on fontawesome or any other external libraries for icons.
- Ensure accessibility: `alt` attributes on images, proper heading hierarchy, `aria` labels where helpful.
- No inline styles or `<style>` blocks – everything in `globals.css`.
- No JavaScript inside HTML – all JS in `globals.js`.

---

## **Deliverables**
Please provide the complete code for each file in separate, clearly labeled code blocks. For example:

```html
<!-- index.html -->
...
```

```css
/* globals.css */
...
```

```javascript
// globals.js
...
```

Make sure all pages link correctly to the CSS and JS files.

---

**Think deeply** about the user experience: the site should feel modern, trustworthy, and easy to navigate. The light blue theme should convey cleanliness and reliability. Use the reference site’s layout and component structure as a starting point, but improve and expand where necessary. Incorporate ecommerce elements like service packages and a booking flow to make it functional for a real business.