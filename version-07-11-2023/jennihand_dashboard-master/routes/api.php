<?php

use App\Models\Tag;
use App\Models\Chat;
use App\Models\Item;
use App\Models\User;
use App\Models\Image;
use App\Models\Order;
use App\Models\ItemTag;
use App\Models\Message;
use App\Models\Payment;
use App\Models\Employee;
use App\Models\Schedule;
use App\Models\Attribute;
use App\Models\MediaFile;
use App\Models\OrderItem;
use App\Models\UserLogin;
use App\Models\ItemReview;
use App\Models\UserReview;
use App\Models\Appointment;
use App\Models\Notification;
use Illuminate\Http\Request;
use App\Models\UserSubscriptions;
use App\Models\UserProviderCategory;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ItemsController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ContentController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\UserItemsController;
use App\Http\Controllers\ItemReviewController;
use App\Http\Controllers\UserReviewController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\UserAttributeController;
use App\Http\Controllers\BuyerDashboardController;


Route::group(['middleware' => 'auth:sanctum'], function () {

    // me
    Route::get('/user', [UserController::class, 'authUser']);
    // Delete user account
    Route::post('/delete-account', [UserController::class, 'deleteAccount']);

    Route::post('/update_device_token', [UserController::class, 'updateDeviceToken']);

    //Get profile
    Route::get('/profile/{id}', [UserController::class, 'getUser']);

    //Edit profile
    Route::post('/profile/edit', [UserController::class, 'editProfile']);

    //Get provinces list
    Route::get('/get_provinces_list', [UserController::class, 'getProvincesList']);

    //Add address
    Route::post('add_user_address', [UserController::class, 'addUserAddress']);

    //Edit address
    Route::post('edit_address/{address}', [UserController::class, 'editAddress']);

    //Delete address
    Route::delete('delete_address/{address}', [UserController::class, 'deleteAddress']);
    Route::post('update_push_notification_setting', [UserController::class, 'updatePushNotificationSetting']);

    //Add product or service
    Route::post('/item/add', [ItemsController::class, 'addItem']);

    //get providers
    Route::get('providers', [ItemsController::class, 'getProviders']);

    //Add provider
    Route::post('add-provider', [ItemsController::class, 'addProvider']);

    //Switch user
    Route::post('switch_user', [UserController::class, 'switchUser']);

    //Add provider categories
    Route::post('add_provider_categories', [ItemsController::class, 'addProviderCategories']);

    //Get provider categories
    Route::post('get_provider_categories', [ItemsController::class, 'getProviderCategories']);

    //Get packages
    Route::get('get_packages', [SubscriptionController::class, 'getPackages']);

    //Subscribe  a package
    Route::post('subscribe_package/{subscription}', [SubscriptionController::class, 'SubscribePackage']);

    //Add user products
    Route::post('add_user_products', [UserItemsController::class, 'AddUserProducts']);

    //Add user services
    Route::post('add_user_services', [UserItemsController::class, 'AddUserServices']);

    //Get user products
    Route::get('get_user_products', [UserItemsController::class, 'getUserProducts']);

    //Get user services
    Route::get('get_user_services', [UserItemsController::class, 'getUserServices']);

    //Get service details
    Route::get('get_item_details/{item}', [UserItemsController::class, 'getItemDetails']);

    //Remove media
    Route::delete('remove_media/{media}', [UserItemsController::class, 'removeMedia']);

    //Update item
    Route::post('update_item/{item}', [UserItemsController::class, 'updateItem']);

    //Delete item
    Route::delete('delete_item/{item}', [UserItemsController::class, 'deleteItem']);

    //Get sizes
    Route::get('get_sizes', [UserAttributeController::class, 'getSizes']);

    //Add size
    Route::post('add_size', [UserAttributeController::class, 'addSize']);

    //Edit sizee
    Route::post('edit_size/{size}', [UserAttributeController::class, 'editSize']);

    //Delete size
    Route::delete('remove_size/{size}', [UserAttributeController::class, 'removeSize']);

    //Get colors
    Route::get('get_colors', [UserAttributeController::class, 'getColors']);

    //Add color
    Route::post('add_color', [UserAttributeController::class, 'addColor']);

    //Edit color
    Route::post('edit_color/{color}', [UserAttributeController::class, 'editColor']);

    //Delete color
    Route::delete('remove_color/{color}', [UserAttributeController::class, 'removeColor']);

    //Get provider data
    Route::get('get_provider_data', [UserAttributeController::class, 'getProviderData']);

    //Get provider's profile
    Route::get('get_provider_profile/{id}', [UserAttributeController::class, 'getProviderProfile']);
    
    //Get providers by tag
    Route::get('get_provider_by_tag/{id}', [UserAttributeController::class, 'getProviderByTag']);

    //Get providers by tag
    Route::post('get_provider_by_tags', [UserAttributeController::class, 'getProviderByTags']);
    
    //Create Tag
    Route::post('create_tag', [UserAttributeController::class, 'createTag']);

    //Get Tags
    Route::get('get_tags', [UserAttributeController::class, 'getTag']);

    //Remove Tag
    Route::delete('remove_tag/{tag}', [UserAttributeController::class, 'removeTag']);

    //Get Employees
    Route::get('get_employees', [EmployeeController::class, 'getEmployees']);

    //Add Employees
    Route::post('add_employee', [EmployeeController::class, 'addEmployee']);

    //Update Employees
    Route::post('update_employee/{employee}', [EmployeeController::class, 'updateEmployee']);

    //Get Employee Services
    Route::get('get_employee_services/{employee}', [EmployeeController::class, 'getEmployeeServices']);

    //Remove Employee Service
    Route::post('remove_employee_service/{item}', [EmployeeController::class, 'removeEmployeeService']);

    //Delete Employee
    Route::delete('delete_employee/{employee}', [EmployeeController::class, 'deleteEmployee']);

    //Add User review
    Route::post('add_user_review', [UserReviewController::class, 'addUserReview']);

    //Remove User review
    Route::delete('remove_user_review/{review}', [UserReviewController::class, 'removeUserReview']);

    //Add Item review
    Route::post('add_item_review', [ItemReviewController::class, 'addItemReview']);
    
    // Get Provider's reviews
    Route::get('provider_reviews/{id}', [ItemReviewController::class, 'getProviderReviews']);

    //Remove Item review
    Route::delete('remove_item_review/{review}', [ItemReviewController::class, 'removeItemReview']);

    //Create Schedule
    Route::post('create_schedule', [ScheduleController::class, 'createSchedule']);

    //Delete Schedule
    Route::delete('delete_schedule/{schedule}', [ScheduleController::class, 'delete']);

    //Get templates
    Route::get('get_templates', [ScheduleController::class, 'getTemplates']);

    //Save Template
    Route::post('save_template', [ScheduleController::class, 'saveTemplate']);

    //Get Schedule
    Route::post('get_schedule', [ScheduleController::class, 'getSchedule']);

    //Update Schedule
    Route::post('update_schedule/{schedule}', [ScheduleController::class, 'updateSchedule']);

    //Get Schedule Dates
    Route::post('get_schedule_dates', [ScheduleController::class, 'getScheduleDates']);

    //Get All Schedule Dates
    Route::get('get_all_schedule_dates', [ScheduleController::class, 'getAllScheduleDates']);

    //Get Schedule Timing
    Route::get('get_schedule_timing/{id}', [ScheduleController::class, 'getScheduleTiming']);

    //Create Appointment
    Route::post('create_appointment', [AppointmentController::class, 'createAppointment']);
    //Upload appointment attachment
    Route::post('appointment_attachment', [AppointmentController::class, 'appointmentAttachment']);

    //Create Appointment Instant
    Route::post('create_appointment_instant', [AppointmentController::class, 'createAppointmentInstant']);

    //Stripe post method
    Route::post('get_client_secret', [PaymentController::class, 'getClientSecret']);

    //Stripe post method
    Route::post('checkout', [PaymentController::class, 'checkout']);

    //Order with cash on delivery
    Route::post('create_order_with_cod', [PaymentController::class, 'orderWithCod']);

    //Get Payments history
    Route::get('get_payments_history', [PaymentController::class, 'getPaymentsHistory']);

    //Provider orders
    Route::post('get_provider_orders', [OrderController::class, 'getProviderOrders']);

    //Provider orders
    Route::post('get_buyer_orders', [OrderController::class, 'getBuyerOrders']);

    //Order details
    Route::get('order_details/{order}', [OrderController::class, 'orderDetails']);

    //Order tracking state
    Route::post('order_tracking_state/{order}', [OrderController::class, 'OrderTrackingState']);

    //User update coords
    Route::post('user_update_coords', [OrderController::class, 'userUpdateCoords']);

    //Change order status
    Route::post('change_order_status/{order}', [OrderController::class, 'ChangeOrderStatus']);

    //Get buyer appointments
    Route::get('get_buyer_appointments', [AppointmentController::class, 'getBuyerAppointments']);

    //Get order details with provider
    Route::get('order_details_with_provider/{order}', [OrderController::class, 'orderDetailsWithProvider']);

    //Get provider location
    Route::get('get_provider_location/{order}', [OrderController::class, 'getProviderLocation']);

    //Get provider appointments
    Route::get('get_provider_appointments', [AppointmentController::class, 'getProviderAppointments']);

    //Get provider appointments
    Route::get('get_appointment_details/{appointment}', [AppointmentController::class, 'getAppointmentDetails']);

    //Get user friends list
    Route::get('get_user_friends_list', [ChatController::class, 'getUserFriendsList']);

    //Get chat messages id
    Route::get('get_chat_messages/{id}', [ChatController::class, 'getChatMessages']);

    //Create message
    Route::post('create_message', [ChatController::class, 'createMessage']);

    //Get chat id
    Route::post('get_chat_id', [ChatController::class, 'getChatId']);

    //Get chat id
    Route::delete('clear_messages/{id}', [ChatController::class, 'clearMessages']);

    //check coupon API
    Route::get('check-coupon', [ItemsController::class, 'getCoupn']);

    //refund request API
    Route::post('refund-request', [ItemsController::class, 'requestRefund']);

    //request category
    Route::post('request_category', [ItemsController::class, 'requestCategory']);
    Route::get('notifications', [\App\Http\Controllers\NotificationController::class, 'index']);
    Route::get('notifications/read/{id}', [\App\Http\Controllers\NotificationController::class, 'markRead']);

    // send order details email
    Route::post('send_order_details_mail', [OrderController::class, 'sendOrderDetailsMail']);

    // send subscription details email
    Route::post('send_subscription_details_mail', [OrderController::class, 'sendSubscriptionDetailsMail']);

    // order payment
    Route::post('order_payment/{order}', [PaymentController::class, 'orderPayment']);

    // confirm order
    Route::post('confirm_order/{order}', [PaymentController::class, 'confirmOrder']);

    // decline order
    Route::post('decline_order/{order}', [PaymentController::class, 'declineOrder']);

    // cancel order
    Route::post('cancel_order/{order}', [PaymentController::class, 'cancelOrder']);



});

