<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Item;
use App\Models\Image;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Schedule;
use App\Models\Appointment;
use Illuminate\Support\Str;
use App\Models\ItemCategory;
use Illuminate\Http\Request;
use App\Notifications\PushNotification;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Notifications\Notification;


class AppointmentController extends Controller
{
    function getBuyerAppointments()
    {
        $user = auth()->user();
       $appointments = Appointment::where('buyer_id',$user->id)
        ->select('id' ,'item_id', 'appointment_date','status','appointment_time',
        'address_label','amount')->orderBy('appointment_date', 'DESC')->get();
        foreach ($appointments as $appointment)
        {
            $item = Item::find($appointment->item_id , ['id' , 'title' , 'category_id']);
            $category = ItemCategory::find($item->category_id,['id' , 'name']);
            $appointment->setAttribute('item' , $item);
            $appointment->setAttribute('category' , $category);
        }

        return response()->json($appointments);

    }

    function getProviderAppointments()
    {
       $user = auth()->user();
       $appointments = Appointment::where('provider_id',$user->id)
        ->select('id' ,'item_id', 'appointment_date','appointment_time',
        'address_label','amount')->orderBy('appointment_date', 'DESC')->get();
        foreach ($appointments as $appointment)
        {
            $item = Item::find($appointment->item_id , ['id' , 'title' , 'category_id']);
            $category = ItemCategory::find($item->category_id,['id' , 'name']);
            $appointment->setAttribute('item' , $item);
            $appointment->setAttribute('category' , $category);
        }

        return response()->json($appointments);

    }

    function getAppointmentDetails(Appointment $appointment)
    {
        $item = Item::find($appointment->item_id , ['id' , 'title' , 'category_id']);
        $category = ItemCategory::find($item->category_id,['id' , 'name']);
        $images = Image::where('appointment_id' , $appointment->id)->get();
        $appointment->setAttribute('item' , $item);
        $appointment->setAttribute('category' , $category);
        $appointment->setAttribute('images' , $images);
        return response()->json($appointment);
    }

    function createAppointment(Request $request)
    {
        $validator = Validator::make(\Request::all(), [
            'provider_id' => 'required',
            'item_id' => 'required',
            'schedule_id' => 'required',
            'appointment_date' => 'required|date',
            'appointment_time' => 'required',
            'address_label' => 'required',
            'address' => "required",
            'price'=>'required'
        ]);
        if ($validator->fails()) {
            $errors = $validator->errors()->all();
            return response()->json($errors, 402);
        }
        
        $schedule = Schedule::find($request->schedule_id);

        if($schedule->availible_slots) {
            $appointment = new Appointment();
            $appointment->buyer_id = $request->user()->id;
            $appointment->provider_id = $request->provider_id;
            $appointment->amount = $request->price;
            $appointment->item_id = $request->item_id;
            $appointment->appointment_date = $request->appointment_date;
            $appointment->appointment_time = $request->appointment_time;
            $appointment->address_label = $request->address_label;
            $appointment->address = $request->address;
            $appointment->lat = $request->lat;
            $appointment->lng = $request->lng;
            if($request->information) {
                $appointment->information = $request->information;
            }

            $appointment->save();

            $schedule->availible_slots -=1;
            $schedule->booked_slots +=1;
            if($schedule->slots_data) {
                $decodedSlots = json_decode($schedule->slots_data);
                $filtered = collect($decodedSlots)->map(function ($value) use ($request) {
                    if($value !== $request->appointment_time) {
                        return $value;
                    }else{
                        return 'BOOKED';
                    }
                });
              $encodedSlots = json_encode($filtered);
              $schedule->slots_data = $encodedSlots;
            }
            $schedule->save();
            $images_encoded = json_encode(request()->images);
            $images = json_decode(request()->images_encoded);

            if($images) {
                foreach ($images as $image ) {
                      $save_path = $this->makeImage($image->uri);
                      $media = new Image();
                      $media->appointment_id = $appointment->id;
                      $media->file_path = $save_path;
                      $media->save();
                  }
            }

            Payment::create([
                'buyer_id' => $request->user()->id,
                'provider_id' => $request->provider_id,
                'appointment_id' => $appointment->id,
                'service_type' => "appointment",
                'amount' => $request->price,
            ]);

           $all_images = Image::where('appointment_id' , $appointment->id)->get();

           $appointment->setAttribute('images' ,$all_images);
  
           /*@todo Change to user to user to send notification*/
          //Notification::send($to_user, new PushNotification($request->user()->name . ' added you in favorite list', '', $to_user->device_id));
  
  
  
          return response()->json($appointment);

        }else{
            return response()->json(['There are currently no appointment available.']);
        }

    
    }

