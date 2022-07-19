import HttpException from './http.exception';
import HttpStatusCode from './http.status.code';

export default class ExternalApiErrors {
  static message: string;

  static TO_MANY_REQUESTS() {
    ExternalApiErrors.message = 'To many requests to external API. Wait one minute';
    throw new HttpException(HttpStatusCode.TO_MANY_REQUESTS, ExternalApiErrors.message);
  }

  static NOT_FOUND() {
    ExternalApiErrors.message = 'Stock not found';
    throw new HttpException(HttpStatusCode.NOT_FOUND, ExternalApiErrors.message);
  }
}
