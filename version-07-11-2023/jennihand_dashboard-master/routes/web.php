<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});
Route::get('/privacy-policy', 'App\Http\Controllers\PrivicyPolicyController@index');



Route::group(['prefix' => 'admin'], function () {
    Voyager::routes();
      Route::get('commission-report', 'App\Http\Controllers\Back\OrderController@commissionreport')->name('orders.commissionreport');

   // Route::resource('faqs', '\App\Http\Controllers\FaqController');


//    Route::get('/vendor/voyager/faq', [\App\Http\Controllers\FaqController::class,'index']);
});

/*Route::get('/reset-password/{token}', function ($token) {
    return view('auth.reset-password', ['token' => $token]);
})->middleware('guest')->name('password.reset');

Route::post('/reset-password', function (Request $request) {
    $request->validate([
        'token' => 'required',
        'email' => 'required|email',
        'password' => 'required|min:8|confirmed',
    ]);

    $status = Password::reset(
        $request->only('email', 'password', 'password_confirmation', 'token'),
        function ($user, $password) {
            $user->forceFill([
                'password' => Hash::make($password)
            ])->setRememberToken(Str::random(60));

            $user->save();

            event(new PasswordReset($user));
        }
    );

    return $status === Password::PASSWORD_RESET
                ? redirect()->route('login')->with('status', __($status))
                : back()->withErrors(['email' => [__($status)]]);
})->middleware('guest')->name('password.update');

Route::get('login/{provider}', [UserController::class,'redirect']);
Route::get('login/{provider}/callback',[UserController::class,'Callback']);

Route::get('/seed', function () {
    $clearcache = Artisan::call('db:seed --class=ProvidersSeeder');
    echo "seed done<br>";
});
*/
