import { useEffect, useRef, useCallback, useMemo } from 'react';
import { getCurrentToken, isUserAuthenticated } from '../utils/authUtils';

interface SignalRMessage {
    senderId: number;
    receiverId: number;
    content: string;
}

interface UseSignalRProps {
    onReceiveMessage?: (message: SignalRMessage) => void;
    onUserConnected?: (userId: number) => void;
    onUserDisconnected?: (userId: number) => void;
    onMessageRead?: (messageId: number, userId: number) => void;
    onError?: (error: string) => void;
}

// 全局SignalR连接实例
let globalConnection: any = null;
let globalConnectionPromise: Promise<any> | null = null;

export const useSignalR = ({
    onReceiveMessage,
    onUserConnected,
    onUserDisconnected,
    onMessageRead,
    onError
}: UseSignalRProps = {}) => {
    const connectionRef = useRef<any>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isConnectingRef = useRef(false);

    const connect = useCallback(async () => {
        if (!isUserAuthenticated()) {
            return;
        }

        const token = getCurrentToken();
        if (!token) {
            return;
        }

        // 如果已经有全局连接，直接使用
        if (globalConnection && globalConnection.state === 'Connected') {
            connectionRef.current = globalConnection;
            return;
        }

        // 如果正在连接中，等待连接完成
        if (globalConnectionPromise) {
            try {
                await globalConnectionPromise;
                connectionRef.current = globalConnection;
                return;
            } catch (error) {
                console.error('Failed to wait for existing connection:', error);
            }
        }

        // 防止重复连接
        if (isConnectingRef.current) {
            return;
        }

        isConnectingRef.current = true;

        try {
            // 动态导入SignalR客户端
            const { HubConnectionBuilder, HttpTransportType } = await import('@microsoft/signalr');

            const connection = new HubConnectionBuilder()
                .withUrl(`${(process.env.REACT_APP_API_URL || 'http://localhost:8080/api').replace('/api', '')}/chatHub?access_token=${token}`, {
                    transport: HttpTransportType.WebSockets
                })
                .withAutomaticReconnect()
                .build();

            // 设置事件处理器
            connection.on('ReceiveMessage', (senderId: number, receiverId: number, content: string) => {
                // 只处理发给当前用户的消息
                const token = getCurrentToken();
                if (token) {
                    try {
                        const payload = JSON.parse(atob(token.split('.')[1]));
                        const currentUserId = payload.nameid;
                        if (currentUserId && receiverId === parseInt(currentUserId)) {
                            onReceiveMessage?.({ senderId, receiverId, content });
                        }
                    } catch (error) {
                        console.error('Failed to parse token:', error);
                    }
                }
            });

            connection.on('UserConnected', (userId: number) => {
                onUserConnected?.(userId);
            });

            connection.on('UserDisconnected', (userId: number) => {
                onUserDisconnected?.(userId);
            });

            connection.on('MessageRead', (messageId: number, userId: number) => {
                onMessageRead?.(messageId, userId);
            });

            connection.onclose((error) => {
                console.log('SignalR connection closed:', error);
                if (error) {
                    onError?.('Connection lost. Trying to reconnect...');
                }
                // 清理全局连接
                if (globalConnection === connection) {
                    globalConnection = null;
                    globalConnectionPromise = null;
                }
            });

            globalConnectionPromise = connection.start();
            await globalConnectionPromise;

            globalConnection = connection;
            connectionRef.current = connection;
            globalConnectionPromise = null;
            console.log('SignalR connected successfully');
        } catch (error) {
            console.error('Failed to connect to SignalR:', error);
            onError?.('Failed to connect to chat server');
            globalConnection = null;
            globalConnectionPromise = null;
        } finally {
            isConnectingRef.current = false;
        }
    }, [onReceiveMessage, onUserConnected, onUserDisconnected, onMessageRead, onError]);

    const disconnect = useCallback(() => {
        if (connectionRef.current) {
            connectionRef.current.stop();
            connectionRef.current = null;
        }
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }
        // 清理全局连接
        if (globalConnection) {
            globalConnection.stop();
            globalConnection = null;
            globalConnectionPromise = null;
        }
    }, []);

    const sendMessage = useCallback(async (receiverId: number, content: string) => {
        if (connectionRef.current) {
            try {
                await connectionRef.current.invoke('SendMessage', receiverId, content);
            } catch (error) {
                console.error('Failed to send message via SignalR:', error);
                onError?.('Failed to send message');
            }
        }
    }, [onError]);

    const markAsRead = useCallback(async (messageId: number) => {
        if (connectionRef.current) {
            try {
                await connectionRef.current.invoke('MarkAsRead', messageId);
            } catch (error) {
                console.error('Failed to mark message as read via SignalR:', error);
            }
        }
    }, []);

    useEffect(() => {
        connect();

        return () => {
            disconnect();
        };
    }, [connect, disconnect]);

    return {
        connection: connectionRef.current,
        sendMessage,
        markAsRead,
        connect,
        disconnect
    };
}; 