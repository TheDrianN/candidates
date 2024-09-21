import { Module } from '@nestjs/common';
import { TypeCandidatesService } from './type-candidates.service';
import { TypeCandidatesController } from './type-candidates.controller';

@Module({
  controllers: [TypeCandidatesController],
  providers: [TypeCandidatesService],
})
export class TypeCandidatesModule {}
