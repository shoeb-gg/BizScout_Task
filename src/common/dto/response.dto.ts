import { HttpStatus } from '@nestjs/common';

export type ResponseDto<T> = {
  data: T;
  success: boolean;
  message: string;
  status: HttpStatus;
};

export type FindAllResponseDto<T> = ResponseDto<T> & {
  total: number;
  pagination: Pagination;
};

export type Pagination = {
  currentPage: number;
  pageSize: number;
  totalPages: number;
};
