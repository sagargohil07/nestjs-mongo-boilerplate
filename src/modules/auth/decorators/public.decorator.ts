import { SetMetadata } from '@nestjs/common';
import { PUBLIC_ROUTE } from 'src/helpers/constant';

export const IS_PUBLIC_KEY = PUBLIC_ROUTE;
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
