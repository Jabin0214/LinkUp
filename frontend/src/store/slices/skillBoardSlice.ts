import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
    SkillBoardResponse,
    CreateSkillBoardRequest,
    UpdateSkillBoardRequest,
    getMySkillBoard,
    createSkillBoard as createSkillBoardAPI,
    updateSkillBoard as updateSkillBoardAPI,
    deleteSkillBoard as deleteSkillBoardAPI
} from '../../Services/SkillBoardService';

interface SkillBoardState {
    skillBoard: SkillBoardResponse | null;
    loading: boolean;
    error: string | null;
    hasSkillBoard: boolean;
    lastUpdated: number | null;
}

const initialState: SkillBoardState = {
    skillBoard: null,
    loading: false,
    error: null,
    hasSkillBoard: false,
    lastUpdated: null,
};

// 缓存时间：5分钟
const CACHE_DURATION = 5 * 60 * 1000;

// 异步actions
export const fetchSkillBoard = createAsyncThunk(
    'skillBoard/fetchSkillBoard',
    async (token: string, { rejectWithValue, getState }) => {
        try {
            const state = getState() as any;
            const lastUpdated = state.skillBoard.lastUpdated;

            // 检查缓存是否仍然有效
            if (lastUpdated && Date.now() - lastUpdated < CACHE_DURATION) {
                return state.skillBoard.skillBoard;
            }

            const response = await getMySkillBoard(token);
            return response;
        } catch (error: any) {
            if (error?.response?.status === 404) {
                // 用户没有技能板，这是正常情况
                return null;
            }
            return rejectWithValue(error?.response?.data?.message || 'Failed to fetch skill board');
        }
    }
);

export const createSkillBoard = createAsyncThunk(
    'skillBoard/createSkillBoard',
    async ({ data, token }: { data: CreateSkillBoardRequest; token: string }, { rejectWithValue }) => {
        try {
            const response = await createSkillBoardAPI(data, token);
            return response;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message || 'Failed to create skill board');
        }
    }
);

export const updateSkillBoard = createAsyncThunk(
    'skillBoard/updateSkillBoard',
    async ({ data, token }: { data: UpdateSkillBoardRequest; token: string }, { rejectWithValue }) => {
        try {
            const response = await updateSkillBoardAPI(data, token);
            return response;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message || 'Failed to update skill board');
        }
    }
);

export const deleteSkillBoard = createAsyncThunk(
    'skillBoard/deleteSkillBoard',
    async (token: string, { rejectWithValue }) => {
        try {
            await deleteSkillBoardAPI(token);
            return null;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message || 'Failed to delete skill board');
        }
    }
);

const skillBoardSlice = createSlice({
    name: 'skillBoard',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetSkillBoard: (state) => {
            return initialState;
        },
        // 用于手动设置技能板状态（例如从其他组件获取数据后）
        setSkillBoard: (state, action: PayloadAction<SkillBoardResponse | null>) => {
            state.skillBoard = action.payload;
            state.hasSkillBoard = action.payload !== null;
            state.lastUpdated = Date.now();
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetchSkillBoard
            .addCase(fetchSkillBoard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSkillBoard.fulfilled, (state, action) => {
                state.loading = false;
                state.skillBoard = action.payload;
                state.hasSkillBoard = action.payload !== null;
                state.lastUpdated = Date.now();
                state.error = null;
            })
            .addCase(fetchSkillBoard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.hasSkillBoard = false;
            })

            // createSkillBoard
            .addCase(createSkillBoard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createSkillBoard.fulfilled, (state, action) => {
                state.loading = false;
                state.skillBoard = action.payload;
                state.hasSkillBoard = true;
                state.lastUpdated = Date.now();
                state.error = null;
            })
            .addCase(createSkillBoard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // updateSkillBoard
            .addCase(updateSkillBoard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateSkillBoard.fulfilled, (state, action) => {
                state.loading = false;
                state.skillBoard = action.payload;
                state.hasSkillBoard = true;
                state.lastUpdated = Date.now();
                state.error = null;
            })
            .addCase(updateSkillBoard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // deleteSkillBoard
            .addCase(deleteSkillBoard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteSkillBoard.fulfilled, (state) => {
                state.loading = false;
                state.skillBoard = null;
                state.hasSkillBoard = false;
                state.lastUpdated = Date.now();
                state.error = null;
            })
            .addCase(deleteSkillBoard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError, resetSkillBoard, setSkillBoard } = skillBoardSlice.actions;
export default skillBoardSlice.reducer; 