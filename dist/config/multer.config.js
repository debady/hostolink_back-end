"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerOptions = void 0;
exports.multerOptions = {
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
            cb(new Error('Format d’image invalide'), false);
        }
        else {
            cb(null, true);
        }
    },
};
//# sourceMappingURL=multer.config.js.map