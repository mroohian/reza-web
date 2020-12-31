import * as Joi from 'joi';

import { MakeRequired } from '../utils/TsUtils';
import { ApiResponseStatus, ApiResponseStatusSchema, ApiResponseStatusSchemaType } from './HttpStatusCodes';

interface ApiResponseBase<T = undefined> {
  readonly success: boolean;
  readonly value?: T;
  readonly status: ApiResponseStatus;
  readonly messages?: readonly string[];
}

interface ApiResponseBaseSchemaType<T> {
  readonly success: Joi.BooleanSchema;
  readonly value?: T;
  readonly status: Joi.ObjectSchema<ApiResponseStatusSchemaType>;
  readonly messages?: Joi.ArraySchema;
}

export type ApiResponse<T = undefined> = T extends undefined
  ? Omit<ApiResponseBase<T>, 'value'>
  : MakeRequired<ApiResponseBase<T>, 'value'>;

export type ApiResponseSchema<T = undefined> = T extends undefined
  ? Omit<ApiResponseBaseSchemaType<T>, 'value'>
  : MakeRequired<ApiResponseBaseSchemaType<T>, 'value'>;

const messagesSchema = Joi.array()
  .label('messages')
  .description('List of execution log messages')
  .note('The value is not guaranteed to always be present')
  .items(Joi.string().required());

const getApiResponseSchemaDefinition = <T extends Joi.Schema>(valueSchema?: T): ApiResponseSchema<T> =>
  ((valueSchema
    ? {
        success: Joi.boolean().required(),
        value: valueSchema.required(),
        status: ApiResponseStatusSchema.required(),
        messages: messagesSchema.optional(),
      }
    : {
        success: Joi.boolean().required(),
        status: ApiResponseStatusSchema.required(),
        messages: messagesSchema.optional(),
      }) as unknown) as ApiResponseSchema<T>;

export const getApiResponseSchema = <T extends Joi.Schema>(valueSchema?: T): Joi.ObjectSchema<ApiResponseSchema<T>> =>
  Joi.object({}).keys(getApiResponseSchemaDefinition(valueSchema));
