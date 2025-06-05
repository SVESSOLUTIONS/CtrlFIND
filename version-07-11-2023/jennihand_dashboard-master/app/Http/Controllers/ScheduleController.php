<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\ItemCategory;
use App\Models\Schedule;
use App\Models\Template;
use App\Models\Employee;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;




class ScheduleController extends Controller
{
    function createSchedule(Request $request)
    {
        $user = auth()->user();
        $validator = Validator::make(\Request::all(), [
            'total_slots' => 'required|integer',
            'category_id' => 'required',
            'employee_id' => 'required',
            'booking_date' => 'required|date',
            'area' => 'required',
            'area_lat' => 'required',
            'area_lng' => 'required',
            'closing_time' => 'required',
            'opening_time' => 'required',
            'radius' => 'required|integer',
            'slots_data' => 'required',
            'timing' => 'required|integer',
            'timing_type' => 'required'
        ]);
        if ($validator->fails()) {
            $errors = $validator->errors()->all();
            return response()->json($errors, 402);
        }
        $isExist = Schedule::where(['employee_id' => $request->employee_id, 'category_id' => $request->category_id])
        ->whereDate('booking_date', '=', $request->booking_date)->first();

        if($isExist) {
            return response()->json(['it is already scheduled.'] ,400);
        }
        $slotsEncodedData = json_encode($request->slots_data);

        $schedule = new Schedule();
        $schedule->user_id = $user->id;
        $schedule->category_id = $request->category_id;
        $schedule->total_slots = $request->total_slots;
        $schedule->availible_slots = $request->total_slots;
        $schedule->booked_slots = 0;
        $schedule->booking_date = $request->booking_date;
        $schedule->employee_id = $request->employee_id;
        $schedule->area = $request->area;
        $schedule->area_lat = $request->area_lat;
        $schedule->area_lng = $request->area_lng;
        $schedule->opening_time = $request->opening_time;
        $schedule->closing_time = $request->closing_time;
        $schedule->radius = $request->radius;
        $schedule->slots_data = $slotsEncodedData;
        $schedule->timing = $request->timing;
        $schedule->timing_type = $request->timing_type;

        if($schedule->save()) {
           $category =  ItemCategory::find($schedule->category_id , ['id' , 'name']);
           $employee =  Employee::find($schedule->employee_id , ['id' , 'name']);
           $schedule->setAttribute('category' , $category);
           $schedule->setAttribute('employee' , $employee);
           return response()->json($schedule);
        }

        return response()->json($schedule);
    }

    //  function getSchedule(Request $request)
    //  {
    //      $request->validate([
    //          'booking_date' => 'required|date'
    //      ]);

    //      $user = auth()->user();
    //      $schedules = Schedule::where('user_id',$user->id)
    //      ->whereDate('booking_date', '=', $request->booking_date)
    //      ->get();
    //      foreach($schedules as $schedule) {
    //          $category =  ItemCategory::find($schedule->category_id , ['id' , 'name']);
    //          $employee =  Employee::find($schedule->employee_id , ['id' , 'name']);
    //          $schedule->setAttribute('category' , $category);
    //          $schedule->setAttribute('employee' , $employee);

    //      }
    //      return response()->json($schedules);
    //  }
   function getSchedule(Request $request)
{
   $request->validate([
       'booking_date' => 'required|date'
   ]);

   $user = auth()->user();
   $schedules = Schedule::where('user_id',$user->id)
       ->whereDate('booking_date', '=', $request->booking_date)
       ->get();
       // dd($schedules);
   // Get the current date and time
   $now = Carbon::now();
   foreach($schedules as $schedule) {
       $category =  ItemCategory::find($schedule->category_id , ['id' , 'name']);
       $employee =  Employee::find($schedule->employee_id , ['id' , 'name']);
       $schedule->setAttribute('category' , $category);
       $schedule->setAttribute('employee' , $employee);

       // If the booking date is today, skip time slots that have already passed
        if ($now->isSameDay($schedule->booking_date)) {

           $slots_data = json_decode($schedule->slots_data, true);
           $filtered_slots = [];

           foreach ($slots_data as $slot) {

               try {
                   $start_time = Carbon::createFromFormat('h:i A - h:i A', $slot);
                   if ($now->lessThan($start_time)) {
                       $filtered_slots[] = $slot;
                   }
               } catch (\Exception $e) {
                   // Handle the error, such as logging the error message or skipping the invalid data.
                   continue;
               }
               // $start_time = Carbon::createFromFormat('h:i A', substr($slot, 0, 8));
//               $start_time = Carbon::createFromFormat('h:i A - h:i A', $slot);
//
//               // $start_time = Carbon::createFromFormat('h:i A', substr($slot, 0, -3));
//               if ($now->lessThan($start_time)) {
//                   $filtered_slots[] = $slot;
//               }
           }
           $schedule->setAttribute('slots_data', $filtered_slots);
       }
   }

   return response()->json($schedules);
}

