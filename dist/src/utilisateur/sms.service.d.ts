export declare class SmsService {
    private client;
    constructor();
    sendOtpSms(phoneNumber: string, otpCode: string): Promise<void>;
}
