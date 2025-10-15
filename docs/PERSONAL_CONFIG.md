# Personal Configuration Guide

All personal information (name, email, social links, professional details, etc.) is centralized in a single JSON configuration file for easy management.

## Configuration File Location

**`src/config/personal.json`**

This file contains all your personal and professional information used throughout the website.

## Configuration Structure

```json
{
  "name": "Your Full Name",
  "tagline": "Your professional tagline/headline",
  "email": "your@email.com",
  "website": "https://yourwebsite.com",
  "domain": "yourwebsite.com",
  "socialLinks": {
    "github": "https://github.com/yourusername",
    "linkedin": "https://www.linkedin.com/in/yourusername/",
    "twitter": "https://twitter.com/yourusername"
  },
  "contact": {
    "email": "your@email.com",
    "emailFrom": "noreply@yourwebsite.com",
    "location": "Your Location / Remote",
    "timezone": "Your/Timezone"
  },
  "professional": {
    "title": "Your Professional Title",
    "currentRole": "Your Current Role",
    "currentCompany": "Current Company Name",
    "yearsExperience": "X+",
    "specialties": [
      "Specialty 1",
      "Specialty 2",
      "Specialty 3"
    ]
  },
  "achievements": {
    "productivityIncrease": "X%",
    "costReduction": "Y%",
    "teamSize": "Z+",
    "description": "Brief description of your key achievements"
  },
  "education": {
    "degree": "Your Degree",
    "institution": "University/Institution Name",
    "years": "YYYY-YYYY",
    "certifications": [
      "Certification 1",
      "Certification 2",
      "Certification 3"
    ]
  }
}
```

## How to Update Personal Information

### 1. **Edit the JSON File**

Simply open `src/config/personal.json` and update the values:

```bash
# Open in your editor
code src/config/personal.json

# Or edit manually
nano src/config/personal.json
```

### 2. **Changes Automatically Apply**

The configuration is imported throughout the website. When you update the JSON file:

- **Name**: Updates in header, footer, about page, metadata
- **Email**: Updates all contact links and forms
- **Social Links**: Updates footer and about page icons
- **Professional Info**: Updates hero section, about page, experience timeline
- **Achievements**: Updates statistics and highlights
- **Education**: Updates about page education section

### 3. **Where the Config is Used**

The configuration is imported via:

```typescript
import { config } from '@/lib/personalConfig'
```

**Components using the config:**
- `src/app/layout.tsx` - Page metadata and SEO
- `src/components/Footer.tsx` - Footer information and social links
- `src/components/HeroSection.tsx` - Hero headline and tagline
- `src/components/AboutSection.tsx` - About cards on homepage
- `src/app/about/page.tsx` - Full about page with timeline

## Usage Examples

### In a Component

```typescript
import { config } from '@/lib/personalConfig'

export default function MyComponent() {
  return (
    <div>
      <h1>{config.name}</h1>
      <p>{config.tagline}</p>
      <a href={`mailto:${config.contact.email}`}>Contact Me</a>
    </div>
  )
}
```

### Accessing Nested Properties

```typescript
// Social links
config.socialLinks.github
config.socialLinks.linkedin
config.socialLinks.twitter

// Professional details
config.professional.title
config.professional.currentCompany
config.professional.yearsExperience

// Education
config.education.degree
config.education.institution
config.education.certifications // Array
```

## TypeScript Support

The configuration is fully typed with TypeScript. Import the type:

```typescript
import type { PersonalConfig } from '@/lib/personalConfig'
```

This provides autocomplete and type safety when using the config.

## Environment Variables

Some dynamic values still use environment variables (see `.env.example`):

- **NEXT_PUBLIC_APP_URL**: Overrides `config.website` if set
- **EMAIL_FROM**: Email service sender address
- **CALENDAR_OWNER_EMAIL**: Google Calendar integration

These are separate because they may differ between environments (dev/staging/production).

## Best Practices

1. **Keep it Simple**: Only change values, not structure
2. **Validate JSON**: Ensure valid JSON format (use a validator)
3. **Test Changes**: Run `task dev` and check pages after updating
4. **Commit Changes**: Version control your config updates
5. **Backup**: Keep a backup before major changes

## Troubleshooting

### Changes Not Appearing?

1. **Restart dev server**: `task dev` (may need restart for JSON changes)
2. **Clear cache**: `rm -rf .next` then `task dev`
3. **Check JSON syntax**: Ensure valid JSON (no trailing commas)

### TypeScript Errors?

Make sure your changes match the `PersonalConfig` interface in `src/lib/personalConfig.ts`.

### Missing Social Link?

Instagram was removed. If you need to add a new social platform:

1. Add URL to `socialLinks` in `personal.json`
2. Update `PersonalConfig` interface in `src/lib/personalConfig.ts`
3. Add icon/link in `Footer.tsx` and `About` page

## Migration Notes

Before this centralized config, personal information was scattered across:
- 12+ component files
- Email templates
- Metadata files
- Environment variables

Now, **all personal data is in one place**: `src/config/personal.json`

This makes updates easier and reduces the risk of inconsistent information across the site.