    function updateSchedule(Schedule $schedule, Request $request)
    {
        $validator = Validator::make(\Request::all(), [
            'total_slots' => 'required|integer',
            'timing_type' => 'required',
            'timing' => 'required',
            'slots_data' => 'required',
            'radius' => 'required',
            'opening_time' => 'required',
            'closing_time' => 'required',
            'area_lng' => 'required',
            'area_lat' => 'required',
            'area' => 'required',
            'employee_id' => 'required',
            // 'booked_slots' => 'required',
            'category_id' => 'required',
        ]);
        if ($validator->fails()) {
            $errors = $validator->errors()->all();
            return response()->json($errors, 402);
        }
        $schedule->total_slots = $request->total_slots;
        $schedule->timing_type = $request->timing_type;
        $schedule->timing = $request->timing;
        $schedule->slots_data = $request->slots_data;
        $schedule->radius = $request->radius;
        $schedule->opening_time = $request->opening_time;
        $schedule->closing_time = $request->closing_time;
        $schedule->area_lng = $request->area_lng;
        $schedule->area_lat = $request->area_lat;
        $schedule->area = $request->area;
        $schedule->employee_id = $request->employee_id;
        // $schedule->booked_slots = $request->booked_slots;
        $schedule->category_id = $request->category_id;
        $schedule->availible_slots = (int)$request->total_slots - $request->booked_slots;
        $schedule->save();
        $category =  ItemCategory::find($schedule->category_id , ['id' , 'name']);
        $employee =  Employee::find($schedule->employee_id , ['id' , 'name']);
        $schedule->setAttribute('category' , $category);
        $schedule->setAttribute('employee' , $employee);
        return response()->json($schedule);
    }

    function getScheduleDates()
    {
        $validator = Validator::make(\Request::all(), [
            'category_id' => 'required|integer',
        ]);
        if ($validator->fails()) {
            $errors = $validator->errors()->all();
            return response()->json($errors, 402);
        }

        $user = auth()->user();
        $dates =  Schedule::where(['user_id' => $user->id , 'category_id' => request()->category_id])
        ->whereDate('booking_date', '>=', Carbon::now())->pluck('booking_date');
        $formated_dates = $dates->map(function($date) {
           return $date->format("Y-m-d");
        });
        return response()->json($formated_dates);
    }

    function getAllScheduleDates()
    {
        $user = auth()->user();
        $dates =  Schedule::where('user_id' , $user->id)
        ->whereDate('booking_date', '>=', Carbon::now())->pluck('booking_date');
        $formated_dates = $dates->map(function($date) {
           return $date->format("Y-m-d");
        });
        return response()->json($formated_dates);
    }

    function getScheduleTiming($id)
    {
        $slots_timing =  Schedule::find($id);

        if($slots_timing) {
             return response()->json($slots_timing);
        }else{
            return response()->json(['message' => 'No Slots Found..'] , 400);
        }
    }

    function getProviderScheduleDates(User $user , Request $request)
    {
        $request->validate([
            'category_id' => 'required'
        ]);
        $schedules =  Schedule::where(['user_id' => $user->id ,
        'category_id' => $request->category_id])
       ->whereDate('booking_date', '>=', Carbon::now())->get(['id' , 'booking_date', 'employee_id']);
        $booked_dates =  Schedule::where(['user_id' => $user->id ,
         'category_id' => $request->category_id , 'availible_slots' => 0])
        ->whereDate('booking_date', '>=', Carbon::now())->pluck('booking_date');
        $availible_dates =  Schedule::where(['user_id' => $user->id ,
         'category_id' => $request->category_id ])->whereNotIn('availible_slots' ,[0])
        ->whereDate('booking_date', '>=', Carbon::now())->pluck('booking_date');
        $booked_formated_dates = $booked_dates->map(function($date) {
           return $date->format("Y-m-d");
        });
        $availible_formated_dates = $availible_dates->map(function($date) {
            return $date->format("Y-m-d");
         });
        return response()->json([
         'schedules' => $schedules,
         'booked' => $booked_formated_dates ,
         'availible' => $availible_formated_dates]);
    }

    function saveTemplate(Request $request)
    {
        $user = auth()->user();
        $validator = Validator::make(\Request::all(), [
            'name' => 'required|unique:templates,name,NULL,id,user_id,'.$user->id,
            'total_slots' => 'required|integer',
            'category_id' => 'required',
            'employee_id' => 'required',
            'area' => 'required',
            'area_lat' => 'required',
            'area_lng' => 'required',
            'closing_time' => 'required',
            'opening_time' => 'required',
            'radius' => 'required|integer',
            // 'slots_data' => 'required',
            'timing' => 'required|integer',
            'timing_type' => 'required'
        ]);
        if ($validator->fails()) {
            $errors = $validator->errors()->all();
            return response()->json($errors, 402);
        }

        // $slotsEncodedData = json_encode($request->slots_data);

        $template = new Template();
        $template->user_id = $user->id;
        $template->name = $request->name;
        $template->category_id = $request->category_id;
        $template->total_slots = $request->total_slots;
        $template->employee_id = $request->employee_id;
        $template->area = $request->area;
        $template->area_lat = $request->area_lat;
        $template->area_lng = $request->area_lng;
        $template->opening_time = $request->opening_time;
        $template->closing_time = $request->closing_time;
        $template->radius = $request->radius;
        $template->slots_data = '';
        $template->timing = $request->timing;
        $template->timing_type = $request->timing_type;
        $template->save();

        return response()->json($template->refresh());
    }

    function getTemplates()
    {
        $user = auth()->user();
        $templates =  Template::where('user_id' , $user->id)->get();
        return response()->json($templates);
    }

    public function delete(Request $request, $id)
    {
        $schedule = Schedule::find($id);
        if ($schedule) {
            $schedule->delete();
            return response()->json(['message' => 'Schedule deleted.'] , 200);
        }
        return response()->json(['message' => 'Schedule id is invalid.'] , 400);
        //return $schedule;
    }

}
