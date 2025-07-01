import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authSlice from './slices/authSlice';
import skillBoardSlice from './slices/skillBoardSlice';
import projectSlice from './slices/projectSlice';
import themeSlice from './slices/themeSlice';

// 持久化配置
const persistConfig = {
    key: 'auth',
    version: 1,
    storage,
    // 只持久化重要数据，token用于自动登录，user用于减少API调用
    whitelist: ['token', 'refreshToken', 'user', 'lastUpdated', 'isAuthenticated']
};

// skillBoard持久化配置 
const skillBoardPersistConfig = {
    key: 'skillBoard',
    version: 1,
    storage,
    whitelist: ['skillBoard', 'hasSkillBoard', 'lastUpdated']
};

// projects持久化配置
const projectsPersistConfig = {
    key: 'projects',
    version: 1,
    storage,
    // 只持久化部分数据，避免存储过多内容
    whitelist: ['projects', 'myProjects', 'searchQuery', 'lastFetch', 'totalCount', 'currentPage', 'totalPages']
};

// 主题持久化配置
const themePersistConfig = {
    key: 'theme',
    version: 1,
    storage,
    // 只持久化用户选择的主题模式
    whitelist: ['mode']
};

const persistedAuthReducer = persistReducer(persistConfig, authSlice);
const persistedSkillBoardReducer = persistReducer(skillBoardPersistConfig, skillBoardSlice);
const persistedProjectsReducer = persistReducer(projectsPersistConfig, projectSlice);
const persistedThemeReducer = persistReducer(themePersistConfig, themeSlice);

export const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
        skillBoard: persistedSkillBoardReducer,
        projects: persistedProjectsReducer,
        theme: persistedThemeReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 