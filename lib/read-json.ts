export async function readResponseJson<T>(response: Response): Promise<T> {
  const text = await response.text();
  if (!text) {
    throw new Error(
      response.status === 413
        ? "The image is too large. Try a smaller file."
        : `Request failed (${response.status || "empty response"}).`
    );
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`Request failed (${response.status}).`);
  }
}
