import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateGroupCandidateDto } from './dto/create-group-candidate.dto';
import { UpdateGroupCandidateDto } from './dto/update-group-candidate.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class GroupCandidatesService extends PrismaClient implements OnModuleInit{
  onModuleInit() {
    this.$connect()
    console.log("Data base connect")
  }
  create(createGroupCandidateDto: CreateGroupCandidateDto) {
    return this.groupCandidates.create({
      data:createGroupCandidateDto
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    // Obtener el número total de páginas
    const totalPages = await this.groupCandidates.count();
    const lastPage = Math.ceil(totalPages / limit);

    // Obtener los grupos de candidatos junto con sus candidatos y los tipos
    const dataGroup = await this.groupCandidates.findMany({
        skip: (page - 1) * limit,
        take: limit,
        include: {
            candidates: {
                include: {
                    typeCandidate: true
                }
            }
        }
    });


      // Procesar los datos para incluir solo el 'id' de los candidatos con type "Decano" o "Presidente"
    const processedData = dataGroup.map(group => {
          const decanoOrPresidente = group.candidates.find(candidate => 
              candidate.typeCandidate.name_type === 'DECANO DEPARTAMENTAL' || candidate.typeCandidate.name_type === 'PRESIDENTE'
          );
         
          return {
              id: group.id,
              sub_election_id: group.sub_election_id,
              number_list: group.number_list,
              img: group.img,
              created_at: group.created_at,
              updated_at: group.updated_at,
              candidate_id: decanoOrPresidente ? decanoOrPresidente.user_id : null // Agregar el 'id' del candidato si es Decano o Presidente
          };
      });

      return {
          data: processedData,
          meta: {
              total: totalPages,
              page: page,
              lastPage: lastPage
          }
      };
  }

  async findOne(id: number) {
    const groupCandidate = await this.groupCandidates.findFirst({
      where:{id},
      include:{
        candidates:{
          include:{
            typeCandidate:{

            }
          }
        }
      }
    });

    if(!groupCandidate){
      throw new RpcException({
        message:`Candidato con el id ${id} no existe`,
      status:HttpStatus.BAD_REQUEST
      });
    }

    return {
      data:groupCandidate,
      status:HttpStatus.ACCEPTED
    }
  }

  async update(id: number, updateGroupCandidateDto: UpdateGroupCandidateDto) {
    const {id:_,...data} = updateGroupCandidateDto;

    await this.findOne(id);

    return this.groupCandidates.update({
      where:{id},
      data: data
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    const groupCandidate = await this.groupCandidates.update({
      where:{id},
      data:{
        number_list:'2'
      }
    })

    return groupCandidate;
  }

  async findAllCandidatesSubElection(subelection_id: number) {
    const groupCandidate = await this.groupCandidates.findMany({
      where: {
        sub_election_id: subelection_id,
        candidates: {
          some: {
            typeCandidate: {
              name_type: {
                in: ['DECANO DEPARTAMENTAL', 'PRESIDENTE'],
              },
            },
          },
        },
      },
      include: {
        candidates: {
          include: {
            typeCandidate: true,
          },
        },
      },
    });
  
    return {
      status:HttpStatus.ACCEPTED,
      data:groupCandidate
    };
  }
}
