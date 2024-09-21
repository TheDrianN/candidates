import { Module } from '@nestjs/common';
import { CandidatesModule } from './candidates/candidates.module';
import { TypeCandidatesModule } from './type-candidates/type-candidates.module';
import { GroupCandidatesModule } from './group-candidates/group-candidates.module';


@Module({
  imports: [CandidatesModule, TypeCandidatesModule, GroupCandidatesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
