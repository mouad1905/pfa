<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = Notification::where('id_user', Auth::id())
            ->orderByDesc('created_at')
            ->get();
        return response()->json(['data' => $notifications]);
    }

    public function unreadCount()
    {
        $count = Notification::where('id_user', Auth::id())
            ->where('lu', false)
            ->count();
        return response()->json(['unread_count' => $count]);
    }

    public function markAsRead($id)
    {
        $notification = Notification::where('id_user', Auth::id())
            ->findOrFail($id);
        $notification->update(['lu' => true]);
        return response()->json(['status' => 'success']);
    }

    public function markAllAsRead()
    {
        Notification::where('id_user', Auth::id())
            ->where('lu', false)
            ->update(['lu' => true]);
        return response()->json(['status' => 'success']);
    }

    public function destroy($id)
    {
        $notification = Notification::where('id_user', Auth::id())
            ->findOrFail($id);
        $notification->delete();
        return response()->json(['status' => 'success']);
    }

    public function destroyAll()
    {
        Notification::where('id_user', Auth::id())->delete();
        return response()->json(['status' => 'success']);
    }
}
