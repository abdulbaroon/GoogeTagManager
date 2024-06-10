import { Users } from '@/types/users';
import { create } from 'zustand';

interface TodoStoreState {
    user: any;
    storeUsers: (str: Users) => void;
}

export const useUserStore = create<TodoStoreState>((set) => ({
    user:"",
    storeUsers: (str) => set({ user: str }),
}));