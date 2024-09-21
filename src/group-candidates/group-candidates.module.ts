import { Module } from '@nestjs/common';
import { GroupCandidatesService } from './group-candidates.service';
import { GroupCandidatesController } from './group-candidates.controller';

@Module({
  controllers: [GroupCandidatesController],
  providers: [GroupCandidatesService],
})
export class GroupCandidatesModule {}
