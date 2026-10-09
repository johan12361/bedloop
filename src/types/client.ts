export interface ClientOptions {
	user: string
	password: string
	url: string
	debug?: boolean
}

export interface Authorization {
	token: string
	expiresAt: Date
}
