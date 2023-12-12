import { Response } from "express";
import { CUSTOM_MESSAGE, ERROR } from "./constants.js";

export type Messages = ErrorMessageKeys | CustomMessageKeys;

export type CustomResponse = Parameters<
  (
    response: Response,
    optionsOrMessage: Partial<Options> | CustomMessageKeys
  ) => Response
>;

export type CustomMessageKeys = Keys<typeof CUSTOM_MESSAGE>;

type Options<T = Nullable<any>> = {
  status: number;
  data: T;
  message: CustomMessageKeys;
};

export type ErrorMessageKeys = Keys<typeof ERROR>;
type ErrorOptions = {
  type: keyof typeof ERROR;
  message: Messages;
};

export type ErrorResponse = Parameters<
  (
    response: Response,
    optionsOrType: Optional<ErrorOptions, "message"> | Messages
  ) => Response
>;
