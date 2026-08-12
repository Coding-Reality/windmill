// SvelteKit-specific logout utilities
// These functions depend on $lib/navigation which requires SvelteKit

import { goto } from '$lib/navigation'
import { clearUser } from './logout'
import { sendUserToast } from './toast'

const ssoLogoutUrl = import.meta.env.VITE_SSO_LOGOUT_URL?.trim()

export function getPostLogoutUrl(): string {
	return ssoLogoutUrl || '/user/login'
}

export function goToPostLogoutUrl(): void {
	const postLogoutUrl = getPostLogoutUrl()
	if (postLogoutUrl.startsWith('/')) {
		goto(postLogoutUrl, { replaceState: true })
	} else {
		window.location.href = postLogoutUrl
	}
}

export async function logoutWithRedirect(rd?: string): Promise<void> {
	console.log('logoutWithRedirect', rd)
	await clearUser()
	const splitted = rd?.split('?')[0]
	if (rd && rd != '/' && splitted != '/user/login' && splitted != '/user/logout') {
		const error = document.cookie.includes('token')
			? `error=${encodeURIComponent('You have been logged out because your session has expired.')}&`
			: ''
		console.log('login redirect with error', error, rd)
		goto(`/user/login?${error}${rd ? 'rd=' + encodeURIComponent(rd) : ''}`, { replaceState: true })
	} else {
		console.log('login redirect vanilla')
		goto('/user/login', { replaceState: true })
	}
}

export async function logout(): Promise<void> {
	await clearUser()
	goToPostLogoutUrl()
	sendUserToast('you have been logged out')
}
