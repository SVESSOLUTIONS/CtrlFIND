<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Chat;
use App\Models\Message;
use App\Events\Message as PusherMessage;
use Carbon\Carbon;

class ChatController extends Controller
{
    function getUserFriendsList()
    {
       $user = auth()->user();
       $chats = Chat::where('user_id',$user->id)->orWhere('friend_id', $user->id)
       ->latest()->get();
       foreach ($chats as $chat) {
          $friend = null;
          if($chat->friend_id === $user->id) {
              $friend = User::find($chat->user_id , ['id' , 'name' , 'avatar']);
          }else{
              $friend = User::find($chat->friend_id , ['id' , 'name' , 'avatar']);
          }
          $message = Message::where('chat_id' , $chat->id)->latest()->first(['id','createdAt' , 'text' , 'created_at']);
          if(!$friend) {
              $friend = (object) [
                '_id' => rand(200000,500000),
                'avatar' => 'users/default.png',
                'name' => 'Unknown',
              ];
          }
          $chat->setAttribute('friend' ,$friend);
          $chat->setAttribute('message' ,$message);

       }

       return response()->json($chats);
    }

    function getChatMessages($id)
    {
        $messages = Message::where('chat_id' , $id)->latest()->get();
        $formatedMessages =  collect($messages)->map(function ($message) {
            $user = User::find($message->user_id);
           if($user) {
                $data =  (object)[
                    '_id' => $message->id,
                    'createdAt' => $message->createdAt,
                    'text' => $message->text,
                    'user' => (object) [
                        '_id' => $user->id,
                        'avatar' => $user->avatar,
                        'name' => $user->name,
                    ]
                ];
                return $data;
           }else{
                $data =  (object)[
                    '_id' => $message->id,
                    'createdAt' => $message->createdAt,
                    'text' => $message->text,
                    'user' => (object) [
                        '_id' => rand(200000,500000),
                        'avatar' => 'users/default.png',
                        'name' => 'Unknown',
                    ]
                ];
            return $data;
           }
        });
        return response()->json($formatedMessages);
    }

    function createMessage()
    {
        request()->validate([
            'createdAt' => 'required',
            'text' => 'required',
            'friend_id' => 'required',
            'user_id' => 'required',
            'avatar' => 'required',
            'name' => 'required',
        ]);

       $user = auth()->user();
       $friend_id = request()->friend_id;
       $chat = Chat::where(function ($query) use ($friend_id , $user) {
            $query->where('user_id', '=', $user->id)
                  ->where('friend_id', '=', $friend_id);
        })->orWhere(function ($query) use ($friend_id , $user) {
            $query->where('user_id', '=', $friend_id)
                  ->where('friend_id', '=', $user->id);
        })->first();
        if($chat) {
            $message = new Message();
            $message->chat_id = $chat->id;
            $message->user_id = request()->user_id;
            $message->createdAt = Carbon::now();
            $message->text = request()->text;
            if($message->save()) {
              $chat->created_at = Carbon::now();
              $chat->save();
              $data =  (object)[
                  '_id' => $message->id,
                  'createdAt' => $message->createdAt,
                  'text' => $message->text,
                  'user' => (object) [
                      '_id' => request()->user_id,
                      'avatar' => request()->avatar,
                      'name' => request()->name,
                  ]
              ];
              $event = (object)[
                'id' => $friend_id, 'eventType' => 'message', 'data' => $data
              ];
              event(new PusherMessage($event));
              return response()->json($data);
            }

        }else{
            $newChat = new Chat();
            $newChat->user_id = $user->id;
            $newChat->friend_id = $friend_id;
            if($newChat->save()) {
            $message = new Message();
            $message->chat_id = $newChat->id;
            $message->user_id = request()->user_id;
            $message->createdAt = Carbon::now();
            $message->text = request()->text;
            if($message->save()) {
              $data =  (object)[
                  '_id' => $message->id,
                  'createdAt' => $message->createdAt,
                  'text' => $message->text,
                  'user' => (object) [
                      '_id' => request()->user_id,
                      'avatar' =>  request()->avatar,
                      'name' =>  request()->name,
                  ]
              ];
              $event = (object)[
                'id' => $friend_id, 'eventType' => 'message', 'data' => $data
              ];
              event(new PusherMessage($event));
              return response()->json($data);
            }
            }

        }
       return response()->json($chat);

    }

    function getChatId()
    {
        request()->validate([
            'friend_id' => 'required',
        ]);

        $user = auth()->user();
        $friend_id = request()->friend_id;
        $chatUser = User::find($friend_id);

        $chat = Chat::where(function ($query) use ($friend_id , $user) {
            $query->where('user_id', '=', $user->id)
                  ->where('friend_id', '=', $friend_id);
        })->orWhere(function ($query) use ($friend_id , $user) {
            $query->where('user_id', '=', $friend_id)
                  ->where('friend_id', '=', $user->id);
        })->first();

        if($chat) {
            $data = (object)[
                'chat_id' => $chat->id,
                'friend' => (object)[
                    'id' =>  $chatUser->id,
                    'name' => $chatUser->name,
                    'avatar' => $chatUser->avatar,
                ]
                ];
            return response()->json($data);
        }else{
            $data = (object)[
                'chat_id' => 0,
                'friend' => (object)[
                    'id' =>  $chatUser->id,
                    'name' => $chatUser->name,
                    'avatar' => $chatUser->avatar,
                ]
                ];
            return response()->json($data);
        }

    }

    function clearMessages($id)
    {
        Message::where('chat_id' , $id)->delete();
        return response()->noContent();
    }
}
