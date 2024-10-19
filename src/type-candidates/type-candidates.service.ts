import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateTypeCandidateDto } from './dto/create-type-candidate.dto';
import { UpdateTypeCandidateDto } from './dto/update-type-candidate.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class TypeCandidatesService extends PrismaClient implements OnModuleInit {
  onModuleInit() {
    this.$connect();
    console.log("Data base connect")
  }
  create(createTypeCandidateDto: CreateTypeCandidateDto) {
    return this.typeCandidate.create({
      data: createTypeCandidateDto,
    })
  }

  async findAll(paginationDto: PaginationDto) {
    const {page, limit} = paginationDto;

    const totalPages= await this.typeCandidate.count();
    const lastPage = Math.ceil(totalPages / limit);

    const TypeCandidates =  await this.typeCandidate.findMany({
      skip: (page -1 ) * limit,
      take: limit
    });
    
   // Mapa de valores de "type"
    const typeMapping = {
      'CD': 'CARGO PARA EL CONSEJO DEPARTAMENTAL',
      'CA': 'CARGO PARA ASAMBLEA DEPARTAMENTAL',
      'CC': 'CARGO PARA JUNTA DIRECTIVA DE LOS CAPÍTULOS',
    };


    const mappedTypeCandidates = TypeCandidates.map((typeCandidate) => ({
      ...typeCandidate,
      type: typeMapping[typeCandidate.type] || typeCandidate.type, // Usar el valor mapeado o el original si no hay correspondencia
    }));


    return{
      data: mappedTypeCandidates
      ,
      meta:{
        totalPages: totalPages,
        page: page,
        lastPage:lastPage
      }
    }
  }

  async findOne(id: number) {
    const typeCandidate = await this.typeCandidate.findFirst({
      where:{id}
    });


    if(!typeCandidate){
      throw new RpcException({
        message:`El tipo de candidato con el id ${id} no existe`,
      status:HttpStatus.BAD_REQUEST
      });
    }

    return {
      status: HttpStatus.ACCEPTED,
      data:typeCandidate
    }
  }

  async update(id: number, updateTypeCandidateDto: UpdateTypeCandidateDto) {
    const {id:_, ...data} = updateTypeCandidateDto;

    await this.findOne(id);

    return this.typeCandidate.update({
      where:{id},
      data:data
    });

  }

  async remove(id: number) {
    await this.findOne(id);

    const typeCandidate = await this.typeCandidate.delete({
      where:{id}
    })

    return {
      data:typeCandidate,
      status: HttpStatus.ACCEPTED
    };
  }

  async findAllTypeCandidates(type:string){
    try{
      const rolCandidate = await this.typeCandidate.findMany({
        where:{
          type: type
        }
      })

      return {
        status:HttpStatus.ACCEPTED,
        data: rolCandidate
      };

    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error al obtener los cargos',
      };
    }
  }


}
