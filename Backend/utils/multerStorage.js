const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    
    let uploadPath;
    switch (file.fieldname) {
      case 'coverImage':
        uploadPath = path.join(__dirname, '..', 'public', 'posts', 'covers');
        break;
      case 'avatar':
        uploadPath = path.join(__dirname, '..', 'public', 'users', 'avatars');
        break;
      case 'podcast':
        uploadPath = path.join(__dirname, '..', 'public', 'posts', 'podcasts');
        break;
      default:
        return cb(new Error('نوع فایل نامعتبر است'));
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    
    const sha256 = crypto.createHash('sha256');
    const timestamp = Date.now();
    const hashedFileName = sha256.update(file.originalname + timestamp).digest('hex');
    cb(null, `${hashedFileName}${path.extname(file.originalname)}`);
  },
});


const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    coverImage: ['image/jpeg', 'image/png', 'image/gif'],
    avatar: ['image/jpeg', 'image/png', 'image/gif'],
    podcast: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
  };
  const validTypes = allowedTypes[file.fieldname] || [];
  if (validTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`فرمت فایل ${file.mimetype} برای ${file.fieldname} نامعتبر است`));
  }
};


module.exports = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});