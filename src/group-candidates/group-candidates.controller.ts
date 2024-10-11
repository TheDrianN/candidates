import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GroupCandidatesService } from './group-candidates.service';
import { CreateGroupCandidateDto } from './dto/create-group-candidate.dto';
import { UpdateGroupCandidateDto } from './dto/update-group-candidate.dto';
import { PaginationDto } from 'src/common';

@Controller()
export class GroupCandidatesController {
  constructor(private readonly groupCandidatesService: GroupCandidatesService) {}

  @MessagePattern('createGroupCandidate')
  create(@Payload() createGroupCandidateDto: CreateGroupCandidateDto) {
    return this.groupCandidatesService.create(createGroupCandidateDto);
  }

  @MessagePattern('findAllGroupCandidates')
  findAll(paginationDto:PaginationDto) {
    return this.groupCandidatesService.findAll(paginationDto);
  }

  @MessagePattern('findOneGroupCandidate')
  findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.groupCandidatesService.findOne(id);
  }

  @MessagePattern('updateGroupCandidate')
  update(@Payload() updateGroupCandidateDto: UpdateGroupCandidateDto) {
    return this.groupCandidatesService.update(updateGroupCandidateDto.id, updateGroupCandidateDto);
  }

  @MessagePattern('removeGroupCandidate')
  remove(@Payload('id', ParseIntPipe) id: number) {
    return this.groupCandidatesService.remove(id);
  }

  @MessagePattern('findAllCandidatesSubElection')
  findAllCandidatesSubElection(@Payload('id', ParseIntPipe) id: number) {
    return this.groupCandidatesService.findAllCandidatesSubElection(id);
  }
}