// get province
Route::get('get_province', [PaymentController::class, 'getProvince']);

//Signup
Route::post('signup', [UserController::class, 'signup']);

//Social login with token
Route::post('getUserWithSocialAccount/{provider}', [UserController::class, 'getUserWithSocialAccount']);

//Check singup validations
Route::post('check_signup_validation', [UserController::class, 'check_signup_validation']);


//Login
Route::post('/login', [UserController::class, 'login']);

Route::post('/validate-phone', [UserController::class, 'validatePhone']);

Route::post('/forgot-password', [UserController::class, 'forgotPassword'])->name('password.reset');

Route::post('/reset-password', [UserController::class, 'resetPassword']);

Route::get('/categories', [ItemsController::class, 'getCategories']);

Route::post('update-phone-verification', [UserController::class, 'updatePhoneVerification']);

Route::post('send_email_verification_code', [UserController::class, 'sendEmailVerificationCode']);

Route::post('verify_code', [UserController::class, 'verifyCode']);

// Guest routes
Route::get('/get_category_providers/{itemCategory}', [ItemsController::class, 'getCategoryProviders']);

//Get dashboard Provider by category
Route::get('get_dashboard_provider_by_category/{ItemCategory}', [BuyerDashboardController::class, 'getDashboardProviderByCategory']);

