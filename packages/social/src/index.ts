/**
 * @decebal/social
 * Social media automation for LinkedIn and Twitter
 */

// LinkedIn
export {
  postToLinkedIn,
  generateLinkedInPost,
  refreshLinkedInToken,
} from './linkedin'

// Twitter
export {
  postToTwitter,
  generateTwitterThread,
  generateSingleTweet,
  scheduleTweet,
} from './twitter'

// OG Images
export {
  generateOGImageHTML,
  generateOGImageUrl,
  generateAIImagePrompt,
} from './og-image'

// Types
export interface SocialPost {
  title: string
  excerpt: string
  url: string
  tags?: string[]
  imageUrl?: string
  date?: string
}

export interface SocialPostResult {
  linkedin?: {
    success: boolean
    postUrl?: string
    error?: string
  }
  twitter?: {
    success: boolean
    tweetUrl?: string
    threadIds?: string[]
    error?: string
  }
}

/**
 * Post to all social media platforms at once
 */
export async function postToAllPlatforms(post: SocialPost): Promise<SocialPostResult> {
  const { postToLinkedIn, generateLinkedInPost } = await import('./linkedin')
  const { postToTwitter, generateTwitterThread } = await import('./twitter')

  const results: SocialPostResult = {}

  // Post to LinkedIn
  try {
    const linkedInText = generateLinkedInPost(post)
    const linkedInResult = await postToLinkedIn({
      text: linkedInText,
      link: post.url,
      linkTitle: post.title,
      linkDescription: post.excerpt,
      imageUrl: post.imageUrl,
    })
    results.linkedin = linkedInResult
  } catch (error) {
    results.linkedin = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }

  // Post to Twitter (as thread)
  try {
    const twitterThread = generateTwitterThread(post)
    const twitterResult = await postToTwitter({
      text: twitterThread[0],
      threadParts: twitterThread,
      imageUrl: post.imageUrl,
    })
    results.twitter = twitterResult
  } catch (error) {
    results.twitter = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }

  return results
}
