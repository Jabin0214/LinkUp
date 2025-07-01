import React from 'react';
import { Input, Select, InputNumber, DatePicker } from 'antd';
import type { InputProps, SelectProps, InputNumberProps, DatePickerProps } from 'antd';
import type { TextAreaProps } from 'antd/es/input';
import { useAppSelector } from '../../store/hooks';

const { TextArea, Search, Password } = Input;
const { Option } = Select;

// 基础样式配置
const getBaseStyle = (isDark: boolean) => ({
    borderRadius: 6,
    fontSize: '14px',
    transition: 'all 0.3s ease',
});

// 统一的Input组件
export const ThemedInput: React.FC<InputProps> = ({ style, ...props }) => {
    const { isDark } = useAppSelector(state => state.theme);

    return (
        <Input
            {...props}
            style={{
                ...getBaseStyle(isDark),
                ...style
            }}
            className={`themed-input ${isDark ? 'dark-theme' : 'light-theme'}`}
        />
    );
};

// 统一的TextArea组件
export const ThemedTextArea: React.FC<TextAreaProps> = ({ style, ...props }) => {
    const { isDark } = useAppSelector(state => state.theme);

    return (
        <TextArea
            {...props}
            style={{
                ...getBaseStyle(isDark),
                resize: 'vertical',
                ...style
            }}
            className={`themed-textarea ${isDark ? 'dark-theme' : 'light-theme'}`}
        />
    );
};

// 统一的Search组件
export const ThemedSearch: React.FC<InputProps> = ({ style, ...props }) => {
    const { isDark } = useAppSelector(state => state.theme);

    return (
        <Search
            {...props}
            style={{
                ...getBaseStyle(isDark),
                ...style
            }}
            className={`themed-search ${isDark ? 'dark-theme' : 'light-theme'}`}
        />
    );
};

// 统一的Password组件
export const ThemedPassword: React.FC<InputProps> = ({ style, ...props }) => {
    const { isDark } = useAppSelector(state => state.theme);

    return (
        <Password
            {...props}
            style={{
                ...getBaseStyle(isDark),
                ...style
            }}
            className={`themed-password ${isDark ? 'dark-theme' : 'light-theme'}`}
        />
    );
};

// 统一的Select组件
interface ThemedSelectProps extends SelectProps {
    children?: React.ReactNode;
}

export const ThemedSelect: React.FC<ThemedSelectProps> = ({ style, dropdownStyle, className, ...props }) => {
    const { isDark } = useAppSelector(state => state.theme);

    return (
        <Select
            {...props}
            style={{
                ...getBaseStyle(isDark),
                ...style
            }}
            className={`themed-select ${isDark ? 'dark-theme' : 'light-theme'} ${className || ''}`}
            dropdownClassName={`themed-select-dropdown ${isDark ? 'dark-theme' : 'light-theme'}`}
            dropdownStyle={{
                ...dropdownStyle
            }}
        />
    );
};

// 统一的InputNumber组件
export const ThemedInputNumber: React.FC<InputNumberProps> = ({ style, ...props }) => {
    const { isDark } = useAppSelector(state => state.theme);

    return (
        <InputNumber
            {...props}
            style={{
                ...getBaseStyle(isDark),
                width: '100%',
                ...style
            }}
            className={`themed-input-number ${isDark ? 'dark-theme' : 'light-theme'}`}
        />
    );
};

// 统一的DatePicker组件
export const ThemedDatePicker: React.FC<DatePickerProps> = ({ style, ...props }) => {
    const { isDark } = useAppSelector(state => state.theme);

    return (
        <DatePicker
            {...props}
            style={{
                ...getBaseStyle(isDark),
                width: '100%',
                ...style
            }}
            className={`themed-date-picker ${isDark ? 'dark-theme' : 'light-theme'}`}
        />
    );
};

// 导出Option用于Select
export { Option };

// 导出便捷的组合
export const ThemedFormComponents = {
    Input: ThemedInput,
    TextArea: ThemedTextArea,
    Search: ThemedSearch,
    Password: ThemedPassword,
    Select: ThemedSelect,
    InputNumber: ThemedInputNumber,
    DatePicker: ThemedDatePicker,
    Option
};

export default ThemedFormComponents;

/**
 * 使用示例：
 * 
 * // 替换前
 * import { Input, Select } from 'antd';
 * const { Option } = Select;
 * 
 * // 替换后
 * import { ThemedInput, ThemedSelect, Option } from '../components/common/FormComponents';
 * 
 * // 或者统一导入
 * import ThemedFormComponents from '../components/common/FormComponents';
 * const { Input, Select, Option } = ThemedFormComponents;
 * 
 * // 使用方式完全一样
 * <ThemedInput placeholder="Enter text" />
 * <ThemedSelect placeholder="Select option">
 *   <Option value="1">Option 1</Option>
 * </ThemedSelect>
 */ 