import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5500' }),
  // 缓存，默认时间是秒，默认时长60秒
  tagTypes: ['Post', 'User'],
  endpoints: () => ({}),
});
