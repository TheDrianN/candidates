import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TypeCandidatesService } from './type-candidates.service';
import { CreateTypeCandidateDto } from './dto/create-type-candidate.dto';
import { UpdateTypeCandidateDto } from './dto/update-type-candidate.dto';
import { PaginationDto } from 'src/common';

@Controller()
export class TypeCandidatesController {
  constructor(private readonly typeCandidatesService: TypeCandidatesService) {}

  @MessagePattern('createTypeCandidate')
  create(@Payload() createTypeCandidateDto: CreateTypeCandidateDto) {
    return this.typeCandidatesService.create(createTypeCandidateDto);
  }

  @MessagePattern('findAllTypeCandidates')
  findAll(paginationDto:PaginationDto) {
    return this.typeCandidatesService.findAll(paginationDto);
  }

  @MessagePattern('findOneTypeCandidate')
  findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.typeCandidatesService.findOne(id);
  }

  @MessagePattern('updateTypeCandidate')
  update(@Payload() updateTypeCandidateDto: UpdateTypeCandidateDto) {
    return this.typeCandidatesService.update(updateTypeCandidateDto.id, updateTypeCandidateDto);
  }

  @MessagePattern('removeTypeCandidate')
  remove(@Payload('id', ParseIntPipe) id: number) {
    return this.typeCandidatesService.remove(id);
  }

  @MessagePattern('findAllTypeCandidates2')
  findAllTypeCandidates(@Payload('type') type: string) {
    return this.typeCandidatesService.findAllTypeCandidates(type);
  }
}
