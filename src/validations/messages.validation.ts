import * as Joi from 'joi';

class MessagesValidator {
  reportMessageRequest = Joi.object({
    reason: Joi.string().required(),
  });
}

export const messagesValidator = new MessagesValidator();
