import { configureStore } from '@reduxjs/toolkit';
import deviceReducer from './../slices/deviceSlice';
import userReducer from './../slices/userSlice';

export const store = configureStore({
    reducer: {
        device: deviceReducer,
        user: userReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
