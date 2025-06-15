import { Invitation } from './invitation.entity';
export declare class InvitationTracking {
    id_tracking: number;
    code_invitation: string;
    ip_visiteur: string;
    user_agent: string;
    date_click: Date;
    invitation: Invitation;
}
