// src/cloudinary/cloudinary.module.ts
import { Module } from '@nestjs/common';
import { DiscussionAgentCloudinaryService } from './discussion_agent_client_cloudinary.service';


@Module({
  providers: [DiscussionAgentCloudinaryService],
  exports: [DiscussionAgentCloudinaryService],
})
export class SocialCloudinaryModule {}
