import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CandidatesService } from './candidates.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { PaginationDto } from 'src/common';

@Controller()
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @MessagePattern('createCandidate')
  create(@Payload() createCandidateDto: CreateCandidateDto) {
    return this.candidatesService.create(createCandidateDto);
  }

  @MessagePattern('findAllCandidates')
  findAll(@Payload() paginationDto:PaginationDto) {
    return this.candidatesService.findAll(paginationDto);
  }

  @MessagePattern('findOneCandidate')
  findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.candidatesService.findOne(id);
  }

  @MessagePattern('updateCandidate')
  update(@Payload() updateCandidateDto: UpdateCandidateDto) {
    return this.candidatesService.update(updateCandidateDto.id, updateCandidateDto);
  }

  @MessagePattern('removeCandidate')
  remove(@Payload('id', ParseIntPipe) id: number) {
    return this.candidatesService.remove(id);
  }
}
