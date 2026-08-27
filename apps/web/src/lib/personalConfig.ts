import personalData from '@/config/personal.json'

export interface PersonalConfig {
  name: string
  tagline: string
  metaDescription: string
  email: string
  website: string
  domain: string
  oldBlog?: string
  wolvenTechUrl: string
  ethAddress?: string
  socialLinks: {
    github: string
    githubWolvenTech?: string
    linkedin: string
    twitter: string
  }
  contact: {
    email: string
    emailFrom: string
    location: string
    timezone: string
  }
  professional: {
    title: string
    currentRole: string
    currentCompany: string
    yearsExperience: string
    specialties: string[]
  }
  achievements: {
    productivityIncrease: string
    costReduction: string
    teamSize: string
    description: string
  }
  education: {
    degree: string
    institution: string
    years: string
    certifications: string[]
  }
}

export function getPersonalConfig(): PersonalConfig {
  return personalData as PersonalConfig
}

// Convenience exports
export const config = getPersonalConfig()
export const { name, email, socialLinks, contact, professional, achievements, education } = config
