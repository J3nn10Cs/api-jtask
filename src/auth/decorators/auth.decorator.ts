

import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export function Auth() {
  //decorator to join
  return applyDecorators( 
    UseGuards(AuthGuard()),
  );
}

