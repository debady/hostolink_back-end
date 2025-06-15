import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
declare const JwtExpertStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtExpertStrategy extends JwtExpertStrategy_base {
    constructor(configService: ConfigService);
    validate(payload: any): Promise<{
        id_expert: any;
    }>;
}
export {};
