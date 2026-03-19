import multer from 'multer';

// Middleware do Multer para upload de imagens
export const upload = multer({ dest: 'uploads/' });
