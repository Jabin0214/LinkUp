using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Collections.Concurrent;

namespace Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        // 使用ConcurrentDictionary避免线程安全问题
        private static readonly ConcurrentDictionary<string, int> _userConnections = new();
        private static readonly ConcurrentDictionary<int, HashSet<string>> _userConnectionIds = new();

        // 添加连接清理定时器
        private static readonly Timer _cleanupTimer = new Timer(CleanupConnections, null,
            TimeSpan.FromMinutes(5), TimeSpan.FromMinutes(5));

        public override async Task OnConnectedAsync()
        {
            var userId = GetUserId();
            if (userId.HasValue)
            {
                var connectionId = Context.ConnectionId;
                _userConnections[connectionId] = userId.Value;

                // 管理用户的所有连接
                _userConnectionIds.AddOrUpdate(userId.Value,
                    new HashSet<string> { connectionId },
                    (key, existing) =>
                    {
                        lock (existing)
                        {
                            existing.Add(connectionId);
                        }
                        return existing;
                    });

                // 优化：只通知真正需要的客户端
                await Clients.Others.SendAsync("UserConnected", userId.Value);
            }
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = GetUserId();
            if (userId.HasValue)
            {
                var connectionId = Context.ConnectionId;
                _userConnections.TryRemove(connectionId, out _);

                // 清理用户连接记录
                if (_userConnectionIds.TryGetValue(userId.Value, out var connectionIds))
                {
                    lock (connectionIds)
                    {
                        connectionIds.Remove(connectionId);
                        if (connectionIds.Count == 0)
                        {
                            _userConnectionIds.TryRemove(userId.Value, out _);
                        }
                    }
                }

                // 检查用户是否完全离线
                if (!_userConnectionIds.ContainsKey(userId.Value))
                {
                    await Clients.Others.SendAsync("UserDisconnected", userId.Value);
                }
            }
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(int receiverId, string content)
        {
            var senderId = GetUserId();
            if (!senderId.HasValue)
            {
                await Clients.Caller.SendAsync("Error", "Unauthorized");
                return;
            }

            // 发送消息给接收者（不包括发送者自己）
            await Clients.User(receiverId.ToString()).SendAsync("ReceiveMessage", senderId.Value, receiverId, content);
        }

        public async Task MarkAsRead(int messageId)
        {
            var userId = GetUserId();
            if (!userId.HasValue)
            {
                await Clients.Caller.SendAsync("Error", "Unauthorized");
                return;
            }

            // 通知消息已读（只通知相关用户）
            await Clients.Caller.SendAsync("MessageRead", messageId, userId.Value);
        }

        private int? GetUserId()
        {
            var userIdClaim = Context.User?.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int userId))
            {
                return userId;
            }
            return null;
        }

        public static bool IsUserOnline(int userId)
        {
            return _userConnectionIds.ContainsKey(userId);
        }

        public static IEnumerable<int> GetOnlineUsers()
        {
            return _userConnectionIds.Keys;
        }

        // 添加连接统计方法
        public static int GetTotalConnections()
        {
            return _userConnections.Count;
        }

        public static int GetOnlineUserCount()
        {
            return _userConnectionIds.Count;
        }

        // 清理过期连接的方法
        private static void CleanupConnections(object? state)
        {
            try
            {
                var toRemove = new List<string>();

                foreach (var kvp in _userConnections)
                {
                    // 这里可以添加更复杂的清理逻辑
                    // 例如检查连接的活跃时间等
                }

                foreach (var connectionId in toRemove)
                {
                    _userConnections.TryRemove(connectionId, out _);
                }

                // 清理空的用户连接集合
                var usersToRemove = new List<int>();
                foreach (var kvp in _userConnectionIds)
                {
                    if (kvp.Value.Count == 0)
                    {
                        usersToRemove.Add(kvp.Key);
                    }
                }

                foreach (var userId in usersToRemove)
                {
                    _userConnectionIds.TryRemove(userId, out _);
                }
            }
            catch (Exception ex)
            {
                // 日志记录清理错误
                Console.WriteLine($"Connection cleanup error: {ex.Message}");
            }
        }
    }
}