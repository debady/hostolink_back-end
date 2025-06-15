import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
declare const JwtAgentStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtAgentStrategy extends JwtAgentStrategy_base {
    private readonly configService;
    constructor(configService: ConfigService);
    validate(payload: any): Promise<{
        id: any;
        email: any;
    }>;
}
export {};
