import multer from 'multer';

// Middleware do Multer para upload de imagens
export const upload = multer({ 
  dest: 'uploads/',
  limits: {
    fileSize: 1 * 1024 * 1024, // 1MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não suportado. Use apenas JPG ou PNG.'));
    }
  }
});
