import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface UserState {
    authorized: boolean;
    admin: boolean;
    loading: boolean;
}

const initialState: UserState = {
    authorized: false,
    admin: false,
    loading: false,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserAuthorized: (state, action: PayloadAction<boolean>) => {
            state.authorized = action.payload;
        },
        setUserAdmin: (state, action: PayloadAction<boolean>) => {
            state.admin = action.payload;
        },
        setUserLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        }
    },
});

export const {
    setUserAuthorized,
    setUserAdmin,
    setUserLoading,
} = userSlice.actions;

export default userSlice.reducer;
