/**
 * Simple in-memory cache with TTL support
 * Stores data by key with automatic expiration after TTL seconds
 */

interface CacheEntry<T> {
	data: T;
	timestamp: number;
}

export class Cache<T> {
	private store: Map<string, CacheEntry<T>> = new Map();
	private ttl: number; // in seconds

	constructor(ttlSeconds: number = 3600) {
		this.ttl = ttlSeconds;
	}

	set(key: string, data: T): void {
		this.store.set(key, {
			data,
			timestamp: Date.now(),
		});
	}

	get(key: string): T | null {
		const entry = this.store.get(key);
		if (!entry) return null;

		// Check if entry has expired
		if (this.isExpired(entry)) {
			this.store.delete(key);
			return null;
		}

		return entry.data;
	}

	private isExpired(entry: CacheEntry<T>): boolean {
		const ageMs = Date.now() - entry.timestamp;
		const ageSec = ageMs / 1000;
		return ageSec > this.ttl;
	}

	has(key: string): boolean {
		return this.get(key) !== null;
	}

	clear(): void {
		this.store.clear();
	}
}

// Export singleton instance for contribution data (1 hour TTL)
export const contributionCache = new Cache<unknown>(3600);
