import logger from "../logger";
import handleError from "./error";
import { RequestError } from "../http.errors";
import { ActionResponse } from "@/types/globals";

interface FetchOptions extends RequestInit {
  timeout?: number;
}
// check if the error in the try and catch is an instance of AbortError
function isError(error: unknown): error is Error {
  return error instanceof Error;
}

export async function fetchHandler<T>(
  url: string,
  options: FetchOptions = {}
): Promise<ActionResponse<T>> {
  // destructure the timeout, headers and spread the rest of the options from the options
  const {
    timeout = 5000,
    headers: customHeaders = {},
    ...restOptions
  } = options;
  // create an onboard controller
  const controller = new AbortController();
  // set a timeOut to automatically onboard the request if it takes too long
  const id = setTimeout(() => controller.abort(), timeout);

  // set your default headers
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  // define all your headers
  const headers: HeadersInit = {
    ...defaultHeaders,
    ...customHeaders,
  };

  // config for the request
  const config: RequestInit = {
    ...restOptions,
    headers,
    signal: controller.signal,
  };

  // now we are ready to make a request
  try {
    // make the request
    const response = await fetch(url, config);
    // if the error succeeds clear the timeout
    clearTimeout(id);
    // if the request was successful
    if (!response.ok) {
      // return the response
      throw new RequestError(
        response.status,
        `HTTP errors: ${response.status}`
      );
    }
    // return the response if OK
    return response.json();
  } catch (err) {
    const error = isError(err) ? err : new Error("Unknown error");

    // handle timeOuts
    if (error.name === "AbortError") {
      logger.warn(`Request to ${url} timed out`);
    } else {
      logger.error(`Error fetching ${url}: ${error.message}`);
    }

    // Error handling mechanism
    return handleError(error) as unknown as ActionResponse<T>;
  }
}
