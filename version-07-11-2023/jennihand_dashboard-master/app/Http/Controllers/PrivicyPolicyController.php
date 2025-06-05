<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use Illuminate\Http\Request;
use App\Models\Subscription;
use App\Models\UserSubscriptions;
use App\Models\Payment;
use Carbon\Carbon;
use Auth;
use Session;
use Redirect;
use DB;
use TCG\Voyager\Models\Page;
use TCG\Voyager\Facades\Voyager;


class PrivicyPolicyController extends Controller
{
    public function index()
    {
        $page = Voyager::model('Page')->where('slug', "privacy-policy")->firstOrFail();
        return view('/vendor/voyager/privicy-policy/index', compact('page'));
    }


}
