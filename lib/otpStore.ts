// Server side real OTP cache
export const activeOtpStore: Record<string, { otp: string; expiresAt: number }> = {};
