import type { APIRoute } from 'astro';
import { contributionCache } from '../../../lib/cache';

export const prerender = false;

const GITHUB_CONTRIBS_URL = 'https://github.com';
const REQUEST_TIMEOUT = 10000; // 10 seconds

/**
 * Fetches GitHub contribution data for a given username
 * Uses in-memory caching to reduce API calls
 */
export const GET: APIRoute = async ({ params }) => {
	const { username } = params;

	if (!username) {
		return new Response(
			JSON.stringify({ error: 'Username is required' }),
			{
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}

	// Check cache first
	const cachedData = contributionCache.get(username);
	if (cachedData) {
		return new Response(JSON.stringify(cachedData), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	try {
		// Fetch from GitHub
		const data = await fetchGitHubContributions(username);

		// Cache the result
		contributionCache.set(username, data);

		return new Response(JSON.stringify(data), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		// Handle different error types
		if (error instanceof GitHubNotFoundError) {
			return new Response(
				JSON.stringify({ error: 'User not found' }),
				{
					status: 404,
					headers: { 'Content-Type': 'application/json' },
				}
			);
		}

		if (error instanceof GitHubRateLimitError) {
			return new Response(
				JSON.stringify({ error: 'GitHub rate limit exceeded' }),
				{
					status: 429,
					headers: { 'Content-Type': 'application/json' },
				}
			);
		}

		console.error(`[contributions] Error fetching data for ${username}:`, error);

		return new Response(
			JSON.stringify({ error: 'Failed to fetch contribution data' }),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}
};

/**
 * Fetches contribution data from GitHub's public endpoint
 * Throws GitHubNotFoundError or GitHubRateLimitError on specific failures
 */
async function fetchGitHubContributions(username: string): Promise<unknown> {
	const url = `${GITHUB_CONTRIBS_URL}/${username}.contribs`;

	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

	try {
		const response = await fetch(url, {
			signal: controller.signal,
		});

		if (response.status === 404) {
			throw new GitHubNotFoundError(`User "${username}" not found on GitHub`);
		}

		if (response.status === 429) {
			throw new GitHubRateLimitError('GitHub rate limit exceeded');
		}

		if (!response.ok) {
			throw new Error(`GitHub returned status ${response.status}`);
		}

		// Parse and validate JSON
		const data = await response.json();

		// Ensure we got valid data (basic check)
		if (!data || typeof data !== 'object') {
			throw new Error('GitHub returned invalid JSON');
		}

		return data;
	} catch (error) {
		// Re-throw known errors
		if (error instanceof GitHubNotFoundError || error instanceof GitHubRateLimitError) {
			throw error;
		}

		// Handle timeout
		if (error instanceof Error && error.name === 'AbortError') {
			throw new Error(`Request to GitHub timed out after ${REQUEST_TIMEOUT}ms`);
		}

		throw error;
	} finally {
		clearTimeout(timeoutId);
	}
}

class GitHubNotFoundError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'GitHubNotFoundError';
	}
}

class GitHubRateLimitError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'GitHubRateLimitError';
	}
}
