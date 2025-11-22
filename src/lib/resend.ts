import {Resend} from 'resend'

export const resend = new Resend(process.env.RRESEND_API_KEY);