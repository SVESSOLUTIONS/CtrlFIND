<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use TCG\Voyager\Models\Page;

class ContentController extends Controller
{
    
    public function getPageBySlug(Request $request, $slug)
    {
       /* $translation = \Request::input('lang');
        $translation = !empty($translation) ? $translation : 'en';*/
        $page = Page::where('slug','LIKE',$slug)->first();
  /*      $title = $page->getTranslatedAttribute('title', $translation, 'en');
        $slug = $page->getTranslatedAttribute('slug', $translation, 'en');
        $body = $page->getTranslatedAttribute('body', $translation, 'en');*/
  
      $lang = $request->get('lang')??null;
      $page = Page::where('slug','LIKE',$slug)->first();
      if (!is_null($lang)) {
        $page = $page->translate($lang, 'fallbacklocally');
      }
        
        return response()->json(['page' => $page],200);
    }
}
