import { Prisma } from "@prisma/client";
import { injectable } from "tsyringe";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { MailService } from "../mail/mail.service";
import { PaginationService } from "../pagination/pagination.service";
import { PrismaService } from "../prisma/prisma.service";
import { CreateSampleDTO } from "./dto/create-sample.dto";
import { GetSamplesDTO } from "./dto/get-samples.dto";
import { UpdateSampleDTO } from "./dto/update-sample.dto";

@injectable()
export class SampleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly paginationService: PaginationService,
    private readonly fileService: CloudinaryService,
  ) {}

  getSamples = async (dto: GetSamplesDTO) => {
    const { page, take, sortBy, sortOrder, all, search } = dto;

    const whereClause: Prisma.SampleWhereInput = {
      deletedAt: null,
    };

    if (search) {
      whereClause.name = { contains: search, mode: "insensitive" };
    }

    let paginationArgs: Prisma.SampleFindManyArgs = {};

    if (!all) {
      paginationArgs = {
        skip: (page - 1) * take,
        take,
      };
    }

    const samples = await this.prisma.sample.findMany({
      where: whereClause,
      orderBy: { [sortBy]: sortOrder },
      ...paginationArgs,
    });

    const count = await this.prisma.sample.count({ where: whereClause });

    return {
      data: samples,
      meta: this.paginationService.generateMeta({
        page,
        take: all ? count : take,
        count,
      }),
    };
  };

  getSample = async (id: number) => {
    return this.prisma.sample.findFirstOrThrow({
      where: { id, deletedAt: null },
    });
  };

  createSample = async (body: CreateSampleDTO, image: Express.Multer.File) => {
    const { secure_url } = await this.fileService.upload(image);

    this.mailService.sendEmail(
      "danielreinhard1129@gmail.com",
      "Hello",
      "example",
      {
        name: "Daniel",
      },
    );

    return this.prisma.sample.create({
      data: body,
    });
  };

  updateSample = async (id: number, body: UpdateSampleDTO) => {
    await this.prisma.sample.findFirstOrThrow({ where: { id } });

    return this.prisma.sample.update({
      where: { id },
      data: body,
    });
  };

  deleteSample = async (id: number) => {
    await this.prisma.sample.findFirstOrThrow({ where: { id } });

    await this.prisma.sample.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: "Delete sample success" };
  };
}
