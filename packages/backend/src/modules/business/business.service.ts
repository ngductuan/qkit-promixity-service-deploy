import { HttpException, Injectable } from '@nestjs/common';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { Business } from './entities/business.entity';
import {
  BusinessRepository,
  BusinessSoftDeleteRepository,
} from './repository/business.repository';
import { BusinessConstant } from '../../common/constants/business.constant';
import {
  ERRORS_DICTIONARY,
  ERROR_CODES,
} from 'src/common/constants/error.constant';

@Injectable()
export class BusinessService {
  constructor(
    private readonly businessRepository: BusinessRepository,
    private readonly businessSoftDeleteRepository: BusinessSoftDeleteRepository,
  ) {}

  async create(createBusinessDto: CreateBusinessDto): Promise<Business> {
    const { dayOfWeek } = createBusinessDto;
    // Validate open time and close time
    for (const day of dayOfWeek) {
      if (
        !RegExp(BusinessConstant.regexOpenCloseTime).test(day.openTime) ||
        !RegExp(BusinessConstant.regexOpenCloseTime).test(day.closeTime)
      ) {
        throw new HttpException(
          {
            message: ERRORS_DICTIONARY.INVALID_INPUT,
            detail:
              'Open time and close time must be in format HH:MM or HH must be 00 to 23 or MM must be one of 00, 05, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55',
          },
          ERROR_CODES[ERRORS_DICTIONARY.INVALID_INPUT],
        );
      }
      const startHH = parseInt(day.openTime.split(':')[0]);
      const startMM = parseInt(day.openTime.split(':')[1]);
      const endHH = parseInt(day.closeTime.split(':')[0]);
      const endMM = parseInt(day.closeTime.split(':')[1]);
      if (startHH < 0 || startHH > 23 || endHH < 0 || endHH > 23) {
        throw new HttpException(
          {
            message: ERRORS_DICTIONARY.INVALID_INPUT,
            detail: 'Open time and close time must be between 0 and 23',
          },
          ERROR_CODES[ERRORS_DICTIONARY.INVALID_INPUT],
        );
      }
      if (startMM < 0 || startMM > 59 || endMM < 0 || endMM > 59) {
        throw new HttpException(
          {
            message: ERRORS_DICTIONARY.INVALID_INPUT,
            detail: 'Open time and close time must be between 0 and 59',
          },
          ERROR_CODES[ERRORS_DICTIONARY.INVALID_INPUT],
        );
      }
      // opening 24H
      if (
        startHH === endHH &&
        startMM === endMM &&
        startHH === 0 &&
        startMM === 0
      ) {
        continue;
      }
      if (startHH > endHH || (startHH === endHH && startMM >= endMM)) {
        throw new HttpException(
          {
            message: ERRORS_DICTIONARY.INVALID_INPUT,
            detail: 'Open time must be before close time',
          },
          ERROR_CODES[ERRORS_DICTIONARY.INVALID_INPUT],
        );
      }
    }
    // Format HH or MM from 0 to 00, 1 to 01, 2 to 02,...
    dayOfWeek.forEach((day) => {
      day.openTime = day.openTime
        .split(':')
        .map((time) => (time.length === 1 ? `0${time}` : time))
        .join(':');
      day.closeTime = day.closeTime
        .split(':')
        .map((time) => (time.length === 1 ? `0${time}` : time))
        .join(':');
    });
    const business = await this.businessRepository.create(createBusinessDto);
    return business;
  }

  async softDelete(id: string): Promise<boolean> {
    const business = await this.businessSoftDeleteRepository.softDelete(id);

    return business;
  }

  async forceDelete(id: string): Promise<boolean> {
    const business = await this.businessSoftDeleteRepository.forceDelete(id);

    return business;
  }

  async restore(id: string): Promise<boolean> {
    const business = await this.businessSoftDeleteRepository.restore(id);

    return business;
  }
}
