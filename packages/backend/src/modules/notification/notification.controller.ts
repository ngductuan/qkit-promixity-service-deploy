import {
  Controller,
  Get,
  HttpCode,
  Param,
  UseGuards,
  Query,
  Patch,
  Req,
} from '@nestjs/common';

import { NotificationService } from './notification.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAccessTokenGuard } from 'src/cores/guard/jwt-access-token.guard';
import { RoleGuard } from 'src/cores/guard/role.guard';
import { UserRole } from 'src/common/enums';
import { Roles } from 'src/common/decorators/role.decorator';
import { plainToClass } from 'class-transformer';
import { FindAllNotificationQuery } from './dto/find-all-notification-query';
import { Request } from 'express';

@Controller('notifications')
@ApiTags('notification')
@ApiBearerAuth()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('unread-count')
  @HttpCode(200)
  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(UserRole.ADMIN, UserRole.BUSINESS, UserRole.USER)
  async getUnreadCount(@Req() req: Request) {
    console.log('in');
    return await this.notificationService.getUnreadCount(req.user);
  }

  @Get(':id')
  @HttpCode(200)
  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(UserRole.ADMIN, UserRole.BUSINESS, UserRole.USER)
  @ApiResponse({
    status: 200,
  })
  async findOneById(@Param('id') id: string) {
    const result = await this.notificationService.findOneById(id);

    return result;
  }

  @Get()
  @HttpCode(200)
  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(UserRole.ADMIN, UserRole.BUSINESS, UserRole.USER)
  async findAllNotification(
    @Query() data: FindAllNotificationQuery,
    @Req() req: Request,
  ) {
    const transferData = plainToClass(FindAllNotificationQuery, data);

    return await this.notificationService.findAllNotification(
      transferData,
      req.user,
    );
  }

  @Patch('all/read')
  @HttpCode(200)
  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(UserRole.ADMIN, UserRole.BUSINESS, UserRole.USER)
  async markAllAsRead(@Req() req: Request) {
    return await this.notificationService.markAllAsRead(req.user);
  }

  @Patch(':id/read')
  @HttpCode(200)
  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(UserRole.ADMIN, UserRole.BUSINESS, UserRole.USER)
  async markAsRead(@Param('id') id: string, @Req() req: Request) {
    return await this.notificationService.markAsRead(id, req.user);
  }
}
