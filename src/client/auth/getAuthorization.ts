import axios from 'axios'

import type { Client } from '../client.js'
import type { Authorization } from '../../types/client.js'

const MAX_RETRIES = 3
const RETRY_DELAY = 1_000

export async function getAuthorization(client: Client): Promise<Authorization> {
	const url = `${client.options.url}/api/v1/login`
	const headers = {
		Accept: 'application/json',
		Authorization: createUserPass(client.options.user, client.options.password)
	}

	let lastError: Error | null = null

	for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
		try {
			const response = await axios.get(url, { headers })

			// validar dados de autorización
			if (response.data?.token && response.data.expires_at) {
				client.log(`Connection successful on attempt ${attempt}`)

				return {
					token: response.data.token as string,
					expiresAt: new Date(response.data.expires_at as string)
				}
			} else {
				throw new Error('Invalid authorization data')
			}
		} catch (error) {
			lastError = error instanceof Error ? error : new Error(String(error))

			if (attempt < MAX_RETRIES) {
				client.log(`Attempt ${attempt} failed, retrying in ${RETRY_DELAY / 1000}s...`)

				await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
			} else {
				client.log(`All ${MAX_RETRIES} attempts failed`)
			}
		}
	}

	throw lastError || new Error('Authorization failed after retries')
}

function createUserPass(user: string, password: string): string {
	const token = Buffer.from(`${user}:${password}`, 'utf8').toString('base64')
	return `Basic ${token}`
}
