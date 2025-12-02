/**
 * Twitter/X integration for automated posting
 * Uses Twitter API v2
 */

import { TwitterApi } from 'twitter-api-v2'

interface TwitterPost {
  text: string
  imageUrl?: string
  threadParts?: string[]
}

interface TwitterPostResult {
  success: boolean
  tweetId?: string
  tweetUrl?: string
  threadIds?: string[]
  error?: string
}

/**
 * Post a tweet or thread to Twitter
 */
export async function postToTwitter(content: TwitterPost): Promise<TwitterPostResult> {
  try {
    const appKey = process.env.TWITTER_API_KEY
    const appSecret = process.env.TWITTER_API_SECRET
    const accessToken = process.env.TWITTER_ACCESS_TOKEN
    const accessSecret = process.env.TWITTER_ACCESS_SECRET

    if (!appKey || !appSecret || !accessToken || !accessSecret) {
      return {
        success: false,
        error: 'Twitter credentials not configured',
      }
    }

    // Initialize Twitter client
    const client = new TwitterApi({
      appKey,
      appSecret,
      accessToken,
      accessSecret,
    })

    // If it's a thread, post each part
    if (content.threadParts && content.threadParts.length > 0) {
      const threadIds: string[] = []
      let replyToId: string | undefined

      for (const part of content.threadParts) {
        const tweet = await client.v2.tweet({
          text: part,
          reply: replyToId ? { in_reply_to_tweet_id: replyToId } : undefined,
        })

        threadIds.push(tweet.data.id)
        replyToId = tweet.data.id
      }

      const firstTweetUrl = `https://twitter.com/user/status/${threadIds[0]}`

      return {
        success: true,
        tweetId: threadIds[0],
        tweetUrl: firstTweetUrl,
        threadIds,
      }
    }

    // Single tweet
    let mediaIds: [string] | undefined

    // Upload image if provided
    if (content.imageUrl) {
      try {
        const imageResponse = await fetch(content.imageUrl)
        const imageBuffer = await imageResponse.arrayBuffer()
        const mediaId = await client.v1.uploadMedia(Buffer.from(imageBuffer), {
          mimeType: 'image/png',
        })
        mediaIds = [mediaId]
      } catch (error) {
        console.error('Failed to upload image to Twitter:', error)
        // Continue without image
      }
    }

    const tweet = await client.v2.tweet({
      text: content.text,
      media: mediaIds ? { media_ids: mediaIds } : undefined,
    })

    const tweetUrl = `https://twitter.com/user/status/${tweet.data.id}`

    return {
      success: true,
      tweetId: tweet.data.id,
      tweetUrl,
    }
  } catch (error) {
    console.error('Twitter posting error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Generate Twitter thread from blog post
 * Splits content into 280-character chunks
 */
export function generateTwitterThread(blogPost: {
  title: string
  excerpt: string
  url: string
  tags?: string[]
}): string[] {
  const thread: string[] = []

  // Thread opener
  thread.push(`🧵 New post: ${blogPost.title}\n\n${blogPost.excerpt}`)

  // Main content (if excerpt is long, split it)
  const sentences = blogPost.excerpt.split('. ')
  let currentTweet = ''

  for (const sentence of sentences) {
    if ((currentTweet + sentence).length > 250) {
      if (currentTweet) {
        thread.push(currentTweet.trim())
      }
      currentTweet = `${sentence}. `
    } else {
      currentTweet += `${sentence}. `
    }
  }

  if (currentTweet.trim() && thread.length > 1) {
    thread.push(currentTweet.trim())
  }

  // Final tweet with link and hashtags
  const hashtags = blogPost.tags
    ? blogPost.tags
        .slice(0, 3)
        .map((tag) => `#${tag.replace(/\s+/g, '')}`)
        .join(' ')
    : '#SoftwareEngineering #WebDev'

  thread.push(`Read the full article:\n${blogPost.url}\n\n${hashtags}`)

  return thread
}

/**
 * Generate a single tweet from blog post
 * Optimized for engagement
 */
export function generateSingleTweet(blogPost: {
  title: string
  excerpt: string
  url: string
  tags?: string[]
}): string {
  const maxLength = 280
  const urlLength = 23 // Twitter's t.co URL length
  const hashtags = blogPost.tags
    ? blogPost.tags
        .slice(0, 2)
        .map((tag) => `#${tag.replace(/\s+/g, '')}`)
        .join(' ')
    : '#DevTools'

  const availableLength = maxLength - urlLength - hashtags.length - 6 // 6 for spacing and emoji

  let excerpt = blogPost.excerpt
  if (excerpt.length > availableLength) {
    excerpt = `${excerpt.slice(0, availableLength - 3)}...`
  }

  return `🚀 ${blogPost.title}\n\n${excerpt}\n\n${blogPost.url}\n\n${hashtags}`
}

/**
 * Schedule a tweet for later posting
 * Note: This requires Twitter API Premium or Enterprise
 */
export async function scheduleTweet(text: string, scheduledAt: Date): Promise<TwitterPostResult> {
  // Note: Basic Twitter API doesn't support scheduling
  // This would need to be implemented with a job queue
  return {
    success: false,
    error: 'Tweet scheduling requires premium API access or external scheduler',
  }
}