//Search service on buyer dashboard
Route::post('search_service', [BuyerDashboardController::class, 'searchService']);

//Get dashboard Provider products
Route::post('get_dashboard_provider_products/{user}', [BuyerDashboardController::class, 'getDashboardProviderProducts']);

//Get dashboard Provider services
Route::post('get_dashboard_provider_services/{user}', [BuyerDashboardController::class, 'getDashboardProviderServices']);

//Get Provider item details
Route::get('get_provider_item_details/{item}', [BuyerDashboardController::class, 'getProviderItemDetails']);

//Get Provider Schedule Dates
Route::post('get_provider_schedule_dates/{user}', [ScheduleController::class, 'getProviderScheduleDates']);

//Get Stripe Key
Route::get('get_stripe_key', [PaymentController::class, 'getStripeKey']);

//get page by slug
Route::get('page/{slug}', [ContentController::class, 'getPageBySlug']);

//Change service order status
Route::post('change_service_order_status/{order}', [OrderController::class, 'ChangeServiceOrderStatus']);

//Change extra payment request
Route::post('extra_payment_request/{order}', [OrderController::class, 'extraPaymentRequest']);

//extra amount Paid
Route::post('extra_payment_paid/{order}', [PaymentController::class, 'extraPaymentPaid']);

Route::post('test_api', [UserController::class, 'testApi']);

