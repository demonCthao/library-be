import rateLimit from 'express-rate-limit';

export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 10, // 10 request / IP
  message: {
    success: false,
    message: 'Quá nhiều request, thử lại sau',
  },
});
