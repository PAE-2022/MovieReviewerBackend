import multer from 'multer';
import MulterGoogleCloudStorage from 'multer-cloud-storage';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const oneMiB = 1024 * 1024;

export type GcpFile = Express.Multer.File & {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  bucket: string;
  destination: string;
  filename: string;
  path: string;
  url: string;
  linkUrl: string;
  selfLink: string;
};

export const multerFileUploadHandler = multer({
  storage: new MulterGoogleCloudStorage({
    filename: (req: any, file: any, cb: any) => {
      const newFileName = `${uuidv4()}${path.extname(file.originalname)}`;

      cb(null, newFileName);
    },
  }),
  limits: {
    fileSize: oneMiB * 5,
  },
  fileFilter: (req, file, cb) => {
    console.log(file.mimetype);
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  },
});
