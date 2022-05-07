import { IsMongoId } from 'class-validator';

export class FollowDto {
  @IsMongoId()
  userId: string;
}
