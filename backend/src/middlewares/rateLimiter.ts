import rateLimit from 'express-rate-limit';

/**
 * Limitador de taxa para evitar spam em formulários de suporte.
 * Limita a 5 requisições a cada 15 minutos por IP.
 */
export const supportRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Limite de 5 requisições por IP
  message: {
    success: false,
    error: 'Muitos relatos enviados. Por favor, tente novamente em 15 minutos.'
  },
  standardHeaders: true, // Retorna info do limite nos headers `RateLimit-*`
  legacyHeaders: false, // Desabilita headers `X-RateLimit-*`
});
