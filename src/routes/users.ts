import { createUser } from '@controllers/users.controller';
import { CreateUserDto, createUserSchema } from '@models/schemas/create-user';
import { validate } from '@utils/validate';
import { Request, Router } from 'express';

const router = Router();

router.post('/', validate(createUserSchema), async (req, res) => {
  const body = req.body as CreateUserDto;
  const user = await createUser(body);
});
