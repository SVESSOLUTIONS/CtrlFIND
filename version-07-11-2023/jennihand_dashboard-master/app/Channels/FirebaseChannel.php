<?php
/**
 * Created by PhpStorm.
 * User: Derwaish
 * Date: 4/26/2022
 * Time: 5:08 PM
 */

namespace App\Channels;

use App\Models\User;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class FirebaseChannel
{
  public function send($notifiable, Notification $notification)
  {
    $url = env('FIREBASE_URL');
    $FcmToken = $notification->fcmToken;
    $FcmToken = [$FcmToken];
    
    if(!$notifiable->is_push_notification_enabled ) return;
    
    if(empty($FcmToken)) {
      Log::error('Device ID not exist for push notification!: User ID: ' . $notifiable->id);
      throw new \Exception('Device ID not exist for push notification!');
    }
    
    $serverKey = env('FIREBASE_SERVER_KEY');
    
    $data = [
      "registration_ids" => $FcmToken,
      'notification' => [
        "title" => $notification->title,
        "body" => $notification->message,
      ]
    ];
    
    if(!is_null($notification->data)){
      $data['data'] = $notification->data;
    }
    $encodedData = json_encode($data);
    
    $headers = [
      'Authorization:key=' . $serverKey,
      'Content-Type: application/json',
    ];
    
    $ch = curl_init();
    
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
    // Disabling SSL Certificate support temporarly
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $encodedData);
    
    // Execute post
    $result = curl_exec($ch);
    
    if($result === FALSE) {
      Log::error('Curl failed: ' . curl_error($ch));
      throw new \Exception('Curl failed: ' . curl_error($ch));
    }
    
    // Close connection
    curl_close($ch);
    $result = json_decode($result, true);
    if(!isset($result['success']) || $result['success'] != 1) {
      Log::error('Curl failed: ' . json_encode($result));
    }else{
        Log::info('Notification sent');
        $notificationModel = new \App\Models\Notification();
        $notificationModel->from_id = $notification->from_id;
        $notificationModel->to_id = $notifiable->id;
        $notificationModel->message = $notification->message;
        $notificationModel->title = $notification->title;
        if($notification->order) {
          $notificationModel->order = $notification->order;
          $notificationModel->order_id = $notification->order_id;
        }
        $notificationModel->save();
    }
  }
}
