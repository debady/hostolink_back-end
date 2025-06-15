import { InvitationService } from './invitation.service';
import { Request } from 'express';
import { PartageInvitationDto } from './dto/partage-invitation.dto';
export declare class InvitationController {
    private readonly invitationService;
    constructor(invitationService: InvitationService);
    getOrCreateInvitation(request: Request): Promise<{
        success: boolean;
        code_invitation: string;
        lien_invitation: string;
    }>;
    enregistrerClicInvitation(code: string, req: Request): Promise<{
        success: boolean;
        message: string;
    }>;
    incrementerPartage(dto: PartageInvitationDto): Promise<{
        message: string;
    }>;
}
