type SetInterval = ReturnType<typeof setInterval>;

declare type PromiseData<T> = Promise<Data<T>>;

interface Data<T> {
  code: number,
  msg: string,
  data: T,
}
