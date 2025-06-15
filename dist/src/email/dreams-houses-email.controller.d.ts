import { EmailService } from './dream-houses-email.service';
import { SendMailDto } from './dto/dreams-houses-send-mail.dto';
export declare class EmailController {
    private readonly emailService;
    constructor(emailService: EmailService);
    envoyer(body: SendMailDto, file: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
    }>;
}
