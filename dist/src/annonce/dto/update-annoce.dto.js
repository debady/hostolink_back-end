"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAnnonceDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_annonce_dto_1 = require("./create-annonce.dto");
class UpdateAnnonceDto extends (0, mapped_types_1.PartialType)(create_annonce_dto_1.CreateAnnonceDto) {
}
exports.UpdateAnnonceDto = UpdateAnnonceDto;
//# sourceMappingURL=update-annoce.dto.js.map