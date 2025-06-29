import { useEffect } from 'react';
import { message } from 'antd';
import { useAppDispatch } from '../store/hooks';
import { clearError } from '../store/slices/projectSlice';

/**
 * 通用错误处理Hook
 * @param error 错误信息
 * @param clearErrorAction 清除错误的action (可选)
 */
export const useErrorHandler = (
    error: string | null,
    clearErrorAction?: () => any
) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (error) {
            message.error(error);
            const timer = setTimeout(() => {
                if (clearErrorAction) {
                    dispatch(clearErrorAction());
                } else {
                    dispatch(clearError());
                }
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, dispatch, clearErrorAction]);
};

/**
 * 项目相关错误处理Hook
 */
export const useProjectErrorHandler = (actionError: string | null, generalError?: string | null) => {
    useErrorHandler(actionError);
    useErrorHandler(generalError || null);
}; 