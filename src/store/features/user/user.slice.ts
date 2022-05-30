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
  currentUser: User | null;
};

const initialState: UserState = {
  users: [],
  currentUser: null,
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
export const selectUser = (state: AppState) => state.user.currentUser;
export const selectUsers = (state: AppState) => state.user.users;
// reducer
const userReducer = userSlice.reducer;
export default userReducer;
