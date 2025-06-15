export declare class EmailService {
    private transporter;
    constructor();
    uploadImageFromBuffer(buffer: Buffer): Promise<string>;
    sendCustomEmail(data: any): Promise<void>;
}
