export interface BaseSchema {
  type: string;
  [key: string]: unknown;
}

export interface SuccessSchema {
  type: 'object';
  properties: {
    success: { type: 'boolean'; example: boolean; description: string };
    statusCode: { type: 'string'; example: string; description: string };
    data: BaseSchema | { $ref: string };
    timestamp: {
      type: 'string';
      format: 'date-time';
      example: string;
      description: string;
    };
  };
  required: string[];
}

export interface ErrorSchema {
  type: 'object';
  properties: {
    success: { type: 'boolean'; example: boolean };
    statusCode: { type: 'string'; example: string; description: string };
    timestamp: { type: 'string'; format: 'date-time'; example: string };
    path: { type: 'string'; example: string };
    error: {
      oneOf: Array<{
        type: string;
        example?: string;
        items?: { type: string };
      }>;
    };
  };
  required: string[];
}

export interface ErrorConfig {
  description: string;
  example: string;
}
