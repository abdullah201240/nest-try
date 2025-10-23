import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtOrApiKeyGuard extends AuthGuard('jwt') {
  constructor(private configService: ConfigService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    // Check if API key is provided and valid
    if (apiKey) {
      const validApiKey = this.configService.get<string>('API_SECRET_KEY') || 'your-server-api-secret-key';
      
      if (apiKey === validApiKey) {
        // API key is valid, allow access
        request.user = { 
          id: 0, 
          email: 'server-to-server',
          empId: 'API_ACCESS',
          source: 'api-key'
        };
        return true;
      } else {
        throw new UnauthorizedException('Invalid API Key');
      }
    }

    // If no API key, fall back to JWT authentication
    try {
      const result = await super.canActivate(context);
      return result as boolean;
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials. Please provide a valid JWT token or API key');
    }
  }
}
