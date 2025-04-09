import {PrismaModule} from "../prisma/prisma.module";
import {Module} from "@nestjs/common";
import {ProjectService} from "./project.service";
import {ProjectController} from "./project.controller";

@Module({
  imports: [PrismaModule],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}