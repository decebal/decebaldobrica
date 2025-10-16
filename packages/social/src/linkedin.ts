/**
 * LinkedIn integration for automated posting
 * Uses LinkedIn API v2 with OAuth 2.0
 */

interface LinkedInPost {
  text: string
  imageUrl?: string
  link?: string
  linkTitle?: string
  linkDescription?: string
}

interface LinkedInPostResult {
  success: boolean
  postId?: string
  postUrl?: string
  error?: string
}

/**
 * Post content to LinkedIn
 * Requires LinkedIn access token with w_member_social scope
 */
export async function postToLinkedIn(content: LinkedInPost): Promise<LinkedInPostResult> {
  try {
    const accessToken = process.env.LINKEDIN_ACCESS_TOKEN
    const personUrn = process.env.LINKEDIN_PERSON_URN

    if (!accessToken || !personUrn) {
      return {
        success: false,
        error: 'LinkedIn credentials not configured',
      }
    }

    // Prepare the post content
    const shareContent: any = {
      author: personUrn,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: content.text,
          },
          shareMediaCategory: content.imageUrl ? 'IMAGE' : content.link ? 'ARTICLE' : 'NONE',
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    }

    // Add media if provided
    if (content.imageUrl) {
      // First upload the image
      const imageUrn = await uploadImageToLinkedIn(content.imageUrl, accessToken)
      if (imageUrn) {
        shareContent.specificContent['com.linkedin.ugc.ShareContent'].media = [
          {
            status: 'READY',
            media: imageUrn,
          },
        ]
      }
    } else if (content.link) {
      shareContent.specificContent['com.linkedin.ugc.ShareContent'].media = [
        {
          status: 'READY',
          originalUrl: content.link,
          title: {
            text: content.linkTitle || '',
          },
          description: {
            text: content.linkDescription || '',
          },
        },
      ]
    }

    // Post to LinkedIn
    const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify(shareContent),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('LinkedIn API error:', data)
      return {
        success: false,
        error: data.message || 'Failed to post to LinkedIn',
      }
    }

    const postId = data.id
    const postUrl = `https://www.linkedin.com/feed/update/${postId}/`

    return {
      success: true,
      postId,
      postUrl,
    }
  } catch (error) {
    console.error('LinkedIn posting error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Upload an image to LinkedIn
 * Returns the media URN
 */
async function uploadImageToLinkedIn(
  imageUrl: string,
  accessToken: string
): Promise<string | null> {
  try {
    const personUrn = process.env.LINKEDIN_PERSON_URN

    // Step 1: Register the upload
    const registerResponse = await fetch(
      'https://api.linkedin.com/v2/assets?action=registerUpload',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registerUploadRequest: {
            recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
            owner: personUrn,
            serviceRelationships: [
              {
                relationshipType: 'OWNER',
                identifier: 'urn:li:userGeneratedContent',
              },
            ],
          },
        }),
      }
    )

    const registerData = await registerResponse.json()
    const uploadUrl =
      registerData.value?.uploadMechanism?.[
        'com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'
      ]?.uploadUrl
    const asset = registerData.value?.asset

    if (!uploadUrl || !asset) {
      console.error('Failed to get upload URL from LinkedIn')
      return null
    }

    // Step 2: Fetch the image
    const imageResponse = await fetch(imageUrl)
    const imageBuffer = await imageResponse.arrayBuffer()

    // Step 3: Upload the image
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/octet-stream',
      },
      body: imageBuffer,
    })

    if (!uploadResponse.ok) {
      console.error('Failed to upload image to LinkedIn')
      return null
    }

    return asset
  } catch (error) {
    console.error('LinkedIn image upload error:', error)
    return null
  }
}

/**
 * Generate LinkedIn post text from blog post
 * Optimized for engagement
 */
export function generateLinkedInPost(blogPost: {
  title: string
  excerpt: string
  url: string
  tags?: string[]
}): string {
  const hashtags = blogPost.tags
    ? blogPost.tags.map((tag) => `#${tag.replace(/\s+/g, '')}`).join(' ')
    : ''

  return `🚀 New post: ${blogPost.title}

${blogPost.excerpt}

Read the full article: ${blogPost.url}

${hashtags}

#SoftwareEngineering #WebDevelopment #TechBlog`
}

/**
 * Refresh LinkedIn access token
 * Access tokens expire after 60 days
 */
export async function refreshLinkedInToken(
  refreshToken: string
): Promise<{ accessToken?: string; error?: string }> {
  try {
    const clientId = process.env.LINKEDIN_CLIENT_ID
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      return { error: 'LinkedIn credentials not configured' }
    }

    const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return { error: data.error_description || 'Failed to refresh token' }
    }

    return { accessToken: data.access_token }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
