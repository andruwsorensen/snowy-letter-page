# Christmas Elf Jobs

A festive web application created for family Christmas celebrations, allowing members to send and share letters with each other. Experience the magic at [elf-jobs.vercel.app](https://elf-jobs.vercel.app/).

## What is Snowy Letter Page?

**Snowy Letter Page** (Christmas Elf Jobs) is a digital holiday letter-sharing app designed especially for family gatherings. The site lets users write, send, and read heartfelt letters in a cozy snowy interface, reminiscent of vintage paper and classic Christmas traditions. Interactions are enhanced with snowfall animations to evoke the magic of the season.

## What does the project do?

- Allows family members to create and share Christmas letters with each other.
- Provides an interface to browse, preview, and open received letters.
- Supports secure admin-only deletion of letters.
- Brings holiday spirit with a decorated UI, including falling snow and vintage-themed backgrounds.
- Offers music player features for additional festivity.

## Technologies Used

This project is built using modern web development tools and frameworks:

- **Next.js**: Framework for React applications, powering server-side rendering and routing.
- **React**: Frontend library for composing UI components.
- **TypeScript**: Strongly typed language for reliable and structured code.
- **Vercel**: Hosting and deployment platform, supports serverless functions and fast global delivery.
- **@vercel/blob**: Vercel's serverless blob storage API for storing and managing letter data.
- **Tailwind CSS (likely via globals.css)**: For styling and layout with utility classes.
- **Custom Components**: 
  - `Snowfall` – creates animated falling snow on the background.
  - `MusicPlayer` – adds ambient festive music.
  - `Letter` – handles letter creation, display, and interactions.
- **Authentication and Authorization**: Admin access protected with a secret key (`SANTA_KEY`) for operations like letter deletion.
- **Environment Variables**:  
  - `SANTA_KEY`: Administrative secret required for sensitive operations.

## Getting Started

### Environment Variables

The application requires the following environment variable:

- `SANTA_KEY`: A secret key for administrative access (required for deleting letters)

### Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file and add your `SANTA_KEY`
4. Run the development server:
   ```bash
   npm run dev
   ```

### Deployment

The application is deployed on Vercel. Make sure to set up the required environment variables in your Vercel project settings.

## Additional Features

- Animations and interactive behaviors for a fun user experience.
- Responsive grid for letter cards.
- Custom aesthetic: vintage paper texture overlay, holiday-themed design, and color palette.
- Secure letter sharing and management.

---
Feel free to contribute or use the app to bring your family's Christmas spirit online!
