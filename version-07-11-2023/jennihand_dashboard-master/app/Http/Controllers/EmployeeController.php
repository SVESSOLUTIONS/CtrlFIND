<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Str;
use App\Models\Employee;
use App\Models\ItemReview;
use App\Models\MediaFile;
use App\Models\Item;
use App\Models\User;


class EmployeeController extends Controller
{
    function getEmployees()
    {
        $user = auth()->user();
        $employees = Employee::where(['user_id' => $user->id , 'is_deleted' => 0])->latest()->get();
        return response()->json($employees);
    }

    function addEmployee()
    {
        $validator = Validator::make(\Request::all(), [
            'name' => 'required',
            'designation' => 'required',
            'phone' => 'required|unique:employees,phone',
            'email' => 'required|email|unique:employees,email',
        ]);
        if ($validator->fails()) {
            $errors = $validator->errors()->all();
            return response()->json($errors, 402);
        }

        $user = auth()->user();

        $subscribe = $this->CheckIfUerSubscribed($user);

        if(!$subscribe) 
        {
            return response()->json(['message' => "You are not subscribed."],400);
        }

        $count = Employee::where(['user_id' => $user->id])->count();

        if($subscribe['package']->allowed_employees <= $count) {
            return response()->json(['message' => "allowed employees limit exceed."],400);
        }
       $employee = new Employee();
       $employee->name = request()->name;
       $employee->designation = request()->designation;
       $employee->phone = request()->phone;
       $employee->email = request()->email;
       $employee->user_id = auth()->user()->id;
       if (\Request::input('image')) 
       {
        request()->validate(['image' => 'required|image64:jpeg,jpg,png']);
        $image = request()->get('image');
        $employee->image  = $this->makeImage($image);
       }
       if($employee->save()) 
       {
            return response()->json($employee);       
       }
    }

    function updateEmployee(Employee $employee)
    {
        $validator = Validator::make(\Request::all(), [
            'name' => 'required',
            'designation' => 'required',
            'phone' => 'required|unique:employees,phone,'. $employee->id,
            'email' => 'required|email|unique:employees,email,'. $employee->id,
        ]);
        if ($validator->fails()) {
            $errors = $validator->errors()->all();
            return response()->json($errors, 402);
        }
        $employee->name = request()->name;
        $employee->designation = request()->designation;
        $employee->phone = request()->phone;
        $employee->email = request()->email;
        if (\Request::input('image')) 
        {
         request()->validate(['image' => 'required|image64:jpeg,jpg,png']);
         $image = request()->get('image');
         $employee->image  = $this->makeImage($image);
        }
        if($employee->save()) 
        {
             return response()->json($employee);       
        }
    }

    function getEmployeeServices(Employee $employee) {
        $employee_services = Item::where(['employee_id' => $employee->id , 'item_type' => "service"])
        ->latest()->get(['id' , 'title' , 'price' ,
        'discount_available','discount_type' ,'discount',
        'discount_start_date' , 'discount_end_date']);
    
        foreach ($employee_services as $user_service ) {
         
            $avg = ItemReview::where('item_id' , $user_service->id)->get()->avg('rating');
            $total = ItemReview::where('item_id' , $user_service->id)->count();
            $rating = ["avg" => $avg ? $avg : 0 , "total" => $total];
            $image = MediaFile::where('item_id', $user_service->id)->first('file_path');
            $user_service->setAttribute('image' , $image);
            $user_service->setAttribute('rating' , $rating);

        }
        return response()->json($employee_services);
    }

    function removeEmployeeService(Item $item)
    {
        $item->employee_id = '';
        $item->save();
        return response(200);
    }


    function deleteEmployee(Employee $employee)
    {
        Item::where('employee_id', $employee->id)->update(['employee_id' => '']);
        $employee->delete();
        return response()->noContent();
    }

    public function makeImage($base64_image)
    {
        @list($type, $file_data) = explode(';', $base64_image);
        @list(, $file_data) = explode(',', $file_data);
        $imageName = Str::random(14) . '.' . explode('/', explode(':', substr($base64_image, 0, strpos($base64_image, ';')))[1])[1];
        $save_path = "users/${imageName}";
        Storage::disk('public')->put($save_path, base64_decode($file_data));
        return $save_path;
    }
}
