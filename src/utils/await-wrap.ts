async function awaitWrap<T, U = any>(
  promise: Promise<any>
): Promise<[U | null, T | null]> {
  try {
    const data = await promise;

    return [null, data];
  } catch (error) {
    return [error, null];
  }
}

export default awaitWrap;
