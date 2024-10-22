import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';
import { skip } from 'node:test';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class CandidatesService extends PrismaClient implements OnModuleInit {
  onModuleInit() {
    this.$connect();
    console.log("Data base connected")
  }

  create(createCandidateDto: CreateCandidateDto) {
    return this.candidate.create({
      data: createCandidateDto
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const {page, limit} = paginationDto;

    const totalPages = await this.candidate.count()
    const lastPage = Math.ceil(totalPages / limit);

    return {
      data:await this.candidate.findMany({
        skip: (page - 1) * limit,
        take: limit
      }),
      meta:{
        total: totalPages,
        page: page,
        lastPage: lastPage

      }
    }

  }

  async findOne(id: number) {
    const candidate = await this.candidate.findFirst({
      where: {id}
    })

    if(!candidate){
      throw new RpcException({
        message:`Candidato con el id ${id} no existe`,
      status:HttpStatus.BAD_REQUEST
      });
    }

    return candidate;
  }

  async update(id: number, updateCandidateDto: UpdateCandidateDto) {
    const {id:_,...data} = updateCandidateDto;
    await this.findOne(id);

    return this.candidate.update({
      where:{id},
      data:data
    });
  }

  async remove(id: number) {

    await this.findOne(id);

    const candidate = await this.candidate.delete({
      where:{id}
     
    })

    return candidate;
  }

  async validationUser(id:number){
    const user = this.candidate.findFirst({
      where:{
        user_id:id,
      }
    });

    if (user) {
      return {
        status: HttpStatus.CONFLICT,
        message: 'No se puede eliminar el usuario. Está asociado a otros datos.',
      };
    }

    return {
      status: HttpStatus.OK,
      message: 'El usuario no está asociado a ningún otro dato.',
    };
  }
}