    function appointmentAttachment(Request $request)
    {
        $validator = Validator::make(\Request::all(), [
            'attachment' => 'max:2120',
            'attachment_1' => 'max:2120',
            'attachment_2' => 'max:2120',
        ]);
        if ($validator->fails()) {
            $errors = $validator->errors()->all();
            return response()->json($errors, 402);
        }
        $order_id = $request->order_id;
        $is_succss = false;
        if ($request->hasfile('attachment')) {
            $file = $request->file('attachment');
            $extension = $file->getClientOriginalExtension();
            $filename = time() . random_int(1000, 9999).'.' . $extension;
            Storage::disk('public')->put("appointments/".$filename, file_get_contents($file));
            $order = Order::find($order_id);
            $order->update(['attachment' => $filename]);
            $is_succss = true;
        }
        if ($request->hasfile('attachment_1')) {
            $file = $request->file('attachment_1');
            $extension = $file->getClientOriginalExtension();
            $filename = time() . random_int(1000, 9999).'.' . $extension;
            Storage::disk('public')->put("appointments/".$filename, file_get_contents($file));
            $order = Order::find($order_id);
            $order->update(['attachment_1' => $filename]);
            $is_succss = true;
        }
        if ($request->hasfile('attachment_2')) {
            $file = $request->file('attachment_2');
            $extension = $file->getClientOriginalExtension();
            $filename = time() . random_int(1000, 9999).'.' . $extension;
            Storage::disk('public')->put("appointments/".$filename, file_get_contents($file));
            $order = Order::find($order_id);
            $order->update(['attachment_2' => $filename]);
            $is_succss = true;
        }
        if ($is_succss)
            return response()->json(["message" => "Attachmens uploaded successfully."]);
        else
            return response()->json(["message" => "No file found"]);
        
    }


    function createAppointmentInstant(Request $request)
    {
        $validator = Validator::make(\Request::all(), [
            'provider_id' => 'required',
            'item_id' => 'required',
            'address_label' => 'required',
            'address' => "required",
            'price'=>'required'
        ]);
        if ($validator->fails()) {
            $errors = $validator->errors()->all();
            return response()->json($errors, 402);
        }
        
       
            $appointment = new Appointment();
            $appointment->buyer_id = $request->user()->id;
            $appointment->provider_id = $request->provider_id;
            $appointment->amount = $request->price;
            $appointment->item_id = $request->item_id;
            $appointment->address_label = $request->address_label;
            $appointment->appointment_date = Carbon::now();
            $appointment->address = $request->address;
            $appointment->lat = $request->lat;
            $appointment->lng = $request->lng;
            if($request->information) {
                $appointment->information = $request->information;
            }

            $appointment->save();
            $images_encoded = json_encode(request()->images);
            $images = json_decode(request()->images_encoded);
            if($images) {
                foreach ($images as $image ) {
                      $save_path = $this->makeImage($image->uri);
                      $media = new Image();
                      $media->appointment_id = $appointment->id;
                      $media->file_path = $save_path;
                      $media->save();
                  }
            }
            Payment::create([
                'buyer_id' => $request->user()->id,
                'provider_id' => $request->provider_id,
                'appointment_id' => $appointment->id,
                'service_type' => "appointment",
                'amount' => $request->price,
            ]);

           $all_images = Image::where('appointment_id' , $appointment->id)->get();

           $appointment->setAttribute('images' ,$all_images);

            return response()->json($appointment);
    
    }

    public function makeImage($base64_image)
    {
        @list($type, $file_data) = explode(';', $base64_image);
        @list(, $file_data) = explode(',', $file_data);
        $imageName = Str::random(14) . '.' . explode('/', explode(':', substr($base64_image, 0, strpos($base64_image, ';')))[1])[1];
        $save_path = "appointments/images/${imageName}";
        Storage::disk('public')->put($save_path, base64_decode($file_data));
        return $save_path;
    }
}
