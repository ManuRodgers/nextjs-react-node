import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { AppState } from '@/store';

const USERS_URL = 'https://jsonplaceholder.typicode.com/users';
export type User = {
  id: string;
  name: string;
};

export type UserState = {
  users: User[];
};

const initialState: UserState = {
  users: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUsersAsync.fulfilled, (state, action) => {
      state.users = action.payload;
    });
  },
});

// async actions
export const getUsersAsync = createAsyncThunk(
  'users/getUsersAsync',
  async () => {
    const response = await axios.get(USERS_URL);
    return response.data;
  }
);

// selectors
export const selectUserById = (state: AppState, userId: string) =>
  state.user.users.find((user) => user.id.toString() === userId.toString());
export const selectUsers = (state: AppState) => state.user.users;

// reducer
const userReducer = userSlice.reducer;
export default userReducer;
