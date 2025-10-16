import Link from 'next/link'

export default function NewsletterSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 text-center">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-4">
            <svg
              className="h-16 w-16 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              role="img"
              aria-label="Success"
            >
              <title>Success</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to Premium! 🎉
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Your subscription has been activated successfully. You now have access to all premium
          content.
        </p>

        {/* What's Next */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-8 text-left">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">What's next?</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">
                You'll receive a confirmation email shortly
              </span>
            </li>
            <li className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">
                Browse exclusive premium content on the blog
              </span>
            </li>
            <li className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">
                Get early access to new articles and tutorials
              </span>
            </li>
            <li className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">
                Weekly newsletters delivered to your inbox
              </span>
            </li>
          </ul>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <Link
            href="/blog"
            className="block w-full px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            Start Reading Premium Content
          </Link>
          <Link
            href="/"
            className="block w-full px-6 py-3 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>

        {/* Support */}
        <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          Questions or issues?{' '}
          <a
            href="mailto:decebal@dobrica.dev"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Contact Support
          </a>
        </p>
      </div>
    </div>
  )
}