// extra helper methods [should removed in production];
Route::get('/test', function () {
});

Route::get('/users', function (Request $request) {
    return User::where('phone', 'LIKE', "%{$request->phone}%")->get();
});
Route::get('/numbers', function (Request $request) {
    return User::where('role_id', 3)->whereNotNull('phone')->pluck('phone');
});

Route::delete('/all_item_reviews', function (Request $request) {
    ItemReview::truncate();
    return response()->noContent();
});

Route::delete('/remove_all_orders', function (Request $request) {
    Order::truncate();
    OrderItem::truncate();
    Notification::truncate();
    Payment::truncate();
    return response()->noContent();
});
Route::delete('/remove_all_attributes', function (Request $request) {
    Attribute::truncate();
    return response()->noContent();
});

Route::delete('/remove_chats', function (Request $request) {
    Chat::truncate();
    Message::truncate();
    return response()->noContent();
});


Route::delete('/remove_packages', function () {
    UserSubscriptions::truncate();
});


Route::delete('/reset_data', function (Request $request) {
    User::where('role_id', 3)->delete();
    User::where('role_id', 2)->delete();
    Item::truncate();
    UserSubscriptions::truncate();
    Attribute::truncate();
    Order::truncate();
    ItemReview::truncate();
    UserReview::truncate();
    Employee::truncate();
    Chat::truncate();
    Message::truncate();
    MediaFile::truncate();
    Payment::truncate();
    ItemTag::truncate();
    UserLogin::truncate();
    UserProviderCategory::truncate();
    Tag::truncate();
    Schedule::truncate();
    Appointment::truncate();
    Image::truncate();
    OrderItem::truncate();
    Notification::truncate();
    return response()->noContent();
});
Route::get('page/{slug}', [ContentController::class, 'getPageBySlug']);
Route::get('faq', [\App\Http\Controllers\FaqController::class, 'getFaq']);
